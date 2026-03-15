import { Pinecone } from '@pinecone-database/pinecone'

let _pinecone: Pinecone | null = null

export function getPineconeClient(): Pinecone | null {
  if (!process.env.PINECONE_API_KEY) return null
  if (!_pinecone) {
    _pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })
  }
  return _pinecone
}

export function getPineconeIndex() {
  const client = getPineconeClient()
  if (!client) return null
  const indexName = process.env.PINECONE_INDEX_NAME ?? 'henna-knowledge-base'
  return client.index(indexName)
}
