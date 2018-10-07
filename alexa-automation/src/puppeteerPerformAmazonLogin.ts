import * as puppeteer from 'puppeteer'
import { retrieveUrlFromString } from './retrieveUrlFromString'

export async function puppeteerPerformAmazonLogin (inputString: string): Promise<string> {
  const url = retrieveUrlFromString(inputString)
  if (!url) {
    throw(new Error('No url passed to puppeteer'))
  }
  if (!process.env.AMAZON_LOGIN) {
    throw(new Error('No AMAZON_LOGIN defined'))
  }
  if (!process.env.AMAZON_PASSWORD) {
    throw(new Error('No AMAZON_PASSWORD defined'))
  }
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'load' })
  await page.waitForSelector('#ap_password')
  await page.type('#ap_email', process.env.AMAZON_LOGIN)
  await page.type('#ap_password', process.env.AMAZON_PASSWORD)
  await page.click('#signInSubmit')
  await page.waitForNavigation()
  // TODO: add captcha handling here
  await page.waitForSelector('#ac')
  const authorizationCode = await page.evaluate(() => {
    const el: HTMLInputElement | null = document.querySelector('#ac')
    if (el) {
      return el.value
    }
  })
  await page.close()
  await browser.close()
  return authorizationCode
}
