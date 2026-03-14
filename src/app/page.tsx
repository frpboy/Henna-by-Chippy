import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Leaf, ShieldCheck, Snowflake } from 'lucide-react'
import { getAllProducts } from '@/lib/sanity/queries'
import { productImageUrl, lqipUrl } from '@/lib/sanity/image'
import FreshnessChecker from '@/components/shared/FreshnessChecker'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Henna by Chippy — Natural Organic Henna, Malappuram Kerala',
  alternates: { canonical: process.env.NEXT_PUBLIC_SITE_URL },
}

// JSON-LD for homepage
function LocalBusinessJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Henna by Chippy',
    description:
      'Handmade organic henna cones from Karuvarakundu, Malappuram. No PPD, no preservatives.',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    telephone: '+917561856754',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Karuvarakundu',
      addressLocality: 'Malappuram',
      addressRegion: 'Kerala',
      postalCode: '676523',
      addressCountry: 'IN',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Henna Cones',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Product', name: 'Nail Cone', description: '10-15g henna cone' },
          price: '35',
          priceCurrency: 'INR',
        },
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Product', name: 'Skin Cone', description: '25-30g henna cone' },
          price: '45',
          priceCurrency: 'INR',
        },
      ],
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// Static product fallback used when Sanity isn't configured yet
const STATIC_PRODUCTS = [
  {
    id: 'nail-cone',
    name: 'Nail Cone',
    weight: '10-15g',
    price: 35,
    slug: 'nail-cone',
    image: '/images/cone-product.jpg',
    alt: 'Chippy henna cones held in hand with lotus flower background',
  },
  {
    id: 'skin-cone',
    name: 'Skin Cone',
    weight: '25-30g',
    price: 45,
    slug: 'skin-cone',
    image: '/images/cones-on-fabric.jpg',
    alt: 'Two Chippy branded henna cones resting on fabric',
  },
]

// Static showcase photos
const SHOWCASE_PHOTOS = [
  { src: '/images/stain-skin-1.jpg', alt: 'Elegant skin henna design with ring and floral background' },
  { src: '/images/bridal-2.jpg', alt: 'Full bridal henna with Chippy watermark, bold dark design' },
  { src: '/images/stain-floral-1.jpg', alt: 'Artistic floral henna design in deep maroon' },
  { src: '/images/bridal-3.jpg', alt: 'Bridal henna with maroon outfit and gold bangles' },
  { src: '/images/stain-nail-1.jpg', alt: 'Nail henna — dark henna applied on fingertips' },
  { src: '/images/bridal-5.jpg', alt: 'Skin henna design against green tropical leaves' },
]

export default async function HomePage() {
  const products = await getAllProducts()
  const hasProducts = products.length > 0

  return (
    <>
      <LocalBusinessJsonLd />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="hero-glow" aria-label="Hero">
        <div className="relative min-h-screen flex items-center w-full">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/bridal-1.webp"
              alt="Beautiful full bridal henna design on both hands with gold bangles"
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-ivory-bg/70" />
            {/* Maroon glow overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(93,41,6,0.15) 0%, transparent 70%)',
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center max-w-3xl mx-auto px-6 pt-28 pb-20 w-full">
            <p className="text-terracotta text-sm font-semibold tracking-widest uppercase mb-4">
              Handmade in Karuvarakundu, Kerala
            </p>
            <h1
              className="font-serif text-henna-maroon leading-tight mb-6"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
            >
              Pure Organic Henna,
              <br />
              <span className="text-leaf-green">Straight from Nature</span>
            </h1>
            <p
              className="text-dark-earth/80 text-lg leading-relaxed max-w-xl mx-auto mb-8"
              style={{ textShadow: '0 1px 3px rgba(255,253,245,0.8)' }}
            >
              No PPD, no preservatives, no chemicals. Just pure henna powder, water, essential oil,
              and sugar. Made fresh for your skin and nails.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/shop" className="btn-primary text-base">
                Shop Henna Cones
              </Link>
              <Link href="/bridal" className="btn-outline text-base">
                Bridal Showcase
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Products ────────────────────────────────────────────── */}
      <section className="section-container" aria-labelledby="products-heading">
        <h2
          id="products-heading"
          className="font-serif text-henna-maroon text-center mb-2"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
        >
          Our Henna Cones
        </h2>
        <p className="text-center text-warm-gray text-sm mb-10">
          Handmade in Karuvarakundu. Pure. No PPD. No preservatives.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {hasProducts
            ? products.map((product) => {
                const imgUrl = product.image ? productImageUrl(product.image) : null
                const blur = product.image ? lqipUrl(product.image) : undefined
                return (
                  <Link
                    key={product._id}
                    href={`/shop/${product.slug}`}
                    className="product-card hover-reveal-card block"
                  >
                    <div className="relative aspect-square">
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={product.image?.alt ?? product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover"
                          loading="lazy"
                          placeholder={blur ? 'blur' : 'empty'}
                          blurDataURL={blur}
                        />
                      ) : (
                        <div className="w-full h-full bg-light-sage flex items-center justify-center">
                          <span className="text-4xl">🌿</span>
                        </div>
                      )}
                      <div className="card-overlay">
                        <p className="text-white font-semibold">View Details</p>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-henna-maroon font-semibold text-lg">
                        {product.name}
                      </h3>
                      <p className="text-warm-gray text-sm mt-1">{product.weight}</p>
                      <p className="text-henna-maroon font-bold text-xl mt-3">₹{product.price}</p>
                    </div>
                  </Link>
                )
              })
            : STATIC_PRODUCTS.map((product) => (
                <Link
                  key={product.id}
                  href="/shop"
                  className="product-card hover-reveal-card block"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={product.image}
                      alt={product.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                      loading="lazy"
                    />
                    <div className="card-overlay">
                      <p className="text-white font-semibold">Shop Now</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-henna-maroon font-semibold text-lg">
                      {product.name}
                    </h3>
                    <p className="text-warm-gray text-sm mt-1">{product.weight}</p>
                    <p className="text-henna-maroon font-bold text-xl mt-3">₹{product.price}</p>
                  </div>
                </Link>
              ))}
        </div>
      </section>

      {/* ── Stain Showcase ───────────────────────────────────────── */}
      <section className="section-container" aria-labelledby="showcase-heading">
        <h2
          id="showcase-heading"
          className="font-serif text-henna-maroon text-center mb-2"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
        >
          Real Stain Results
        </h2>
        <p className="text-center text-warm-gray text-sm mb-8">
          What you get after 8-12 hours of wear.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
          {SHOWCASE_PHOTOS.map((photo) => (
            <div key={photo.src} className="relative aspect-square rounded-xl overflow-hidden">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/bridal" className="btn-outline">
            See Bridal Portfolio
          </Link>
        </div>
      </section>

      {/* ── Why Chippy ──────────────────────────────────────────── */}
      <section className="organic-bg" aria-labelledby="why-heading">
        <div className="organic-blob organic-blob-1" aria-hidden="true" />
        <div className="organic-blob organic-blob-2" aria-hidden="true" />
        <div className="section-container relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <h2
            id="why-heading"
            className="font-serif text-henna-maroon mb-4"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
          >
            Why Choose Chippy&apos;s Henna?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 text-left">
            {[
              {
                icon: <Leaf size={28} strokeWidth={1.5} className="text-leaf-green" />,
                title: '100% Natural',
                body: 'Henna powder, water, essential oil, sugar. Nothing else. Zero preservatives.',
              },
              {
                icon: <ShieldCheck size={28} strokeWidth={1.5} className="text-henna-maroon" />,
                title: 'PPD Free',
                body: 'No para-phenylenediamine (PPD) or black henna chemicals that cause allergic reactions.',
              },
              {
                icon: <Snowflake size={28} strokeWidth={1.5} className="text-leaf-green" />,
                title: 'Made Fresh',
                body: 'Made fresh and frozen for preservation. Store in freezer immediately upon arrival.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-ivory-bg/60 rounded-xl p-5 shadow-card">
                <span className="mb-3 block">{item.icon}</span>
                <h3 className="font-serif font-semibold text-henna-maroon mb-2">{item.title}</h3>
                <p className="text-sm text-dark-earth/70 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* ── Delivery Freshness Checker ──────────────────────────── */}
      <section className="section-container" aria-labelledby="freshness-heading">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            id="freshness-heading"
            className="font-serif text-henna-maroon mb-3"
            style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}
          >
            Will it arrive fresh?
          </h2>
          <p className="text-warm-gray text-sm mb-6">
            Henna spoils if outside the freezer for more than 3 days. Check your delivery window
            before ordering.
          </p>
          <div className="flex justify-center">
            <Suspense fallback={<div className="h-16 animate-pulse bg-warm-white rounded-full" />}>
              <FreshnessChecker />
            </Suspense>
          </div>
        </div>
      </section>

      {/* ── Bridal CTA ───────────────────────────────────────────── */}
      <section className="section-container" aria-labelledby="bridal-cta-heading">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
            <Image
              src="/images/bridal-4.jpg"
              alt="Bridal henna on hands with pink saree and gold jewellery"
              fill
              className="object-cover"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2
              id="bridal-cta-heading"
              className="font-serif text-henna-maroon mb-3"
              style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}
            >
              Bridal Henna Bookings
            </h2>
            <p className="text-dark-earth/70 text-sm mb-4 leading-relaxed">
              Beautiful, deep-staining bridal designs for your wedding day. Based in Malappuram,
              serving brides across the district.
            </p>
            <p className="text-dark-earth/70 text-sm mb-6 leading-relaxed">
              Book early. Slots fill quickly around wedding season.
            </p>
            <Link href="/bridal" className="btn-primary">
              See Bridal Portfolio
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
