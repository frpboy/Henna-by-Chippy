'use client'

import { Snowflake, X } from 'lucide-react'

interface FreezeWarningModalProps {
  onConfirm: () => void
  onCancel: () => void
}

export default function FreezeWarningModal({ onConfirm, onCancel }: FreezeWarningModalProps) {
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
        aria-labelledby="freeze-modal-title"
        className="fixed inset-0 z-[80] flex items-center justify-center px-4"
      >
        <div className="bg-ivory-bg rounded-2xl shadow-hover max-w-sm w-full p-6 relative">

          {/* Close button */}
          <button
            onClick={onCancel}
            aria-label="Cancel"
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors text-warm-gray"
          >
            <X size={18} />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-terracotta/15 rounded-full flex items-center justify-center">
              <Snowflake size={28} strokeWidth={1.5} className="text-terracotta" />
            </div>
          </div>

          {/* Heading */}
          <h2
            id="freeze-modal-title"
            className="font-serif text-henna-maroon text-xl text-center mb-2"
          >
            Ready to freeze?
          </h2>

          {/* Body */}
          <p className="text-sm text-dark-earth/70 text-center leading-relaxed mb-2">
            These cones have no preservatives. Please put them straight into the freezer the moment
            they arrive. Outside the freezer for more than 3 days means a weak, orange stain.
          </p>
          <p className="text-xs text-warm-gray text-center mb-6">
            Frozen correctly: deep maroon for up to 3 to 4 months.
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button
              onClick={onConfirm}
              className="btn-whatsapp w-full justify-center text-sm font-semibold"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Yes, I&apos;ll freeze immediately. Order now.
            </button>
            <button
              onClick={onCancel}
              className="text-sm text-warm-gray hover:text-henna-maroon transition-colors py-2 text-center"
            >
              Go back to cart
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
