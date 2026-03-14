import type { MetadataRoute } from 'next'
import { getAllPosts, getAllProducts } from '@/lib/sanity/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://henna-by-chippy.vercel.app'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), priority: 1.0, changeFrequency: 'weekly' },
    { url: `${base}/shop`, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly' },
    { url: `${base}/bridal`, lastModified: new Date(), priority: 0.9, changeFrequency: 'monthly' },
    { url: `${base}/reviews`, lastModified: new Date(), priority: 0.7, changeFrequency: 'weekly' },
    { url: `${base}/blog`, lastModified: new Date(), priority: 0.8, changeFrequency: 'weekly' },
    { url: `${base}/privacy`, lastModified: new Date(), priority: 0.3, changeFrequency: 'yearly' },
    { url: `${base}/terms`, lastModified: new Date(), priority: 0.3, changeFrequency: 'yearly' },
    {
      url: `${base}/refund-policy`,
      lastModified: new Date(),
      priority: 0.4,
      changeFrequency: 'yearly',
    },
    {
      url: `${base}/support/refund`,
      lastModified: new Date(),
      priority: 0.5,
      changeFrequency: 'yearly',
    },
  ]

  const [products, posts] = await Promise.all([getAllProducts(), getAllPosts()])

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/shop/${p.slug}`,
    lastModified: new Date(),
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  }))

  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    priority: 0.7,
    changeFrequency: 'monthly' as const,
  }))

  return [...staticRoutes, ...productRoutes, ...blogRoutes]
}
