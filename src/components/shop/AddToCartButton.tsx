'use client'

import { useCartStore } from '@/store/cart'

interface Props {
  productId: string
  name: string
  variant: 'nail' | 'skin'
  price: number
  image?: string
  overlay?: boolean   // true when rendered inside the card hover overlay
}

export default function AddToCartButton({ productId, name, variant, price, image, overlay }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const handleAdd = () => {
    addItem({ productId, name, variant, price, image })
    openCart()
  }

  if (overlay) {
    return (
      <button
        onClick={handleAdd}
        aria-label={`Add ${name} to cart`}
        className="mt-2 px-5 py-2 rounded-full bg-white text-henna-maroon text-sm font-bold hover:bg-ivory-bg transition-colors"
      >
        Add to Cart
      </button>
    )
  }

  return (
    <button
      onClick={handleAdd}
      aria-label={`Add ${name} to cart`}
      className="btn-primary py-2 px-4 text-sm"
    >
      Add to Cart
    </button>
  )
}
