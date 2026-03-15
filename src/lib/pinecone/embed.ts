import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { embed } from 'ai'

const EMBEDDING_MODEL = 'text-embedding-004'
const EMBEDDING_DIMENSIONS = 768

/**
 * Embed a single text string using Google's text-embedding-004 model.
 * Returns null if the API key is not configured.
 */
export async function embedText(text: string): Promise<number[] | null> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) return null

  const google = createGoogleGenerativeAI({ apiKey })

  const { embedding } = await embed({
    model: google.textEmbeddingModel(EMBEDDING_MODEL, { outputDimensionality: EMBEDDING_DIMENSIONS }),
    value: text,
  })

  return embedding
}

/**
 * Embed multiple texts in a single batch.
 * Returns null if the API key is not configured.
 */
export async function embedTexts(texts: string[]): Promise<number[][] | null> {
  const results: number[][] = []
  for (const text of texts) {
    const vec = await embedText(text)
    if (!vec) return null
    results.push(vec)
  }
  return results
}
