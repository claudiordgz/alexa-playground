import * as Alexa from 'ask-sdk-core'
import { SessionEndedRequest } from 'ask-sdk-model'
import { FACTS } from './data'

const LaunchRequestHandler: Alexa.RequestHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
  },
  handle (handlerInput) {
    const speechText = 'What can I help you with?'

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Space Geek', speechText)
      .getResponse()
  }
}

const GetNewFactIntentHandler: Alexa.RequestHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetNewFactIntent'
  },
  handle (handlerInput) {
    const factIndex = Math.floor(Math.random() * FACTS.length)
    const randomFact = FACTS[factIndex]
    console.log(randomFact)
    return handlerInput.responseBuilder
      .speak(randomFact)
      .withSimpleCard('Space Geek', randomFact)
      .getResponse()
  }
}

const HelpIntentHandler: Alexa.RequestHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
  },
  handle (handlerInput) {
    const speechText = 'You can say tell me a space fact, or, you can say exit... What can I help you with?'

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Space Geek', speechText)
      .getResponse()
  }
}

const CancelAndStopIntentHandler: Alexa.RequestHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent')
  },
  handle (handlerInput) {
    const speechText = 'Goodbye!'

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Space Geek', speechText)
      .getResponse()
  }
}

const SessionEndedRequestHandler: Alexa.RequestHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest'
  },
  handle (handlerInput) {
    const request = handlerInput.requestEnvelope.request as SessionEndedRequest
    console.log(`Session ended with reason: ${request.reason}`)

    return handlerInput.responseBuilder.getResponse()
  }
}

const ErrorHandler: Alexa.ErrorHandler = {
  canHandle () {
    return true
  },
  handle (handlerInput, error) {
    console.log(`Error handled: ${error.message}`)

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse()
  }
}

const skillBuilder: Alexa.CustomSkillBuilder = Alexa.SkillBuilders.custom()

export const handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    GetNewFactIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda()
