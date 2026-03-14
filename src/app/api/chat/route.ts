import { NextRequest, NextResponse } from 'next/server'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateText } from 'ai'
import { sanityWriteClient } from '@/lib/sanity/client'

const SYSTEM_PROMPT = `You are Chippy's AI Stain Consultant for Henna by Chippy.

PRODUCT FACTS:
- Ingredients: 100% natural henna powder, water, essential oil, sugar
- NO preservatives, NO PPD (para-phenylenediamine), NO chemicals
- Two variants: Nail Cone (10-15g, Rs 35) and Skin Cone (25-30g, Rs 45)

STORAGE RULES (CRITICAL - always communicate this):
- Store in freezer IMMEDIATELY upon arrival
- Outside freezer for more than 3 days means product spoils and gives poor stain quality
- Spoiled product gives orange/light stain instead of deep maroon

APPLICATION GUIDE:
- Keep henna on for 8-12 hours for best results
- Avoid water/soap for first 24 hours after removal
- Durability: 8-12 days (fades faster with frequent hand washing or dishwashing)

REFUND AND REPLACEMENT POLICY:
- If product arrives damaged: customer must record an unboxing video and send to WhatsApp (+91 7561856754) within 24 hours of delivery
- Chippy will arrange full refund OR replacement immediately, customer's choice
- Wrong item sent: full replacement, no video required
- Spoilage due to improper storage (not kept in freezer): NOT covered. Explain this clearly and kindly.
- Online refund form available at: /support/refund

LOGISTICS:
- Based in Karuvarakundu, Malappuram District, Kerala
- Ships across Kerala and India
- Delivery zones:
  SAFE (1-2 days): Malappuram, Kozhikode, Thrissur, Palakkad
  CAUTION (2-3 days): Ernakulam, Kottayam, Alappuzha, Idukki, Kannur, Trivandrum, Kollam
  RISKY (3+ days): Tamil Nadu, Karnataka, Goa
  WARN: Delhi, Mumbai, other distant cities - very likely over 3 days, may spoil
  NOT AVAILABLE: Outside India
- Always warn users in far-away locations about the 3-day rule

LANGUAGE:
- You understand English, Malayalam, and Manglish
- Always respond in the language the user writes in
- Keep responses warm, helpful, and culturally aware
- Do not use em dashes. Use commas or colons instead.
- Keep responses concise and friendly. Chippy is a local artisan, not a corporation.`

// Rate limit: simple in-memory (use Upstash Redis in production)
const ipRequestMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 10
const RATE_WINDOW_MS = 60_000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = ipRequestMap.get(ip)
  if (!entry || now > entry.resetAt) {
    ipRequestMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Try again in a minute.' }, { status: 429 })
  }

  const body = (await req.json()) as {
    message: string
    history?: { role: string; text: string }[]
    sessionId?: string
  }

  const { message, history = [], sessionId } = body

  if (!message?.trim()) {
    return NextResponse.json({ error: 'Message required' }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 503 })
  }

  const google = createGoogleGenerativeAI({ apiKey })

  // Build messages from history (skip initial model greeting at index 0)
  const historyMessages = history
    .filter((_, i) => i > 0)
    .map((m) => ({
      role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: m.text,
    }))

  const model = process.env.NEXT_PUBLIC_GEMINI_MODEL ?? 'gemini-2.5-flash'
  const { text: responseText } = await generateText({
    model: google(model),
    system: SYSTEM_PROMPT,
    messages: [...historyMessages, { role: 'user', content: message }],
    maxTokens: 600,
    temperature: 0.7,
  })

  // Log to Sanity (fire-and-forget, non-blocking)
  const ipRegion = req.headers.get('x-vercel-ip-country-region') ?? 'unknown'
  void sanityWriteClient
    .create({
      _type: 'chatLog',
      sessionId: sessionId ?? 'anonymous',
      messages: [
        ...history.map((m) => ({ role: m.role, text: m.text, timestamp: new Date().toISOString() })),
        { role: 'user', text: message, timestamp: new Date().toISOString() },
        { role: 'model', text: responseText, timestamp: new Date().toISOString() },
      ],
      startedAt: new Date().toISOString(),
      userLanguage: 'en',
      ipRegion,
      flagged: false,
    })
    .catch(() => {
      // Logging failure must never affect the response
    })

  return NextResponse.json({ text: responseText })
}
