import { createGoogleGenerativeAI } from '@ai-sdk/google'

/**
 * Returns a configured Google Generative AI provider instance.
 * Returns null if the API key is not configured.
 */
export function getGeminiProvider() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) return null
  return createGoogleGenerativeAI({ apiKey })
}
