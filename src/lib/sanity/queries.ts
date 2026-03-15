import { sanityClient } from './client'
import type { Product, BridalGallery, Review, SiteSettings, Post } from '@/types'

// ── Live AI context ────────────────────────────────────────────────
// Fetched at chat request time so the AI always has real-time data.

interface LiveProductStatus {
  name: string
  type: string
  price: number
  inStock: boolean
  stockCount?: number
}

interface LivePromotion {
  title: string
  aiDescription: string
  discountType: string
  discountValue?: string
  applicableTo: string[]
  validUntil?: string
  minimumOrderValue?: number
}

interface LiveAiContext {
  acceptingOrders: boolean
  dispatchDays: string
  dispatchNote?: string
  products: LiveProductStatus[]
  promotions: LivePromotion[]
}

const now = () => new Date().toISOString()

export async function getLiveAiContext(): Promise<LiveAiContext | null> {
  if (!isSanityConfigured) return null
  try {
    const [settings, products, promotions] = await Promise.all([
      sanityClient.fetch<{ acceptingOrders: boolean; dispatchDays: string; dispatchNote?: string }>(
        `*[_type == "siteSettings"][0] { acceptingOrders, dispatchDays, dispatchNote }`
      ),
      sanityClient.fetch<LiveProductStatus[]>(
        `*[_type == "product"] | order(type asc) { name, type, price, inStock, stockCount }`
      ),
      sanityClient.fetch<LivePromotion[]>(
        `*[_type == "promotion" && active == true && (validUntil == null || validUntil > $now) && (validFrom == null || validFrom <= $now)] {
          title, aiDescription, discountType, discountValue, applicableTo, validUntil, minimumOrderValue
        }`,
        { now: now() }
      ),
    ])
    return {
      acceptingOrders: settings?.acceptingOrders ?? true,
      dispatchDays: settings?.dispatchDays ?? '1-2 business days',
      dispatchNote: settings?.dispatchNote,
      products: products ?? [],
      promotions: promotions ?? [],
    }
  } catch {
    return null
  }
}

const isSanityConfigured = !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

// ── Products ──────────────────────────────────────────────────────

const productFields = `
  _id,
  _type,
  name,
  variant,
  price,
  weight,
  description,
  inStock,
  stockCount,
  "slug": slug.current,
  image {
    asset,
    alt
  }
`

export async function getAllProducts(): Promise<Product[]> {
  if (!isSanityConfigured) return []
  return sanityClient.fetch(
    `*[_type == "product" && inStock == true] | order(variant asc) { ${productFields} }`,
  )
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSanityConfigured) return null
  return sanityClient.fetch(
    `*[_type == "product" && slug.current == $slug][0] { ${productFields} }`,
    { slug },
  )
}

// ── Site Settings ─────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!isSanityConfigured) return null
  return sanityClient.fetch(`*[_type == "siteSettings"][0]`)
}

// ── Bridal Gallery ────────────────────────────────────────────────

export async function getFeaturedBridalGallery(): Promise<BridalGallery[]> {
  if (!isSanityConfigured) return []
  return sanityClient.fetch(
    `*[_type == "bridalGallery" && featured == true] | order(order asc) [0...12] {
      _id,
      title,
      occasion,
      location,
      featured,
      order,
      image { asset, alt }
    }`,
  )
}

export async function getBridalGalleryPage(start: number, end: number): Promise<BridalGallery[]> {
  if (!isSanityConfigured) return []
  return sanityClient.fetch(
    `*[_type == "bridalGallery"] | order(order asc) [$start...$end] {
      _id,
      title,
      occasion,
      location,
      featured,
      order,
      image { asset, alt }
    }`,
    { start, end },
  )
}

// ── Reviews ───────────────────────────────────────────────────────

export async function getApprovedReviews(start = 0, end = 12): Promise<Review[]> {
  if (!isSanityConfigured) return []
  return sanityClient.fetch(
    `*[_type == "review" && approved == true] | order(submittedAt desc) [$start...$end] {
      _id,
      customerName,
      location,
      rating,
      reviewText,
      coneUsed,
      hoursKept,
      submittedAt,
      stainPhotos { asset, alt }
    }`,
    { start, end },
  )
}

// ── Blog Posts ────────────────────────────────────────────────────

export async function getAllPosts(): Promise<Post[]> {
  if (!isSanityConfigured) return []
  return sanityClient.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      _id,
      _type,
      title,
      "slug": slug.current,
      excerpt,
      featuredImage { asset, alt },
      category,
      tags,
      publishedAt,
      featured,
      seoTitle,
      seoDescription
    }`,
  )
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isSanityConfigured) return null
  return sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      _type,
      title,
      "slug": slug.current,
      excerpt,
      featuredImage { asset, alt },
      body,
      category,
      tags,
      publishedAt,
      featured,
      seoTitle,
      seoDescription
    }`,
    { slug },
  )
}

export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  if (!isSanityConfigured) return []
  return sanityClient.fetch(
    `*[_type == "post" && featured == true] | order(publishedAt desc) [0...$limit] {
      _id,
      _type,
      title,
      "slug": slug.current,
      excerpt,
      featuredImage { asset, alt },
      category,
      publishedAt,
      featured
    }`,
    { limit },
  )
}

export async function getFeaturedReviews(limit = 6): Promise<Review[]> {
  if (!isSanityConfigured) return []
  return sanityClient.fetch(
    `*[_type == "review" && approved == true && featured == true] | order(submittedAt desc) [0...$limit] {
      _id,
      customerName,
      location,
      rating,
      reviewText,
      coneUsed,
      hoursKept,
      submittedAt,
      stainPhotos { asset, alt }
    }`,
    { limit },
  )
}
