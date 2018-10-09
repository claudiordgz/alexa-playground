import * as puppeteer from 'puppeteer'
import { retrieveUrlFromString } from './retrieveUrlFromString'
import { AlexaAutomationConfig } from './types'
import { solveCaptcha } from './solveCaptcha'

interface AmazonLoginOptions {
  url: string
  amazonLogin: string
  amazonPwd: string
}

async function loginToAmazon ({ url, amazonLogin, amazonPwd }: AmazonLoginOptions, page: puppeteer.Page): Promise<void> {
  await page.goto(url, { waitUntil: 'load' })
  await page.waitForSelector('#ap_password')
  await page.type('#ap_email', amazonLogin)
  await page.type('#ap_password', amazonPwd)
  await page.click('#signInSubmit')
  await page.waitForNavigation()
}

const getAuthCode = (codeInputFieldSelector: string, page: puppeteer.Page): Promise<string> =>
  page.evaluate(() => {
    const el: HTMLInputElement | null = document.querySelector(codeInputFieldSelector)
    if (el) {
      return el.value
    }
  })

export async function puppeteerPerformAmazonLogin (config: AlexaAutomationConfig, inputString: string): Promise<string> {
  const url = retrieveUrlFromString(inputString)
  if (!url) {
    throw(new Error('No url passed to puppeteer'))
  }
  const amazonLogin = config.amazonLogin
  const amazonPwd = config.amazonPwd
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await loginToAmazon({ url, amazonLogin, amazonPwd }, page)
  // TODO: add captcha handling here
  const codeInputFieldSelector = '#ac'
  const doWeHaveAnAuthCode: boolean = await page.$(codeInputFieldSelector) !== null
  if (doWeHaveAnAuthCode) {
    const authorizationCode = getAuthCode(codeInputFieldSelector, page)
  } else {
    const captchaSolution = await solveCaptcha(config, page)
    throw(new Error('handle captcha'))
  }
  await page.close()
  await browser.close()
  return ''
}
