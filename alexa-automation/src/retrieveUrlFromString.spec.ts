import { retrieveUrlFromString } from './retrieveUrlFromString'
import * as url from 'url'

describe('retrieveUrlFromString', () => {
  const mockInput = `
? Please choose one from the following AWS profiles for skill's Lambda function deployment.
 default
Paste the following url to your browser:
         https://www.amazon.com/ap/oa?redirect_uri=https%3A%2F%2Fs3.amazonaws.com%2Fask-cli%2Fresponse_parser.html&scope=alexa%3A%3Aask%3Askills%3Areadwrite%20alexa%3A%3Aask%3Amodels%3Areadwrite%20alexa%3A%3Aask%3Askills%3Atest&state=Ask-SkillModel-ReadWrite&response_type=code&client_id=amzn1.application-oa2-client.aad322b5faab44b980c8f87f94fbac56

? Please enter the Authorization Code:
`

  it('plucks url from stdin and returns it', () => {
    const loginUrl = retrieveUrlFromString(mockInput)
    const result = url.parse(loginUrl)
    expect(result.hostname).toBe('www.amazon.com')
  })

  it('throws error if there was no url in the input', () => {
    expect(() => retrieveUrlFromString('\n\n')).toThrow(new Error('could not find login url'))
  })
})
