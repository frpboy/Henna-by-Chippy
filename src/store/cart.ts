'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem, CartStore } from '@/types'

const MAX_MESSAGES_PER_SESSION = 10

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
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
    }),
    {
      name: 'henna-cart',
      storage: createJSONStorage(() => localStorage),
      // Only persist cart items, not UI state (isOpen, messageCount)
      partialize: (state) => ({ items: state.items }),
    },
  ),
)

export { MAX_MESSAGES_PER_SESSION }

// ── WhatsApp message builder ──────────────────────────────────────

interface ActivePromo {
  title: string
  aiDescription: string
}

interface CustomerDetails {
  name: string
  whatsapp: string
  address: string
  pincode: string
}

export function buildWhatsAppMessage(
  items: CartItem[],
  promo?: ActivePromo | null,
  customer?: CustomerDetails,
): string {
  const itemLines = items
    .map((item) => `• ${item.name} x${item.quantity} — Rs ${item.price * item.quantity}`)
    .join('\n')

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const customerSection = customer
    ? `\nName: ${customer.name}\nWhatsApp: ${customer.whatsapp}\nDelivery Address: ${customer.address}\nPincode: ${customer.pincode}`
    : `\nDelivery Address: \nPincode: `

  return encodeURIComponent(
    `*New Order - Henna by Chippy*\n\nItems:\n${itemLines}\n\n*Subtotal: Rs ${subtotal}* (product price only)\nDelivery charges will be confirmed by Chippy based on your location.${customerSection}`,
  )
}
