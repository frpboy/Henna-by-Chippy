import { NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity/client'

export const revalidate = 60

export async function GET() {
  const now = new Date().toISOString()
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  try {
    const [active, recentlyExpired] = await Promise.all([
      sanityClient.fetch(
        `*[_type == "promotion" && active == true
          && (validFrom == null || validFrom <= $now)
          && (validUntil == null || validUntil > $now)] | order(validUntil asc) {
          _id, title, aiDescription, discountType, discountValue,
          applicableTo, validUntil, validFrom, minimumOrderValue
        }`,
        { now },
      ),
      sanityClient.fetch(
        `*[_type == "promotion" && active == true
          && validUntil != null && validUntil >= $yesterday && validUntil <= $now] {
          _id, title, validUntil
        }`,
        { now, yesterday },
      ),
    ])

    return NextResponse.json(
      { active, recentlyExpired },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' } },
    )
  } catch {
    return NextResponse.json({ active: [], recentlyExpired: [] })
  }
}
