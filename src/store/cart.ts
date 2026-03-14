'use client'

import { create } from 'zustand'
import type { CartItem, CartStore } from '@/types'

const MAX_MESSAGES_PER_SESSION = 10

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  messageCount: 0,

  addItem: (newItem) => {
    set((state) => {
      const existing = state.items.find((i) => i.productId === newItem.productId)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === newItem.productId ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        }
      }
      return { items: [...state.items, { ...newItem, quantity: 1 }] }
    })
  },

  removeItem: (productId) => {
    set((state) => ({ items: state.items.filter((i) => i.productId !== productId) }))
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId)
      return
    }
    set((state) => ({
      items: state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    }))
  },

  clearCart: () => set({ items: [] }),

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  incrementMessageCount: () => set((state) => ({ messageCount: state.messageCount + 1 })),

  getTotalPrice: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  },

  getTotalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0)
  },
}))

export { MAX_MESSAGES_PER_SESSION }

// ── WhatsApp message builder ──────────────────────────────────────

export function buildWhatsAppMessage(items: CartItem[]): string {
  const itemLines = items
    .map((item) => `• ${item.name} x${item.quantity} — ₹${item.price * item.quantity}`)
    .join('\n')

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return encodeURIComponent(
    `🌿 *New Order — Henna by Chippy*\n\nItems:\n${itemLines}\n\n*Subtotal: ₹${subtotal}* (product price only)\n🚚 Delivery charges will be confirmed by Chippy based on your location.\n\n📦 Delivery Address: \n📍 Pincode: `,
  )
}
