import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/sanity/queries'

// ── Static post content ──────────────────────────────────────────

type StaticPostFull = {
  slug: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
  image: string
  alt: string
  body: { type: 'h2' | 'p' | 'li'; text: string }[]
}

const STATIC_POSTS_FULL: Record<string, StaticPostFull> = {
  'how-long-to-keep-henna-on': {
    slug: 'how-long-to-keep-henna-on',
    title: 'How Long Should You Keep Henna On? The Real Answer.',
    excerpt:
      'Most people wash henna off too early. Here is what actually happens to your stain at 4 hours vs 8 hours vs 12 hours.',
    category: 'tips',
    publishedAt: '2025-12-01',
    image: '/images/stain-skin-1.jpg',
    alt: 'Deep maroon henna stain on hand after 10 hours',
    body: [
      {
        type: 'p',
        text: 'I get this question almost every day: how long do I keep the henna on? And the honest answer is: the longer, the better. Eight hours is the minimum. Twelve hours will give you the best stain you have ever seen.',
      },
      {
        type: 'h2',
        text: 'What Happens at 4 Hours',
      },
      {
        type: 'p',
        text: 'At 4 hours, the dye has only started to penetrate the top layer of skin. When you remove it, the stain will be a light orange. It will fade even faster, sometimes gone within 3-4 days. Most people who complain about henna fading quickly removed it at this stage.',
      },
      {
        type: 'h2',
        text: 'What Happens at 8 Hours',
      },
      {
        type: 'p',
        text: 'At 8 hours, the dye has gone deeper. You will see a medium reddish-brown when you first remove it, and over the next 24-48 hours it will darken to a rich maroon. This stain lasts 8-10 days with normal use.',
      },
      {
        type: 'h2',
        text: 'What Happens at 12 Hours',
      },
      {
        type: 'p',
        text: 'Twelve hours is where the magic happens. The stain is deep, rich, and the colour darkens over two days into a beautiful maroon. With careful aftercare, it will last 10-12 days. This is the result I am proudest of, and why I always say: sleep with it on if you can.',
      },
      {
        type: 'h2',
        text: 'Aftercare: The Part People Forget',
      },
      {
        type: 'p',
        text: 'After you remove the dried henna paste, do not wash it with water. Scrape it off gently with a spoon or the back of a knife. Then avoid water and soap on the area for at least 24 hours. This is the step most people skip, and it matters more than you think. Water stops the oxidation process that darkens the stain.',
      },
      {
        type: 'p',
        text: 'If you do frequent hand washing or washing dishes, your stain will fade faster. That is just the nature of henna. But with clean hands and careful care, 8-12 days is very achievable.',
      },
    ],
  },
  'why-henna-stain-is-orange': {
    slug: 'why-henna-stain-is-orange',
    title: 'Why Is My Henna Stain Orange? (And How to Get Deep Maroon)',
    excerpt:
      'Orange henna usually means one of three things. Here is how to tell what went wrong and how to get the deep maroon stain.',
    category: 'tips',
    publishedAt: '2025-11-15',
    image: '/images/stain-nail-1.jpg',
    alt: 'Dark maroon nail stain from Chippy henna cone',
    body: [
      {
        type: 'p',
        text: 'If your henna came out orange instead of that deep maroon you were hoping for, do not worry. It usually comes down to one of three reasons, and most of them are easy to fix.',
      },
      {
        type: 'h2',
        text: 'Reason 1: You Removed It Too Early',
      },
      {
        type: 'p',
        text: 'This is the most common reason. If you removed the henna paste before 8 hours, the dye did not have enough time to penetrate deep into the skin. The stain will oxidize and darken a little over the next 24 hours, but it will not reach that maroon colour. Next time, leave it on for 8-12 hours.',
      },
      {
        type: 'h2',
        text: 'Reason 2: You Used Water Too Soon',
      },
      {
        type: 'p',
        text: 'After removing the paste, if you washed the area with water or soap within the first 24 hours, you stopped the oxidation process. The stain needs air and warmth to develop fully. Keep it dry. If you need to wash your hands, try to keep the henna area out of the water.',
      },
      {
        type: 'h2',
        text: 'Reason 3: The Henna Was Old or Stored Incorrectly',
      },
      {
        type: 'p',
        text: 'Henna paste loses its potency if left outside the freezer. Fresh henna gives deep maroon. Old or spoiled henna gives orange or barely any stain at all. If your henna smells different or feels dry, it may have deteriorated. Always store in the freezer immediately upon arrival.',
      },
      {
        type: 'h2',
        text: 'How to Get the Deepest Stain',
      },
      {
        type: 'p',
        text: 'Apply on clean, oil-free skin. Leave on for at least 8 hours, ideally 12. Scrape off gently, do not wash. Keep the area warm and dry for 24 hours. Avoid soap, water, and sanitizer on the stained area. That is it. Follow these steps and you will get the colour you see in my photos.',
      },
    ],
  },
  'bridal-henna-malappuram': {
    slug: 'bridal-henna-malappuram',
    title: 'Bridal Henna in Malappuram: What to Expect on Your Wedding Day',
    excerpt:
      'A guide for brides booking henna for their wedding. When to apply, how dark to expect the stain, and how to care for it.',
    category: 'bridal',
    publishedAt: '2025-11-01',
    image: '/images/bridal-3.jpg',
    alt: 'Full bridal henna with maroon outfit and gold bangles',
    body: [
      {
        type: 'p',
        text: 'Booking bridal henna is one of the most important beauty decisions for your wedding. Get the timing right and you will have a deep, beautiful stain on your wedding day. Get it wrong and you will have a light orange smear. Here is everything you need to know.',
      },
      {
        type: 'h2',
        text: 'When to Apply Bridal Henna',
      },
      {
        type: 'p',
        text: 'The ideal time to apply bridal henna is 2 nights before your wedding. This gives the stain 12 hours to develop overnight, and then another full day to darken before the ceremony. Henna takes 24-48 hours to reach its deepest colour, so applying it the night before gives you the best result on the day itself.',
      },
      {
        type: 'p',
        text: 'Avoid applying on the morning of your wedding. You simply will not have enough time for the stain to develop, and the orange colour will still be there when you are being photographed.',
      },
      {
        type: 'h2',
        text: 'How Dark Will It Be',
      },
      {
        type: 'p',
        text: 'With my henna cones and proper application, you will get a deep reddish-maroon stain that shows beautifully in photos. The stain on the palms tends to be darkest because the skin is thicker there. The back of the hands will be slightly lighter, which is normal.',
      },
      {
        type: 'h2',
        text: 'Aftercare for Brides',
      },
      {
        type: 'p',
        text: 'After the paste is removed, avoid water on your hands as much as possible for the first 24 hours. Do not apply any cream or oil to the stained area in the first day. On the wedding day itself, apply a thin layer of coconut oil before the ceremony: this makes the stain look more vibrant and protects it from water.',
      },
      {
        type: 'h2',
        text: 'Booking a Session in Malappuram',
      },
      {
        type: 'p',
        text: 'I do bridal henna sessions in and around Malappuram district. Sessions are by appointment only, and slots fill up quickly during wedding season. If you are planning a wedding, reach out at least 2-3 weeks in advance via WhatsApp. I will give you an exact cost based on the design and the number of people.',
      },
    ],
  },
}

// ── Helpers ──────────────────────────────────────────────────────

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

// Simple PortableText-like renderer for Sanity body blocks
function renderBody(body: unknown[]): React.ReactNode[] {
  return body.map((block, i) => {
    if (typeof block !== 'object' || block === null) return null
    const b = block as Record<string, unknown>
    const style = (b.style as string) ?? 'normal'
    const children = (b.children as { text?: string }[] | undefined) ?? []
    const text = children.map((c) => c.text ?? '').join('')

    if (style === 'h2') {
      return (
        <h2 key={i} className="font-serif text-henna-maroon text-xl mt-8 mb-3">
          {text}
        </h2>
      )
    }
    if (style === 'h3') {
      return (
        <h3 key={i} className="font-serif text-henna-maroon text-lg mt-6 mb-2">
          {text}
        </h3>
      )
    }
    if (b._type === 'block') {
      return (
        <p key={i} className="text-dark-earth/75 text-sm leading-relaxed mb-4">
          {text}
        </p>
      )
    }
    return null
  })
}

// ── generateStaticParams ─────────────────────────────────────────

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts()
    if (posts.length > 0) {
      return posts.map((p) => ({ slug: p.slug }))
    }
  } catch {
    // Sanity not configured
  }
  return Object.keys(STATIC_POSTS_FULL).map((slug) => ({ slug }))
}

// ── generateMetadata ─────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  try {
    const post = await getPostBySlug(slug)
    if (post) {
      return {
        title: post.seoTitle ?? `${post.title} — Henna by Chippy`,
        description: post.seoDescription ?? post.excerpt,
      }
    }
  } catch {
    // Fall through
  }

  const staticPost = STATIC_POSTS_FULL[slug]
  if (!staticPost) return { title: 'Post Not Found' }

  return {
    title: `${staticPost.title} — Henna by Chippy`,
    description: staticPost.excerpt,
  }
}

// ── JSON-LD ──────────────────────────────────────────────────────

function BlogPostingJsonLd({
  title,
  excerpt,
  publishedAt,
}: {
  title: string
  excerpt: string
  publishedAt: string
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: excerpt,
    datePublished: publishedAt,
    author: { '@type': 'Person', name: 'Chippy' },
    publisher: {
      '@type': 'Organization',
      name: 'Henna by Chippy',
      url: process.env.NEXT_PUBLIC_SITE_URL,
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// ── Page ─────────────────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Try Sanity
  type NormalizedPost = {
    title: string
    excerpt: string
    category: string | undefined
    publishedAt: string
    image: string | null
    alt: string
    hasSanityBody: boolean
    body: unknown[]
    staticBody: StaticPostFull['body'] | null
  }

  let normalized: NormalizedPost | null = null

  try {
    const post = await getPostBySlug(slug)
    if (post) {
      normalized = {
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        publishedAt: post.publishedAt,
        image: null,
        alt: post.featuredImage?.alt ?? post.title,
        hasSanityBody: Array.isArray(post.body) && post.body.length > 0,
        body: Array.isArray(post.body) ? post.body : [],
        staticBody: null,
      }
    }
  } catch {
    // Fall through
  }

  if (!normalized) {
    const staticPost = STATIC_POSTS_FULL[slug]
    if (!staticPost) notFound()
    normalized = {
      title: staticPost.title,
      excerpt: staticPost.excerpt,
      category: staticPost.category,
      publishedAt: staticPost.publishedAt,
      image: staticPost.image,
      alt: staticPost.alt,
      hasSanityBody: false,
      body: [],
      staticBody: staticPost.body,
    }
  }

  return (
    <>
      <BlogPostingJsonLd
        title={normalized.title}
        excerpt={normalized.excerpt}
        publishedAt={normalized.publishedAt}
      />

      {/* Hero */}
      <div className="relative min-h-64 md:min-h-96 pt-20 flex items-end bg-ivory-bg overflow-hidden">
        {normalized.image && (
          <div className="absolute inset-0">
            <Image
              src={normalized.image}
              alt={normalized.alt}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-ivory-bg/75" />
          </div>
        )}
        <div className="relative z-10 section-container pb-8 w-full">
          <div className="max-w-2xl">
            {normalized.category && <CategoryBadge category={normalized.category} />}
            <h1
              className="font-serif text-henna-maroon mt-3 leading-tight"
              style={{ fontSize: 'clamp(1.6rem, 4vw, 2.75rem)' }}
            >
              {normalized.title}
            </h1>
            <p className="text-warm-gray text-sm mt-3">{formatDate(normalized.publishedAt)}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="section-container">
        <div className="max-w-2xl mx-auto">
          <p className="text-dark-earth/70 text-base leading-relaxed mb-6 font-medium">
            {normalized.excerpt}
          </p>

          {normalized.hasSanityBody ? (
            <div className="prose-henna">{renderBody(normalized.body)}</div>
          ) : normalized.staticBody ? (
            <div>
              {normalized.staticBody.map((block, i) => {
                if (block.type === 'h2') {
                  return (
                    <h2 key={i} className="font-serif text-henna-maroon text-xl mt-8 mb-3">
                      {block.text}
                    </h2>
                  )
                }
                return (
                  <p key={i} className="text-dark-earth/75 text-sm leading-relaxed mb-4">
                    {block.text}
                  </p>
                )
              })}
            </div>
          ) : null}

          {/* Back link */}
          <div className="mt-14 pt-8 border-t border-warm-gray/20">
            <Link href="/blog" className="text-leaf-green text-sm font-semibold hover:underline">
              Back to all posts
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
