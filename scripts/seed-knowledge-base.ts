/**
 * Henna by Chippy — Knowledge Base Seeder
 *
 * Embeds all entries in docs/knowledge-base.json and upserts them into Pinecone.
 * Run this once before launch (or after adding new knowledge entries).
 *
 * Usage:
 *   npx tsx scripts/seed-knowledge-base.ts
 *   npx tsx scripts/seed-knowledge-base.ts --dry-run
 */

import { Pinecone } from '@pinecone-database/pinecone'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { embed } from 'ai'
import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env.local
config({ path: resolve(__dirname, '..', '.env.local') })

const isDryRun = process.argv.includes('--dry-run')

// ── Validate env ─────────────────────────────────────────────────────────────

const missing = ['GOOGLE_GENERATIVE_AI_API_KEY', 'PINECONE_API_KEY'].filter((k) => !process.env[k])
if (missing.length > 0) {
  console.error(`Missing env vars: ${missing.join(', ')}`)
  process.exit(1)
}

// ── Clients ───────────────────────────────────────────────────────────────────

const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY! })
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
const indexName = process.env.PINECONE_INDEX_NAME ?? 'henna-knowledge-base'
const index = pinecone.index(indexName)

// ── Types ─────────────────────────────────────────────────────────────────────

interface KnowledgeEntry {
  id: string
  text: string
  metadata: Record<string, string | number | boolean>
}

// ── Embed ─────────────────────────────────────────────────────────────────────

async function embedText(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: google.textEmbeddingModel('gemini-embedding-001', { outputDimensionality: 768 }),
    value: text,
  })
  return embedding
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\nHenna by Chippy — Knowledge Base Seeder')
  console.log('────────────────────────────────────────')
  if (isDryRun) console.log('DRY RUN — no writes to Pinecone\n')

  const knowledgeBasePath = resolve(__dirname, '..', 'docs', 'knowledge-base.json')
  const entries: KnowledgeEntry[] = JSON.parse(readFileSync(knowledgeBasePath, 'utf-8'))

  console.log(`Found ${entries.length} entries in knowledge-base.json`)
  console.log(`Target index: ${indexName}\n`)

  const BATCH_SIZE = 10
  let upserted = 0

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE)
    const vectors = []

    for (const entry of batch) {
      process.stdout.write(`  Embedding [${entry.id}]... `)
      const values = await embedText(entry.text)
      console.log(`${values.length}d vector`)

      vectors.push({
        id: entry.id,
        values,
        metadata: {
          text: entry.text,
          ...entry.metadata,
        },
      })

      // Small delay to avoid rate limits
      await new Promise((r) => setTimeout(r, 200))
    }

    if (!isDryRun) {
      await index.upsert(vectors)
      console.log(`  Upserted batch of ${vectors.length}`)
    } else {
      console.log(`  DRY RUN: would upsert batch of ${vectors.length}`)
    }

    upserted += vectors.length
  }

  console.log('\n────────────────────────────────────────')
  console.log(`Done! ${upserted} vectors ${isDryRun ? '(dry run)' : 'upserted to Pinecone'}.`)
  if (!isDryRun) {
    console.log('The AI chat will now use this knowledge base for RAG.')
  }
}

main().catch((err: Error) => {
  console.error('Fatal error:', err.message)
  process.exit(1)
})
