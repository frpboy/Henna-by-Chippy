import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getAllProducts, getProductBySlug } from '@/lib/sanity/queries'
import { productImageUrl, lqipUrl } from '@/lib/sanity/image'
import StorageWarningBanner from '@/components/shared/StorageWarningBanner'
import AddToCartButton from '@/components/shop/AddToCartButton'

// ── Static fallback data ───────────────────────────────────────────

type StaticProduct = {
  id: string
  name: string
  weight: string
  price: number
  image: string
  alt: string
  description: string
  ingredients: string[]
  howToUse: string[]
  storageNote: string
  variant: 'nail' | 'skin'
}

const STATIC_PRODUCTS: Record<string, StaticProduct> = {
  'nail-cone': {
    id: 'nail-cone',
    name: 'Nail Cone',
    weight: '10-15g',
    price: 35,
    image: '/images/cone-product.jpg',
    alt: 'Chippy henna cone held in hand with lotus flower background',
    description: 'Deep maroon stain for nails. Lasts 8-12 days.',
    variant: 'nail',
    ingredients: ['Henna Powder', 'Water', 'Essential Oil', 'Sugar'],
    howToUse: [
      'Apply to clean, dry nails',
      'Leave on for 8-12 hours',
      'Remove gently with a spoon, do not wash off',
      'Avoid water for first 24 hours after removal',
    ],
    storageNote: 'Store in freezer immediately upon arrival. Shelf life: 3-4 months frozen.',
  },
  'skin-cone': {
    id: 'skin-cone',
    name: 'Skin Cone',
    weight: '25-30g',
    price: 45,
    image: '/images/cones-on-fabric.jpg',
    alt: 'Two Chippy branded henna cones resting on fabric',
    description: 'For full hand, bridal, and skin designs. Larger cone with deep stain.',
    variant: 'skin',
    ingredients: ['Henna Powder', 'Water', 'Essential Oil', 'Sugar'],
    howToUse: [
      'Warm cone gently between palms',
      'Draw design on clean, oil-free skin',
      'Leave on for 8-12 hours',
      'Scrape off with a spoon, do not wash',
      'Avoid water and soap for first 24 hours',
    ],
    storageNote: 'Store in freezer immediately upon arrival. Shelf life: 3-4 months frozen.',
  },
}

// ── generateStaticParams ──────────────────────────────────────────

export async function generateStaticParams() {
  try {
    const products = await getAllProducts()
    if (products.length > 0) {
      return products.map((p) => ({ slug: p.slug }))
    }
  } catch {
    // Sanity not configured
  }
  return [{ slug: 'nail-cone' }, { slug: 'skin-cone' }]
}

// ── generateMetadata ──────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  try {
    const product = await getProductBySlug(slug)
    if (product) {
      return {
        title: `${product.name} — Henna by Chippy`,
        description: product.description,
      }
    }
  } catch {
    // Fall through to static
  }

  const staticProduct = STATIC_PRODUCTS[slug]
  if (!staticProduct) return { title: 'Product Not Found' }

  return {
    title: `${staticProduct.name} — Henna by Chippy`,
    description: staticProduct.description,
  }
}

// ── JSON-LD ───────────────────────────────────────────────────────

function ProductJsonLd({
  name,
  description,
  price,
}: {
  name: string
  description: string
  price: number
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: { '@type': 'Brand', name: 'Henna by Chippy' },
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Henna by Chippy' },
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// ── Page ──────────────────────────────────────────────────────────

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Try Sanity first
  let productData: {
    id: string
    name: string
    weight: string
    price: number
    image: string | null
    imageBlur: string | null
    alt: string
    description: string
    variant: 'nail' | 'skin'
    ingredients: string[]
    howToUse: string[]
    storageNote: string
  } | null = null

  try {
    const sanityProduct = await getProductBySlug(slug)
    if (sanityProduct) {
      const imgUrl = sanityProduct.image ? productImageUrl(sanityProduct.image) : null
      const blur = sanityProduct.image ? lqipUrl(sanityProduct.image) : null
      productData = {
        id: sanityProduct._id,
        name: sanityProduct.name,
        weight: sanityProduct.weight,
        price: sanityProduct.price,
        image: imgUrl,
        imageBlur: blur,
        alt: sanityProduct.image?.alt ?? sanityProduct.name,
        description: sanityProduct.description,
        variant: sanityProduct.variant,
        ingredients: ['Henna Powder', 'Water', 'Essential Oil', 'Sugar'],
        howToUse:
          sanityProduct.variant === 'nail'
            ? [
                'Apply to clean, dry nails',
                'Leave on for 8-12 hours',
                'Remove gently with a spoon, do not wash off',
                'Avoid water for first 24 hours after removal',
              ]
            : [
                'Warm cone gently between palms',
                'Draw design on clean, oil-free skin',
                'Leave on for 8-12 hours',
                'Scrape off with a spoon, do not wash',
                'Avoid water and soap for first 24 hours',
              ],
        storageNote: 'Store in freezer immediately upon arrival. Shelf life: 3-4 months frozen.',
      }
    }
  } catch {
    // Fall through to static
  }

  // Use static if Sanity returned nothing
  if (!productData) {
    const staticProduct = STATIC_PRODUCTS[slug]
    if (!staticProduct) notFound()
    productData = {
      id: staticProduct.id,
      name: staticProduct.name,
      weight: staticProduct.weight,
      price: staticProduct.price,
      image: staticProduct.image,
      imageBlur: null,
      alt: staticProduct.alt,
      description: staticProduct.description,
      variant: staticProduct.variant,
      ingredients: staticProduct.ingredients,
      howToUse: staticProduct.howToUse,
      storageNote: staticProduct.storageNote,
    }
  }

  return (
    <>
      <ProductJsonLd
        name={productData.name}
        description={productData.description}
        price={productData.price}
      />

      <StorageWarningBanner />

      <div className="section-container pt-28">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Product Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-card">
            {productData.image ? (
              <Image
                src={productData.image}
                alt={productData.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
                placeholder={productData.imageBlur ? 'blur' : 'empty'}
                blurDataURL={productData.imageBlur ?? undefined}
              />
            ) : (
              <div className="w-full h-full bg-light-sage flex items-center justify-center">
                <span className="text-6xl">🌿</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-terracotta text-xs font-semibold tracking-widest uppercase mb-2">
              {productData.weight}
            </p>
            <h1
              className="font-serif text-henna-maroon mb-3 leading-tight"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)' }}
            >
              {productData.name}
            </h1>
            <p className="text-dark-earth/70 text-sm leading-relaxed mb-5">
              {productData.description}
            </p>

            <p className="text-henna-maroon font-bold text-3xl mb-6">
              ₹{productData.price}
            </p>

            <AddToCartButton
              productId={productData.id}
              name={productData.name}
              variant={productData.variant}
              price={productData.price}
              image={productData.image ?? undefined}
            />

            {/* Storage note */}
            <div className="mt-6 p-4 rounded-xl border border-terracotta/40 bg-terracotta/10">
              <p className="text-terracotta text-xs font-semibold uppercase tracking-wide mb-1">
                Storage
              </p>
              <p className="text-dark-earth/80 text-sm leading-relaxed">
                {productData.storageNote}
              </p>
            </div>
          </div>
        </div>

        {/* Details below */}
        <div className="max-w-4xl mx-auto mt-14 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Ingredients */}
          <div>
            <h2 className="font-serif text-henna-maroon text-xl mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {productData.ingredients.map((ingredient) => (
                <li key={ingredient} className="flex items-center gap-2 text-sm text-dark-earth/75">
                  <span className="w-1.5 h-1.5 rounded-full bg-leaf-green flex-shrink-0" />
                  {ingredient}
                </li>
              ))}
            </ul>
            <p className="text-xs text-warm-gray mt-3">
              No PPD, no preservatives, no chemicals.
            </p>
          </div>

          {/* How to Use */}
          <div>
            <h2 className="font-serif text-henna-maroon text-xl mb-4">How to Use</h2>
            <ol className="space-y-3">
              {productData.howToUse.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-dark-earth/75">
                  <span className="w-5 h-5 rounded-full bg-henna-maroon text-ivory-bg text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </>
  )
}
