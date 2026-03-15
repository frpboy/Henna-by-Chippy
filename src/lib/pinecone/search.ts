import { getPineconeIndex } from './client'
import { embedText } from './embed'
import type { KnowledgeChunk } from '@/types'

const TOP_K = 5

/**
 * Search the Pinecone knowledge base for chunks relevant to `query`.
 * Returns an empty array if Pinecone or the AI API is not configured.
 */
export async function searchKnowledge(query: string): Promise<KnowledgeChunk[]> {
  const index = getPineconeIndex()
  if (!index) return []

  const vector = await embedText(query)
  if (!vector) return []

  const result = await index.query({
    vector,
    topK: TOP_K,
    includeMetadata: true,
  })

  return (result.matches ?? []).map((match) => ({
    id: match.id,
    text: (match.metadata?.text as string) ?? '',
    score: match.score ?? 0,
    metadata: {
      category: (match.metadata?.category as string) ?? 'general',
      imageUrl: match.metadata?.imageUrl as string | undefined,
      stainType: match.metadata?.stainType as string | undefined,
      rating: match.metadata?.rating as number | undefined,
      hoursKept: match.metadata?.hoursKept as number | undefined,
      coneUsed: match.metadata?.coneUsed as string | undefined,
      source: match.metadata?.source as string | undefined,
    },
  }))
}

/**
 * Format retrieved chunks into a context block for the LLM system prompt.
 */
export function formatContext(chunks: KnowledgeChunk[]): string {
  if (chunks.length === 0) return ''

  const lines = chunks
    .filter((c) => c.score > 0.5)
    .map((c) => `- ${c.text}`)
    .join('\n')

  if (!lines) return ''
  return `\nRELEVANT KNOWLEDGE BASE CONTEXT:\n${lines}\n`
}
