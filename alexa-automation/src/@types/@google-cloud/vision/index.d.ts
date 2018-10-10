declare module '@google-cloud/vision' {
  export interface TextDetectionResult {
    fullTextAnnotation: {
      pages: any[]
      text: string
    }
  }
  export interface TextDetectionRequest {
    image: {
      content: string | Buffer
    }
    feature: {
      languageHints: string[]
    }
  }

  export type documentTextDetection = (request: TextDetectionRequest) => Promise<TextDetectionResult[]>
  export namespace v1p3beta1 {
    export class ImageAnnotatorClient {
      documentTextDetection: documentTextDetection
    }
  }

}
