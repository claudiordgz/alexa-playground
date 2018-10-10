import * as puppeteer from 'puppeteer'
import * as request from 'request-promise'
import { Rekognition } from 'aws-sdk'
import { AlexaAutomationConfig } from './types'
import { v1p3beta1 } from '@google-cloud/vision'

const getCaptchaImageSrc = (page: puppeteer.Page): Promise<string> =>
  page.evaluate(() => {
    const captchaImage: HTMLImageElement | null = document.querySelector('#auth-captcha-image-container > img')
    if (captchaImage) {
      return captchaImage.src
    }
  })

export async function useRekognitionToSolveCaptcha (configuration: AlexaAutomationConfig, imageBody: string) {
  const rekognition = new Rekognition({ region: configuration.awsRegion })
  const response: Rekognition.Types.DetectTextResponse = await rekognition.detectText({
    Image: {
      Bytes: imageBody
    }
  }).promise()
  return response.TextDetections ? response.TextDetections.map(detection => detection.DetectedText).join(' ') : ''
}

export async function useGoogleCloudVisionToSolveCaptcha (_: AlexaAutomationConfig, imageBody: string) {
  const client = new v1p3beta1.ImageAnnotatorClient()
  const results = await client
    .documentTextDetection({
      image: {
        content: imageBody
      },
      feature: {
        languageHints: ['en-t-i0-handwrit']
      }
    })
  return results[0].fullTextAnnotation.text
}

export async function solveCaptcha (configuration: AlexaAutomationConfig, page: puppeteer.Page) {
  const imageUri = await getCaptchaImageSrc(page)
  const body = await request({ uri: imageUri, encoding: null })
  // neither amazon rekognition nor google cloud vision api is ready to solve captchas
  const solution = await useRekognitionToSolveCaptcha(configuration, body)
}
