'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'

interface LightboxProps {
  images: { src: string; alt: string }[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function Lightbox({ images, currentIndex, onClose, onPrev, onNext }: LightboxProps) {
  const current = images[currentIndex]
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < images.length - 1

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && hasPrev) onPrev()
      if (e.key === 'ArrowRight' && hasNext) onNext()
    },
    [onClose, onPrev, onNext, hasPrev, hasNext],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  if (!current) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark-earth/90"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M3 3 L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <path d="M15 3 L3 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <p className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-white/70 text-xs tabular-nums">
          {currentIndex + 1} / {images.length}
        </p>
      )}

      {/* Prev */}
      {hasPrev && (
        <button
          onClick={onPrev}
          aria-label="Previous image"
          className="absolute left-3 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M11 3 L5 9 L11 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Image */}
      <div
        className="relative z-10 max-w-[92vw] max-h-[88vh] rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={current.src}
          alt={current.alt}
          width={900}
          height={900}
          className="object-contain max-w-[92vw] max-h-[88vh] w-auto h-auto"
          priority
        />
        {current.alt && (
          <p className="absolute bottom-0 inset-x-0 bg-dark-earth/60 text-white text-xs text-center px-4 py-2">
            {current.alt}
          </p>
        )}
      </div>

      {/* Next */}
      {hasNext && (
        <button
          onClick={onNext}
          aria-label="Next image"
          className="absolute right-3 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M7 3 L13 9 L7 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  )
}

/* ── useLightbox hook — manages open/index state ─────────────── */

import { useState } from 'react'

export function useLightbox(images: { src: string; alt: string }[]) {
  const [index, setIndex] = useState<number | null>(null)

  const open = (i: number) => setIndex(i)
  const close = () => setIndex(null)
  const prev = () => setIndex((i) => (i !== null && i > 0 ? i - 1 : i))
  const next = () => setIndex((i) => (i !== null && i < images.length - 1 ? i + 1 : i))

  const lightbox =
    index !== null ? (
      <Lightbox
        images={images}
        currentIndex={index}
        onClose={close}
        onPrev={prev}
        onNext={next}
      />
    ) : null

  return { open, close, lightbox }
}
