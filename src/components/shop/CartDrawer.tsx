'use client'

import { useState, useEffect } from 'react'
import { useCartStore, buildWhatsAppMessage } from '@/store/cart'
import CustomerDetailsModal, { type CustomerDetails } from './CustomerDetailsModal'
import FreezeWarningModal from './FreezeWarningModal'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '917561856754'

interface ActivePromo {
  _id: string
  title: string
  aiDescription: string
  validUntil?: string
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } = useCartStore()
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showFreezeModal, setShowFreezeModal] = useState(false)
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null)
  const [activePromo, setActivePromo] = useState<ActivePromo | null>(null)

  useEffect(() => {
    fetch('/api/promotions')
      .then((r) => r.json())
      .then((d: { active: ActivePromo[] }) => {
        setActivePromo(d.active?.[0] ?? null)
      })
      .catch(() => {})
  }, [])

  const handleCheckoutClick = () => {
    if (items.length === 0) return
    setShowDetailsModal(true)
  }

  const handleDetailsConfirmed = (details: CustomerDetails) => {
    setCustomerDetails(details)
    setShowDetailsModal(false)
    setShowFreezeModal(true)
  }

  const handleConfirmedCheckout = () => {
    setShowFreezeModal(false)
    const msg = buildWhatsAppMessage(items, activePromo, customerDetails ?? undefined)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      {/* Customer details modal */}
      {showDetailsModal && (
        <CustomerDetailsModal
          onConfirm={handleDetailsConfirmed}
          onCancel={() => setShowDetailsModal(false)}
        />
      )}

      {/* Freeze warning modal */}
      {showFreezeModal && (
        <FreezeWarningModal
          onConfirm={handleConfirmedCheckout}
          onCancel={() => setShowFreezeModal(false)}
        />
      )}

      {/* Overlay */}
      <div
        className={`cart-overlay${isOpen ? ' open' : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`cart-drawer${isOpen ? ' open' : ''}`}
        aria-label="Shopping cart"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-henna-maroon/10">
          <h2 className="font-serif text-xl text-henna-maroon font-semibold">Your Cart</h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="text-center text-warm-gray mt-12 text-sm">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4 py-4 border-b border-henna-maroon/8">
                  <div className="flex-1">
                    <p className="font-semibold text-henna-maroon text-sm">{item.name}</p>
                    <p className="text-warm-gray text-xs mt-0.5">₹{item.price} each</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="w-7 h-7 rounded-full border border-henna-maroon/20 flex items-center justify-center text-henna-maroon hover:bg-henna-maroon/5 transition-colors text-sm font-bold"
                      >
                        −
                      </button>
                      <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="w-7 h-7 rounded-full border border-henna-maroon/20 flex items-center justify-center text-henna-maroon hover:bg-henna-maroon/5 transition-colors text-sm font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-bold text-henna-maroon">₹{item.price * item.quantity}</p>
                    <button
                      onClick={() => removeItem(item.productId)}
                      aria-label={`Remove ${item.name}`}
                      className="text-xs text-warm-gray hover:text-henna-maroon transition-colors underline"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-henna-maroon/10 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-warm-gray">Subtotal</span>
              <span className="font-bold text-henna-maroon text-lg">₹{getTotalPrice()}</span>
            </div>
            {activePromo && (
              <div
                style={{
                  background: 'var(--color-leaf-green)',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '8px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 6,
                }}
              >
                <span aria-hidden="true">🎉</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 700 }}>Offer active!</p>
                  <p style={{ margin: '2px 0 0', fontWeight: 400, opacity: 0.9 }}>
                    {activePromo.aiDescription}
                    {activePromo.validUntil && (
                      <> · Ends {new Date(activePromo.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</>
                    )}
                  </p>
                </div>
              </div>
            )}
            <p className="text-xs text-warm-gray">
              Delivery charges confirmed by Chippy based on your pincode.
            </p>
            <button onClick={handleCheckoutClick} className="btn-whatsapp w-full justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Order via WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  )
}
