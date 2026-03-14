/**
 * Henna by Chippy — AI Blog Seeder
 *
 * Generates blog posts using Gemini 2.5 Flash and seeds them into Sanity.
 * Run this ONCE before launch to populate "Chippy's Stories".
 *
 * Usage:
 *   npx tsx scripts/seed-blog.ts
 *   npx tsx scripts/seed-blog.ts --dry-run   (preview without writing to Sanity)
 *   npx tsx scripts/seed-blog.ts --post "Why I Never Add Chemicals"  (single post)
 *
 * Requirements:
 *   - .env.local with GOOGLE_GENERATIVE_AI_API_KEY, NEXT_PUBLIC_SANITY_PROJECT_ID, SANITY_API_TOKEN
 */

import { createClient } from '@sanity/client'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { config } from 'dotenv'
import { resolve } from 'path'
import { randomUUID } from 'crypto'

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') })

// ── Config ──────────────────────────────────────────────────────────────────

const isDryRun = process.argv.includes('--dry-run')
const singlePost = process.argv.includes('--post')
  ? process.argv[process.argv.indexOf('--post') + 1]
  : null

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

// ── Blog Post Seeds ──────────────────────────────────────────────────────────

interface PostSeed {
  title: string
  category: 'story' | 'tips' | 'bridal' | 'science' | 'culture' | 'behind-scenes'
  tags: string[]
  featured: boolean
  prompt: string
}

const POST_SEEDS: PostSeed[] = [
  {
    title: "Why I'll Never Put a Chemical in My Henna Cones — A Promise from Karuvarakundu",
    category: 'story',
    tags: ['PPD-free', 'organic', 'malappuram', 'chippy-story'],
    featured: true,
    prompt: `Write a personal, warm blog post for Chippy's henna business blog titled:
"Why I'll Never Put a Chemical in My Henna Cones — A Promise from Karuvarakundu"

Chippy is an organic henna artist from Karuvarakundu, Malappuram, Kerala.
Write in first person as Chippy. Tone: warm, personal, educational, like writing to a trusted friend.

Cover:
- Her personal discovery of PPD (para-phenylenediamine) risks in commercial henna
- Why she decided to make her own cones with only: henna powder, water, essential oil, sugar
- A story moment that made her commit to no-chemical henna forever
- What PPD is and why it's dangerous (chemical burns, long-term allergies) — in simple terms
- Her promise to her customers
- End with a warm invitation to try her cones

Length: 500-700 words. No marketing fluff. Authentic voice.`,
  },
  {
    title: 'The Art of Freezing: Why Your Freezer is the Secret to Deep Maroon Henna',
    category: 'science',
    tags: ['storage', 'freezing', 'deep-maroon', 'tips'],
    featured: true,
    prompt: `Write an educational yet personal blog post for Chippy's henna business titled:
"The Art of Freezing: Why Your Freezer is the Secret to Deep Maroon Henna"

Chippy is from Karuvarakundu, Malappuram. Write in first person as Chippy.
Tone: knowledgeable but conversational — like explaining to a friend.

Cover:
- Why organic henna (no preservatives) MUST be frozen immediately
- The science: lawsone (natural dye) degrades at room temperature; freezing pauses oxidation
- What happens if you don't freeze it: orange/light stain, degraded quality
- Shelf life: 3-4 months frozen vs spoils in 3 days at room temp
- Step-by-step: what to do the moment the cone arrives
- After thawing: use within 24-48 hours
- End with: this is why she never adds preservatives — the freezer IS the preservative

Length: 500-600 words. Include specific facts (lawsone, oxidation process). Warm voice.`,
  },
  {
    title: "A Bride's Night-Before Guide: How to Get the Perfect Henna for Your Wedding Day",
    category: 'bridal',
    tags: ['bridal', 'wedding', 'application', 'kerala', 'tips'],
    featured: true,
    prompt: `Write a practical, warm guide blog post titled:
"A Bride's Night-Before Guide: How to Get the Perfect Henna for Your Wedding Day"

Written by Chippy, henna artist from Karuvarakundu, Malappuram.
Tone: like advice from a best friend who knows everything about henna.

Cover:
- Ideal timeline: apply henna 1-2 evenings before the wedding (not the morning of)
- Why overnight (8-12 hours on) gives the deepest maroon
- Skin prep: clean, no oils or lotions, wipe dry
- What to eat/drink (light meal, avoid oily fingers)
- During application: stay still, stay warm, use a small heater or hair dryer near hands
- Removal: scrape (don't wash), then lemon+sugar mixture to fix stain
- Post-removal: no water for 24 hours — not even washing hands lightly
- Day-of: stain is at its peak maroon on wedding day if applied 1-2 nights before
- End: A personal note about the brides she's worked with

Length: 600-700 words. Practical, numbered steps where needed. Warm, celebratory tone.`,
  },
  {
    title: 'From Karuvarakundu to Your Doorstep: The Story of Henna by Chippy',
    category: 'story',
    tags: ['chippy-story', 'malappuram', 'karuvarakundu', 'origin'],
    featured: false,
    prompt: `Write a personal origin story blog post titled:
"From Karuvarakundu to Your Doorstep: The Story of Henna by Chippy"

Written by Chippy in first person. Karuvarakundu is a small town in the hills of Malappuram, Kerala.
Tone: nostalgic, proud, personal. Like reading a founder's letter.

Cover:
- Growing up in Karuvarakundu surrounded by henna tradition (weddings, Eid, celebrations)
- How she learned henna from family/elders
- The moment she decided to start making her own cones (distrust of chemical products)
- The process of perfecting her recipe (trial and error, getting the right consistency)
- Her first sale / first customer moment
- What it means to ship from Karuvarakundu to people's homes across Kerala
- Her vision: every person deserves safe, authentic henna
- End: gratitude to customers who trust her

Length: 600-700 words. Deeply personal and regional. Mention Malappuram heritage.`,
  },
  {
    title: 'What is PPD in Henna and Why Should You Avoid It? A Plain-Language Guide',
    category: 'science',
    tags: ['PPD', 'safety', 'chemicals', 'organic', 'education'],
    featured: false,
    prompt: `Write an educational blog post titled:
"What is PPD in Henna and Why Should You Avoid It? A Plain-Language Guide"

Written by Chippy, organic henna artist from Malappuram.
Tone: clear, informative, safety-focused but not fear-mongering. Like a trusted expert explaining.

Cover:
- What PPD (para-phenylenediamine) is — full name and simple explanation
- Where it's found: black henna, hair dyes, many commercial henna products
- Why it's added: artificially darkens color, makes "black henna" possible
- Health risks: chemical burns, severe allergic reactions, permanent skin sensitization
- Real cases: brief mention of documented PPD reactions (no names needed)
- How to identify PPD-free henna: ingredient lists, color (natural henna is never black)
- Why Chippy's henna is safe: only 4 ingredients, none of which can cause PPD reactions
- Simple patch test instructions for any new henna product

Length: 550-650 words. Include the scientific name (para-phenylenediamine). Reassuring ending.`,
  },
  {
    title: 'Why Is My Henna Stain Orange? 5 Reasons and How to Fix It Next Time',
    category: 'tips',
    tags: ['troubleshooting', 'orange-stain', 'tips', 'storage'],
    featured: false,
    prompt: `Write a helpful troubleshooting blog post titled:
"Why Is My Henna Stain Orange? 5 Reasons and How to Fix It Next Time"

Written by Chippy, henna artist from Karuvarakundu.
Tone: empathetic (they're disappointed), then practical and hopeful.

Cover these 5 reasons in numbered format:
1. Cone was not stored in freezer — the #1 cause (explain lawsone degradation simply)
2. Kept henna on for less than 6-8 hours — minimum time explanation
3. Washed it off with water instead of scraping
4. Skin was oily or had lotion before application
5. Applied in very cold conditions (cold skin absorbs less dye)

For each: explain why it happens and the exact fix.
End with: "The good news is — all of these are easy to fix. Here's your checklist for next time"
Then a clean summary checklist.

Length: 550-650 words. Use numbered sections. Warm, never blaming.`,
  },
  {
    title: 'Henna and Tradition: The Deep Roots of Henna Culture in Malappuram, Kerala',
    category: 'culture',
    tags: ['culture', 'malappuram', 'tradition', 'kerala', 'history'],
    featured: false,
    prompt: `Write a cultural appreciation blog post titled:
"Henna and Tradition: The Deep Roots of Henna Culture in Malappuram, Kerala"

Written by Chippy from Karuvarakundu. Tone: celebratory, proud, educational.

Cover:
- History of henna (mehndi) in Kerala, specifically Malappuram's Muslim community
- Role of henna in weddings: the mehndi night tradition, its meaning
- Role in Eid celebrations — communal aspects, women gathering to apply henna
- How the tradition is passed down through generations (grandmothers, aunts, community)
- The specific designs of Malappuram vs other Kerala regions (if any distinction)
- How Chippy sees her work as continuing this tradition with modern safety standards
- Why preserving organic henna matters for cultural authenticity
- End: invitation to be part of this living tradition

Length: 600-700 words. Respectful, detailed cultural context. No stereotyping.`,
  },
  {
    title: 'Henna for Children: Is It Safe? What Every Parent Should Know',
    category: 'tips',
    tags: ['children', 'safety', 'PPD-free', 'parents', 'skin'],
    featured: false,
    prompt: `Write a reassuring, informative blog post titled:
"Henna for Children: Is It Safe? What Every Parent Should Know"

Written by Chippy from Malappuram. Tone: like advice from a trusted, experienced mother.

Cover:
- Natural vs chemical henna: natural henna (Chippy's) vs PPD-containing products
- Why PPD is dangerous for children specifically (more sensitive skin, immune reactions)
- Why Chippy's henna (henna powder, water, essential oil, sugar) is safe for most children
- Patch test instructions: always do this first for any child, especially under 5
- Age guidance: henna is generally safe for children above 2, patch test always
- Tips for applying on kids: keep them engaged/distracted, apply on feet/hands
- Signs of reaction to watch for (redness, swelling, itch beyond normal)
- Important disclaimer: always consult doctor if any concern
- End: warm note about making celebrations safe for the whole family

Length: 500-600 words. Reassuring but appropriately cautious.`,
  },
]

// ── Portable Text helpers ────────────────────────────────────────────────────

function textToPortableText(text: string): unknown[] {
  const blocks: unknown[] = []
  const lines = text.split('\n')
  let currentListItems: string[] = []
  let inNumberedList = false

  const flushList = () => {
    if (currentListItems.length > 0) {
      for (const item of currentListItems) {
        blocks.push({
          _type: 'block',
          _key: randomUUID().replace(/-/g, '').slice(0, 12),
          style: 'normal',
          listItem: inNumberedList ? 'number' : 'bullet',
          level: 1,
          children: [{ _type: 'span', _key: randomUUID().replace(/-/g, '').slice(0, 12), text: item.trim(), marks: [] }],
          markDefs: [],
        })
      }
      currentListItems = []
      inNumberedList = false
    }
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      flushList()
      continue
    }

    // H2
    if (trimmed.startsWith('## ')) {
      flushList()
      blocks.push({
        _type: 'block',
        _key: randomUUID().replace(/-/g, '').slice(0, 12),
        style: 'h2',
        children: [{ _type: 'span', _key: randomUUID().replace(/-/g, '').slice(0, 12), text: trimmed.slice(3), marks: [] }],
        markDefs: [],
      })
      continue
    }

    // H3
    if (trimmed.startsWith('### ')) {
      flushList()
      blocks.push({
        _type: 'block',
        _key: randomUUID().replace(/-/g, '').slice(0, 12),
        style: 'h3',
        children: [{ _type: 'span', _key: randomUUID().replace(/-/g, '').slice(0, 12), text: trimmed.slice(4), marks: [] }],
        markDefs: [],
      })
      continue
    }

    // Numbered list: "1. Item" or "1) Item"
    if (/^\d+[.)]\s/.test(trimmed)) {
      inNumberedList = true
      currentListItems.push(trimmed.replace(/^\d+[.)]\s/, ''))
      continue
    }

    // Bullet list
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      inNumberedList = false
      currentListItems.push(trimmed.slice(2))
      continue
    }

    // Normal paragraph
    flushList()

    // Handle **bold** inline
    const children: unknown[] = []
    const boldRegex = /\*\*(.+?)\*\*/g
    let lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = boldRegex.exec(trimmed)) !== null) {
      if (match.index > lastIndex) {
        children.push({ _type: 'span', _key: randomUUID().replace(/-/g, '').slice(0, 12), text: trimmed.slice(lastIndex, match.index), marks: [] })
      }
      children.push({ _type: 'span', _key: randomUUID().replace(/-/g, '').slice(0, 12), text: match[1], marks: ['strong'] })
      lastIndex = match.index + match[0].length
    }
    if (lastIndex < trimmed.length) {
      children.push({ _type: 'span', _key: randomUUID().replace(/-/g, '').slice(0, 12), text: trimmed.slice(lastIndex), marks: [] })
    }

    blocks.push({
      _type: 'block',
      _key: randomUUID().replace(/-/g, '').slice(0, 12),
      style: 'normal',
      children,
      markDefs: [{ _type: 'strong', _key: randomUUID().replace(/-/g, '').slice(0, 12) }],
    })
  }

  flushList()
  return blocks
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/['''""]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80)
}

function excerpt(body: string): string {
  const firstPara = body.split('\n').find((l) => l.trim() && !l.startsWith('#') && !l.startsWith('-'))
  return (firstPara ?? body).replace(/\*\*/g, '').trim().slice(0, 180) + '…'
}

// ── AI Generation ────────────────────────────────────────────────────────────

async function generatePost(seed: PostSeed): Promise<{ body: string; excerpt: string }> {
  console.log(`  ✨ Generating: "${seed.title}"`)

  const systemCtx = `You are Chippy, an organic henna artist from Karuvarakundu, Malappuram, Kerala.
Write authentic, warm blog posts for your henna business "Henna by Chippy".
Use markdown formatting: ## for H2 headings, ### for H3, **bold** for emphasis, numbered lists with "1.", bullet lists with "- ".
Do not use HTML. Do not add a title heading. Start directly with the content.
Always end with a warm, personal closing paragraph.
IMPORTANT WRITING RULES:
- Never use em dashes (—). Use a comma, period, or start a new sentence instead.
- Never use AI-sounding phrases like "delve into", "it's worth noting", "moreover", "furthermore", "in conclusion", "elevate", "seamless".
- Write like a real person talking to a friend. Short sentences. Simple words. Real stories.
- If something can be said in one sentence, use one sentence. No filler.`

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: `${systemCtx}\n\n${seed.prompt}` }] }],
    generationConfig: { temperature: 0.75, maxOutputTokens: 1200 },
  })

  const body = result.response.text().trim()
  return { body, excerpt: excerpt(body) }
}

// ── Sanity Upsert ────────────────────────────────────────────────────────────

async function upsertPost(seed: PostSeed, body: string, postExcerpt: string): Promise<void> {
  const slug = slugify(seed.title)

  // Check if post with this slug already exists
  const existing = await sanity.fetch(`*[_type == "post" && slug.current == $slug][0]._id`, { slug })
  if (existing) {
    console.log(`  ⏭  Skipping (already exists): ${slug}`)
    return
  }

  const doc = {
    _type: 'post',
    title: seed.title,
    slug: { _type: 'slug', current: slug },
    excerpt: postExcerpt,
    category: seed.category,
    tags: seed.tags,
    featured: seed.featured,
    publishedAt: new Date().toISOString(),
    body: textToPortableText(body),
  }

  if (isDryRun) {
    console.log(`  📋 DRY RUN — would create: ${slug}`)
    console.log(`     Excerpt: ${postExcerpt.slice(0, 80)}…`)
    return
  }

  await sanity.create(doc)
  console.log(`  ✅ Created in Sanity: ${slug}`)
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌿 Henna by Chippy — AI Blog Seeder')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  if (isDryRun) console.log('📋 DRY RUN mode — no writes to Sanity\n')

  // Validate env
  const missing = ['GOOGLE_GENERATIVE_AI_API_KEY', 'NEXT_PUBLIC_SANITY_PROJECT_ID', 'SANITY_API_TOKEN']
    .filter((k) => !process.env[k])
  if (missing.length > 0) {
    console.error(`❌ Missing env vars: ${missing.join(', ')}`)
    console.error('   Copy .env.example → .env.local and fill in the values.')
    process.exit(1)
  }

  // Filter to single post if --post flag used
  const seeds = singlePost
    ? POST_SEEDS.filter((s) => s.title.toLowerCase().includes(singlePost.toLowerCase()))
    : POST_SEEDS

  if (seeds.length === 0) {
    console.error(`❌ No posts matched: "${singlePost}"`)
    process.exit(1)
  }

  console.log(`📝 Seeding ${seeds.length} post(s)...\n`)

  for (const seed of seeds) {
    console.log(`\n📖 Post: "${seed.title}"`)
    try {
      const { body, excerpt: postExcerpt } = await generatePost(seed)
      await upsertPost(seed, body, postExcerpt)

      // Small delay between posts to avoid rate limits
      if (seeds.indexOf(seed) < seeds.length - 1) {
        await new Promise((r) => setTimeout(r, 2000))
      }
    } catch (err) {
      console.error(`  ❌ Failed: ${(err as Error).message}`)
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✅ Seeding complete!')
  console.log('   Review posts in Sanity Studio before publishing.')
  if (!isDryRun) {
    console.log('   💡 Posts are saved as drafts — publish from Studio when ready.')
  }
  console.log('')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
