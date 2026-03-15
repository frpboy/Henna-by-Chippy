import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
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

type SocialPostLink = {
  url: string
  platform: string
}

const ALLOWED_SOCIAL_DOMAINS = ['instagram.com', 'facebook.com', 'fb.com']

function isValidSocialUrl(url: string): boolean {
  return ALLOWED_SOCIAL_DOMAINS.some((domain) => url.includes(domain))
}

export async function POST(req: NextRequest) {
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

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  // Extract text fields
  const customerName = formData.get('customerName')
  const locationRaw = formData.get('location')
  const ratingRaw = formData.get('rating')
  const coneUsedRaw = formData.get('coneUsed')
  const hoursKeptRaw = formData.get('hoursKept')
  const reviewTextRaw = formData.get('reviewText')
  const allowAiUsageRaw = formData.get('allowAiUsage')
  const videoLinkRaw = formData.get('videoLink')
  const socialPostLinksRaw = formData.get('socialPostLinks')

  // Validate required fields
  if (!customerName || typeof customerName !== 'string' || !customerName.trim()) {
    return NextResponse.json({ error: 'Customer name is required.' }, { status: 400 })
  }

  const rating = Number(ratingRaw)
  if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return NextResponse.json(
      { error: 'Rating must be a whole number between 1 and 5.' },
      { status: 400 },
    )
  }

  const validConeValues = ['nail', 'skin', 'both']
  const coneUsed =
    typeof coneUsedRaw === 'string' && validConeValues.includes(coneUsedRaw)
      ? coneUsedRaw
      : 'nail'

  const reviewText =
    typeof reviewTextRaw === 'string' && reviewTextRaw.trim()
      ? reviewTextRaw.trim().slice(0, 2000)
      : undefined

  const hoursKept =
    hoursKeptRaw !== null && hoursKeptRaw !== '' && Number(hoursKeptRaw) > 0
      ? Number(hoursKeptRaw)
      : undefined

  const location =
    typeof locationRaw === 'string' && locationRaw.trim() ? locationRaw.trim() : undefined

  const allowAiUsage = allowAiUsageRaw === 'true' || allowAiUsageRaw === '1'

  const videoLink =
    typeof videoLinkRaw === 'string' && videoLinkRaw.trim() ? videoLinkRaw.trim() : undefined

  // Parse and validate social post links
  let socialPostLinks: SocialPostLink[] = []
  if (typeof socialPostLinksRaw === 'string' && socialPostLinksRaw.trim()) {
    try {
      const parsed = JSON.parse(socialPostLinksRaw) as unknown[]
      if (Array.isArray(parsed)) {
        socialPostLinks = parsed
          .filter(
            (item): item is SocialPostLink =>
              typeof item === 'object' &&
              item !== null &&
              'url' in item &&
              typeof (item as Record<string, unknown>).url === 'string' &&
              isValidSocialUrl((item as Record<string, unknown>).url as string),
          )
          .slice(0, 5)
      }
    } catch {
      // Invalid JSON — ignore social links
    }
  }

  // Extract and upload photos
  const photoFiles = formData.getAll('photos')
  type SanityImageRef = {
    _type: 'image'
    _key: string
    asset: {
      _type: 'reference'
      _ref: string
    }
  }
  const stainPhotos: SanityImageRef[] = []

  const filesToUpload = photoFiles
    .filter((f): f is File => f instanceof File && f.size > 0)
    .slice(0, 10)

  for (const file of filesToUpload) {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const asset = await sanityWriteClient.assets.upload('image', buffer, {
        filename: file.name,
        contentType: file.type,
      })
      stainPhotos.push({
        _type: 'image',
        _key: uuidv4(),
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      })
    } catch (uploadErr) {
      console.error('[/api/reviews] Photo upload error:', uploadErr)
      // Continue — skip failed uploads rather than rejecting the whole review
    }
  }

  try {
    await sanityWriteClient.create({
      _type: 'review',
      customerName: customerName.trim(),
      location,
      rating,
      reviewText,
      coneUsed,
      hoursKept,
      allowAiUsage,
      videoLink,
      socialPostLinks,
      approved: false,
      featured: false,
      submittedAt: new Date().toISOString(),
      ...(stainPhotos.length > 0 ? { stainPhotos } : {}),
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
