import * as puppeteer from 'puppeteer'
import * as request from 'request-promise'
import { Rekognition } from 'aws-sdk'
import { AlexaAutomationConfig } from './types'

const getCaptchaImageSrc = (page: puppeteer.Page): Promise<string> =>
  page.evaluate(() => {
    const captchaImage: HTMLImageElement | null = document.querySelector('#auth-captcha-image-container > img')
    if (captchaImage) {
      return captchaImage.src
    }
  })

export async function useRekognitionToSolveCaptcha (configuration: AlexaAutomationConfig, imageBody: string) {
  const rekognition = new Rekognition({ region: configuration.awsRegion })
  const response2 = await rekognition.detectText({
    Image: {
      Bytes: imageBody
    }
  }).promise()
  return response2
}

export async function solveCaptcha (configuration: AlexaAutomationConfig, page: puppeteer.Page) {
  const imageUri = await getCaptchaImageSrc(page)
  const body = await request({ uri: imageUri, encoding: null })
  const solution = await useRekognitionToSolveCaptcha(configuration, body)
}
