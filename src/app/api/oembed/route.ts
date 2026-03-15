import { NextRequest, NextResponse } from 'next/server'

// Allowed platforms only (validated server-side)
const ALLOWED_ORIGINS = ['instagram.com', 'www.instagram.com']

function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ALLOWED_ORIGINS.includes(parsed.hostname)
  } catch {
    return false
  }
}

/**
 * GET /api/oembed?url=<instagram-post-url>
 *
 * Proxies the Instagram oEmbed endpoint so the access token stays server-side.
 * Only instagram.com URLs are accepted.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'url parameter required' }, { status: 400 })
  }

  if (!isAllowedUrl(url)) {
    return NextResponse.json({ error: 'Only instagram.com URLs are supported' }, { status: 400 })
  }

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
  if (!accessToken) {
    return NextResponse.json({ error: 'Instagram oEmbed not configured' }, { status: 503 })
  }

  const oembedUrl = new URL('https://graph.facebook.com/v18.0/instagram_oembed')
  oembedUrl.searchParams.set('url', url)
  oembedUrl.searchParams.set('access_token', accessToken)
  oembedUrl.searchParams.set('omitscript', '1') // Don't include the embed.js script in response

  const res = await fetch(oembedUrl.toString(), {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error('[oembed] Instagram API error:', res.status, errorText)
    return NextResponse.json({ error: 'Failed to fetch oEmbed data' }, { status: res.status })
  }

  const data = await res.json()

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
