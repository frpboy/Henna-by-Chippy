import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { sanityClient } from '@/lib/sanity/client'
import { getPineconeIndex } from '@/lib/pinecone/client'
import { embedText } from '@/lib/pinecone/embed'
import { thumbnailUrl } from '@/lib/sanity/image'
import type { SanityImage } from '@/types'

interface SanityReviewWebhookBody {
  _id: string
  _type: string
  customerName?: string
  location?: string
  rating?: number
  reviewText?: string
  coneUsed?: string
  hoursKept?: number
  stainType?: string
  stainPhotos?: (SanityImage & { alt?: string })[]
  allowAiUsage?: boolean
  approved?: boolean
}

function verifySignature(body: string, signature: string | null, secret: string): boolean {
  if (!signature) return false
  const expected = createHmac('sha256', secret).update(body).digest('hex')
  const sig = signature.replace(/^sha256=/, '')
  try {
    return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(sig, 'hex'))
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.SANITY_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const rawBody = await req.text()
  const signature = req.headers.get('sanity-webhook-signature')

  if (!verifySignature(rawBody, signature, webhookSecret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: SanityReviewWebhookBody
  try {
    payload = JSON.parse(rawBody) as SanityReviewWebhookBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (payload._type !== 'review' || !payload.approved || !payload.allowAiUsage) {
    return NextResponse.json({ status: 'skipped', reason: 'not approved or AI usage not allowed' })
  }

  const index = getPineconeIndex()
  if (!index) {
    return NextResponse.json({ error: 'Pinecone not configured' }, { status: 503 })
  }

  // Fetch full review from Sanity to get complete data
  const review = await sanityClient.fetch<SanityReviewWebhookBody>(
    `*[_id == $id][0] {
      _id, customerName, location, rating, reviewText, coneUsed, hoursKept, stainType,
      stainPhotos { asset, alt },
      allowAiUsage, approved
    }`,
    { id: payload._id },
  )

  if (!review) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 })
  }

  const vectors = []
  const photos = review.stainPhotos ?? []

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i]
    const imageUrl = thumbnailUrl(photo)

    const text = [
      `Customer ${review.customerName ?? 'anonymous'} from ${review.location ?? 'Kerala'}`,
      `rated ${review.rating ?? 5} stars.`,
      review.stainType ? `Stain type: ${review.stainType}.` : '',
      review.coneUsed ? `Cone used: ${review.coneUsed}.` : '',
      review.hoursKept ? `Hours kept on: ${review.hoursKept}.` : '',
      review.reviewText ? `Review: "${review.reviewText}".` : '',
      photo.alt ? `Photo: ${photo.alt}.` : '',
    ]
      .filter(Boolean)
      .join(' ')

    const vector = await embedText(text)
    if (!vector) continue

    vectors.push({
      id: `review_photo_${review._id}_${i}`,
      values: vector,
      metadata: {
        text,
        category: 'customer_photo',
        imageUrl,
        stainType: review.stainType ?? '',
        rating: review.rating ?? 5,
        hoursKept: review.hoursKept ?? 0,
        coneUsed: review.coneUsed ?? '',
        source: 'customer_review',
      },
    })
  }

  // If no photos, still index the review text itself
  if (photos.length === 0 && review.reviewText) {
    const text = [
      `Customer ${review.customerName ?? 'anonymous'} from ${review.location ?? 'Kerala'}`,
      `rated ${review.rating ?? 5} stars.`,
      review.coneUsed ? `Cone used: ${review.coneUsed}.` : '',
      review.hoursKept ? `Hours kept on: ${review.hoursKept}.` : '',
      `Review: "${review.reviewText}".`,
    ]
      .filter(Boolean)
      .join(' ')

    const vector = await embedText(text)
    if (vector) {
      vectors.push({
        id: `review_text_${review._id}`,
        values: vector,
        metadata: {
          text,
          category: 'customer_review',
          rating: review.rating ?? 5,
          coneUsed: review.coneUsed ?? '',
          source: 'customer_review',
        },
      })
    }
  }

  if (vectors.length > 0) {
    await index.upsert(vectors)
  }

  return NextResponse.json({ status: 'ok', upserted: vectors.length })
}
