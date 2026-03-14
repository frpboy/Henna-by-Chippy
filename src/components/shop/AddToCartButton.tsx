'use client'

import { useCartStore } from '@/store/cart'

interface Props {
  productId: string
  name: string
  variant: 'nail' | 'skin'
  price: number
  image?: string
}

export default function AddToCartButton({ productId, name, variant, price, image }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const handleAdd = () => {
    addItem({ productId, name, variant, price, image })
    openCart()
  }

  return (
    <button onClick={handleAdd} className="btn-primary text-base w-full sm:w-auto px-8 py-3">
      Add to Cart
    </button>
  )
}
