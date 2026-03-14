import { NextRequest, NextResponse } from 'next/server'
import { sanityWriteClient } from '@/lib/sanity/client'

// Rate limit: 5 reviews per IP per hour
const ipReviewMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60 * 60_000 // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = ipReviewMap.get(ip)
  if (!entry || now > entry.resetAt) {
    ipReviewMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

type ReviewBody = {
  customerName?: unknown
  location?: unknown
  rating?: unknown
  reviewText?: unknown
  coneUsed?: unknown
  hoursKept?: unknown
  allowAiUsage?: unknown
}

export async function POST(req: NextRequest) {
  // Check Sanity is configured
  if (!process.env.SANITY_API_TOKEN) {
    return NextResponse.json(
      { error: 'Review submission is temporarily unavailable.' },
      { status: 503 },
    )
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many reviews submitted. Please try again later.' },
      { status: 429 },
    )
  }

  let body: ReviewBody
  try {
    body = (await req.json()) as ReviewBody
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  // Validate required fields
  if (!body.customerName || typeof body.customerName !== 'string' || !body.customerName.trim()) {
    return NextResponse.json({ error: 'Customer name is required.' }, { status: 400 })
  }

  const rating = Number(body.rating)
  if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return NextResponse.json({ error: 'Rating must be a whole number between 1 and 5.' }, { status: 400 })
  }

  const validConeValues = ['nail', 'skin', 'both']
  const coneUsed =
    typeof body.coneUsed === 'string' && validConeValues.includes(body.coneUsed)
      ? body.coneUsed
      : 'nail'

  const reviewText =
    typeof body.reviewText === 'string' && body.reviewText.trim()
      ? body.reviewText.trim().slice(0, 2000)
      : undefined

  const hoursKept =
    typeof body.hoursKept === 'number' && body.hoursKept > 0 ? body.hoursKept : undefined

  const location =
    typeof body.location === 'string' && body.location.trim() ? body.location.trim() : undefined

  const allowAiUsage = body.allowAiUsage === true

  try {
    await sanityWriteClient.create({
      _type: 'review',
      customerName: body.customerName.trim(),
      location,
      rating,
      reviewText,
      coneUsed,
      hoursKept,
      allowAiUsage,
      approved: false,
      featured: false,
      submittedAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('[/api/reviews] Sanity write error:', err)
    return NextResponse.json(
      { error: 'Failed to save review. Please try again.' },
      { status: 500 },
    )
  }
}
