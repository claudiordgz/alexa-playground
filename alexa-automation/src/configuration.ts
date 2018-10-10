import { AlexaAutomationConfig } from './types'
import { join, resolve } from 'path'

export function getConfiguration (): AlexaAutomationConfig {
  const amazonLogin = process.env.AMAZON_LOGIN
  if (!amazonLogin) {
    throw(new Error('No AMAZON_LOGIN defined'))
  }
  const amazonPwd = process.env.AMAZON_PASSWORD
  if (!amazonPwd) {
    throw(new Error('No AMAZON_PASSWORD defined'))
  }
  const awsRegion = process.env.AWS_REGION
  if (!awsRegion) {
    throw(new Error('No AWS_REGION defined'))
  }
  const googleCredFile = process.env.GOOGLE_APPLICATION_CREDENTIALS
  if (!googleCredFile) {
    throw(new Error('No GOOGLE_APPLICATION_CREDENTIALS defined'))
  }
  const googleApplicationCredentials = resolve(join(__dirname, googleCredFile))
  return {
    amazonLogin,
    amazonPwd,
    awsRegion,
    googleApplicationCredentials
  }
}
