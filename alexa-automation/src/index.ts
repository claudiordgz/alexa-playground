import { spawn } from 'child_process'
import * as which from 'which'
import { StringDecoder } from 'string_decoder'
import { puppeteerPerformAmazonLogin } from './puppeteerPerformAmazonLogin'
import { AlexaAutomationConfig } from './types'

interface Decision {
  input: string
  output: (configuration: AlexaAutomationConfig, inputString?: string) => Promise<string>
}

const DecisionModel: Array<Decision> = [
  {
    input: `Please choose one from the following AWS profiles for skill's Lambda function`,
    output: async () => '\n' // <-- default profile
  },
  {
    input: `Paste the following url to your browser`,
    output: (configuration: AlexaAutomationConfig, inputString) => {
      if (!inputString) {
        throw(new Error('Undefined Options'))
      }
      return puppeteerPerformAmazonLogin(configuration, inputString)
    }
  }
]

function findAsk (): string {
  const askCommand = which.sync('ask')
  return askCommand
}

function getConfiguration (): AlexaAutomationConfig {
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
  return {
    amazonLogin,
    amazonPwd,
    awsRegion
  }
}

function executeAsk () {
  const configuration: AlexaAutomationConfig = getConfiguration()
  const askCommand = findAsk()
  const child = spawn(askCommand, [ 'init', '--no-browser', '-p', 'automation' ])
  let state = 0
  const decoder = new StringDecoder('utf8')
  process.stdin.pipe(child.stdin)

  child.stdout.on('data', async (buffer) => {
    const data = decoder.write(buffer)
    const modelState = DecisionModel[state]
    if (modelState && data.indexOf(modelState.input) !== -1) {
      state += 1
      const output = await modelState.output(configuration, data)
      child.stdin.write(output)
    }
    console.log(`child stdout:\n${data}`)
  })

  child.stderr.on('data', (buffer) => {
    const data = buffer.toString()
    console.error(`child stderr:\n${data}`)
  })

  child.on('error', (buffer) => {
    const data = buffer.toString()
    console.error(`child stderr:\n${data}`)
  })

  child.on('exit', function (code, signal) {
    console.log(`child process exited with code ${code} and signal ${signal}`)
  })
}

if (require.main === module) {
  // Running as a script
  executeAsk()
} else {
  // Being required
  module.exports = executeAsk
}
