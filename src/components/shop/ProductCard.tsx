'use client'

import Image from 'next/image'
import { useCartStore } from '@/store/cart'
import type { Product } from '@/types'
import { thumbnailUrl, lqipUrl } from '@/lib/sanity/image'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const imgUrl = product.image ? thumbnailUrl(product.image) : '/images/placeholder.jpg'
  const blur = product.image ? lqipUrl(product.image) : undefined

  const handleAdd = () => {
    addItem({
      productId: product._id,
      name: product.name,
      variant: product.variant,
      price: product.price,
      image: imgUrl,
    })
    openCart()
  }

  return (
    <article className="product-card hover-reveal-card group" aria-label={product.name}>
      <div className="relative aspect-square">
        <Image
          src={imgUrl}
          alt={product.image?.alt ?? product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
          loading="lazy"
          placeholder={blur ? 'blur' : 'empty'}
          blurDataURL={blur}
        />

        {/* Hover overlay */}
        <div className="card-overlay">
          <p className="text-white font-serif text-lg font-semibold">{product.name}</p>
          <p className="text-white/80 text-sm">{product.weight}</p>
          <button
            onClick={handleAdd}
            className="mt-2 px-5 py-2 rounded-full bg-white text-henna-maroon text-sm font-bold hover:bg-ivory-bg transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-serif text-henna-maroon font-semibold text-base">{product.name}</h3>
        <p className="text-warm-gray text-xs mt-0.5">{product.weight}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-henna-maroon font-bold text-lg">₹{product.price}</span>
          <button
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            className="btn-primary py-2 px-4 text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  )
}
