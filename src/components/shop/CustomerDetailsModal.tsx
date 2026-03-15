'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export interface CustomerDetails {
  name: string
  whatsapp: string
  address: string
  pincode: string
}

interface Props {
  onConfirm: (details: CustomerDetails) => void
  onCancel: () => void
}

export default function CustomerDetailsModal({ onConfirm, onCancel }: Props) {
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [address, setAddress] = useState('')
  const [pincode, setPincode] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm({ name, whatsapp, address, pincode })
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-dark-earth/40 backdrop-blur-sm z-[70]"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-modal-title"
        className="fixed inset-0 z-[80] flex items-center justify-center px-4"
      >
        <div className="bg-ivory-bg rounded-2xl shadow-hover max-w-sm w-full p-6 relative">

          {/* Close */}
          <button
            onClick={onCancel}
            aria-label="Cancel"
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors text-warm-gray"
          >
            <X size={18} />
          </button>

          <h2
            id="details-modal-title"
            className="font-serif text-henna-maroon text-xl mb-1"
          >
            Delivery details
          </h2>
          <p className="text-xs text-warm-gray mb-5">
            These will be sent to Chippy along with your order.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="cd-name" className="block text-xs font-semibold text-henna-maroon mb-1">
                Your Name *
              </label>
              <input
                id="cd-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fathima"
                className="w-full border border-henna-maroon/20 rounded-xl px-4 py-2.5 text-sm bg-warm-white focus:outline-none focus:ring-2 focus:ring-leaf-green"
              />
            </div>

            <div>
              <label htmlFor="cd-wa" className="block text-xs font-semibold text-henna-maroon mb-1">
                WhatsApp Number *
              </label>
              <input
                id="cd-wa"
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="e.g. 919876543210"
                className="w-full border border-henna-maroon/20 rounded-xl px-4 py-2.5 text-sm bg-warm-white focus:outline-none focus:ring-2 focus:ring-leaf-green"
              />
              <p className="text-xs text-warm-gray mt-1">Include country code. e.g. 919876543210</p>
            </div>

            <div>
              <label htmlFor="cd-addr" className="block text-xs font-semibold text-henna-maroon mb-1">
                Delivery Address *
              </label>
              <textarea
                id="cd-addr"
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House name, street, city, district"
                className="w-full border border-henna-maroon/20 rounded-xl px-4 py-2.5 text-sm bg-warm-white focus:outline-none focus:ring-2 focus:ring-leaf-green resize-none"
              />
            </div>

            <div>
              <label htmlFor="cd-pin" className="block text-xs font-semibold text-henna-maroon mb-1">
                Pincode *
              </label>
              <input
                id="cd-pin"
                type="text"
                required
                inputMode="numeric"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 676523"
                className="w-full border border-henna-maroon/20 rounded-xl px-4 py-2.5 text-sm bg-warm-white focus:outline-none focus:ring-2 focus:ring-leaf-green"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full justify-center mt-2"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
