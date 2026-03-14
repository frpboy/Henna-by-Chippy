import { sanityClient } from './client'
import type { Product, BridalGallery, Review, SiteSettings, Post } from '@/types'

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
