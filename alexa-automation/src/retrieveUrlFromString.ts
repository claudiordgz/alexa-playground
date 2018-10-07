
export function retrieveUrlFromString (input: string): string {
  const chunks = input.split('\n')
  for (const chunk of chunks) {
    const trimmedChunk = chunk.trim()
    if (trimmedChunk.startsWith('http')) {
      return trimmedChunk
    }
  }
  throw(new Error('could not find login url'))
}
