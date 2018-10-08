import { spawn } from 'child_process'
import * as which from 'which'
import { StringDecoder } from 'string_decoder'
import { puppeteerPerformAmazonLogin } from './puppeteerPerformAmazonLogin'

interface Decision {
  input: string
  output: (inputString?: string) => Promise<string>
}

const DecisionModel: Array<Decision> = [
  {
    input: `Please choose one from the following AWS profiles for skill's Lambda function`,
    output: () => Promise.resolve('\n')
  },
  {
    input: `Paste the following url to your browser`,
    output: (inputString) => {
      if (!inputString) {
        throw(new Error('Undefined Options'))
      }
      return puppeteerPerformAmazonLogin(inputString)
    }
  }
]

function findAsk (): string {
  const askCommand = which.sync('ask')
  return askCommand
}

function executeAsk () {
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
      const output = await modelState.output(data)
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
