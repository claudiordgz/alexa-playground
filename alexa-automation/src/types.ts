
export interface AlexaAutomationConfig {
  amazonLogin: string
  amazonPwd: string
  awsRegion: string
  googleApplicationCredentials: string
}

export interface Decision {
  input: string
  output: (configuration: AlexaAutomationConfig, inputString?: string) => Promise<string>
}
