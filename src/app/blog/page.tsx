import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAllPosts } from '@/lib/sanity/queries'

export const metadata: Metadata = {
  title: "Chippy's Stories — Henna Tips, Bridal Guides, and More",
  description:
    'Henna tips, bridal guides, and stories from Chippy. Learn how to get the deepest stain, care for your henna, and more.',
}

type StaticPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
  image: string
  alt: string
}

const STATIC_POSTS: StaticPost[] = [
  {
    id: '1',
    slug: 'how-long-to-keep-henna-on',
    title: 'How Long Should You Keep Henna On? The Real Answer.',
    excerpt:
      'Most people wash henna off too early. Here is what actually happens to your stain at 4 hours vs 8 hours vs 12 hours.',
    category: 'tips',
    publishedAt: '2025-12-01',
    image: '/images/stain-skin-1.jpg',
    alt: 'Deep maroon henna stain on hand after 10 hours',
  },
  {
    id: '2',
    slug: 'why-henna-stain-is-orange',
    title: 'Why Is My Henna Stain Orange? (And How to Get Deep Maroon)',
    excerpt:
      'Orange henna usually means one of three things. Here is how to tell what went wrong and how to get the deep maroon stain.',
    category: 'tips',
    publishedAt: '2025-11-15',
    image: '/images/stain-nail-1.jpg',
    alt: 'Dark maroon nail stain from Chippy henna cone',
  },
  {
    id: '3',
    slug: 'bridal-henna-malappuram',
    title: 'Bridal Henna in Malappuram: What to Expect on Your Wedding Day',
    excerpt:
      'A guide for brides booking henna for their wedding. When to apply, how dark to expect the stain, and how to care for it.',
    category: 'bridal',
    publishedAt: '2025-11-01',
    image: '/images/bridal-3.jpg',
    alt: 'Full bridal henna with maroon outfit and gold bangles',
  },
]

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-block text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full bg-terracotta/20 text-terracotta">
      {category}
    </span>
  )
}

export default async function BlogPage() {
  const posts = await getAllPosts()
  const hasPosts = posts.length > 0

  return (
    <div className="section-container pt-28">
      <h1
        className="font-serif text-henna-maroon text-center mb-2"
        style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
      >
        Chippy&apos;s Stories
      </h1>
      <p className="text-center text-warm-gray text-sm mb-12">
        Henna tips, bridal guides, and real talk from the kitchen.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {hasPosts
          ? posts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group product-card block overflow-hidden rounded-2xl"
              >
                {/* Image */}
                {post.featuredImage && (
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={`https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/production/${post.featuredImage.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-webp', '.webp').replace('-png', '.png')}`}
                      alt={post.featuredImage.alt ?? post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                )}
                {!post.featuredImage && (
                  <div className="aspect-video bg-terracotta/10 flex items-center justify-center">
                    <span className="text-terracotta text-4xl">🌿</span>
                  </div>
                )}

                <div className="p-5">
                  {post.category && <CategoryBadge category={post.category} />}
                  <h2 className="font-serif text-henna-maroon mt-3 mb-2 leading-snug text-lg line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-dark-earth/65 text-sm leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                  <p className="text-warm-gray text-xs mt-3">{formatDate(post.publishedAt)}</p>
                </div>
              </Link>
            ))
          : STATIC_POSTS.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group product-card block overflow-hidden rounded-2xl"
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <div className="p-5">
                  <CategoryBadge category={post.category} />
                  <h2 className="font-serif text-henna-maroon mt-3 mb-2 leading-snug text-lg line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-dark-earth/65 text-sm leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                  <p className="text-warm-gray text-xs mt-3">{formatDate(post.publishedAt)}</p>
                </div>
              </Link>
            ))}
      </div>
    </div>
  )
}
