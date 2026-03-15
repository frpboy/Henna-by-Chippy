import type { Metadata } from 'next'
import Image from 'next/image'
import { getAllProducts } from '@/lib/sanity/queries'
import ProductCard from '@/components/shop/ProductCard'
import AddToCartButton from '@/components/shop/AddToCartButton'
import StorageWarningBanner from '@/components/shared/StorageWarningBanner'

const STATIC_PRODUCTS = [
  {
    id: 'nail-cone',
    variant: 'nail' as const,
    name: 'Nail Cone',
    weight: '10-15g',
    price: 35,
    image: '/images/cone-product.jpg',
    alt: 'Chippy henna cones held in hand, lotus flower in background',
    description: 'Perfect for nail colour. Deep maroon stain that lasts 8-12 days.',
  },
  {
    id: 'skin-cone',
    variant: 'skin' as const,
    name: 'Skin Cone',
    weight: '25-30g',
    price: 45,
    image: '/images/cones-on-fabric.jpg',
    alt: 'Two Chippy branded henna cones resting on fabric',
    description: 'For skin designs. Larger cone for bridal and full hand patterns.',
  },
]

export const metadata: Metadata = {
  title: 'Shop Henna Cones',
  description:
    'Buy pure organic henna cones online. Nail cone Rs 35, Skin cone Rs 45. Ships across Kerala and India. No PPD, no preservatives.',
}

export default async function ShopPage() {
  const products = await getAllProducts()

  return (
    <>
      <StorageWarningBanner />

      <div className="section-container pt-28">
        <h1
          className="font-serif text-henna-maroon text-center mb-2"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
        >
          Henna Cones
        </h1>
        <p className="text-center text-warm-gray text-sm mb-10">
          Handmade in Karuvarakundu. Pure. No PPD. No preservatives.
        </p>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {STATIC_PRODUCTS.map((product) => (
              <div key={product.id} className="product-card hover-reveal-card">
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
                    <p className="text-white font-semibold text-sm px-4 text-center">{product.description}</p>
                    <AddToCartButton
                      productId={product.id}
                      name={product.name}
                      variant={product.variant}
                      price={product.price}
                      overlay
                    />
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="font-serif text-henna-maroon font-semibold text-lg">{product.name}</h2>
                  <p className="text-warm-gray text-sm mt-1">{product.weight}</p>
                  <p className="text-dark-earth/70 text-xs mt-2">{product.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-henna-maroon font-bold text-xl">₹{product.price}</span>
                    <AddToCartButton
                      productId={product.id}
                      name={product.name}
                      variant={product.variant}
                      price={product.price}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info blurb */}
        <div className="mt-16 max-w-xl mx-auto text-center">
          <h2 className="font-serif text-henna-maroon text-xl mb-3">How to Order</h2>
          <ol className="text-sm text-dark-earth/75 space-y-2 text-left list-decimal list-inside">
            <li>Add products to your cart above</li>
            <li>Click &quot;Order via WhatsApp&quot; in your cart</li>
            <li>Share your delivery address and pincode with Chippy</li>
            <li>Chippy confirms delivery charges and dispatches</li>
          </ol>
        </div>
      </div>
    </>
  )
}
