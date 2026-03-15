'use client'

import { useState, useEffect, useCallback } from 'react'

interface Promotion {
  _id: string
  title: string
  aiDescription: string
  discountType: string
  discountValue?: string
  validUntil?: string
  minimumOrderValue?: number
}

interface ExpiredPromo {
  _id: string
  title: string
  validUntil: string
}

interface PromotionData {
  active: Promotion[]
  recentlyExpired: ExpiredPromo[]
}

interface Particle {
  id: number
  left: number
  size: number
  color: string
  delay: number
  duration: number
  shape: 'circle' | 'rect'
}

const CONFETTI_COLORS = ['#5d2906', '#2d4b22', '#d4a373', '#c9a833', '#a0522d', '#ffffff']

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: Math.random() * 9 + 5,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    delay: Math.random() * 1800,
    duration: Math.random() * 1200 + 2200,
    shape: Math.random() > 0.5 ? 'circle' : 'rect',
  }))
}

function formatExpiry(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default function PromotionBanner() {
  const [data, setData] = useState<PromotionData | null>(null)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [particles, setParticles] = useState<Particle[]>([])
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    fetch('/api/promotions')
      .then((r) => r.json())
      .then((d: PromotionData) => {
        setData(d)

        if (d.active.length > 0) {
          const promoId = d.active[0]._id
          const fired = sessionStorage.getItem(`confetti-${promoId}`)
          if (!fired) {
            setParticles(generateParticles(55))
            setShowConfetti(true)
            sessionStorage.setItem(`confetti-${promoId}`, '1')
            setTimeout(() => setShowConfetti(false), 3800)
          }
        }

        // Load previously dismissed IDs from sessionStorage
        const stored = sessionStorage.getItem('promo-dismissed')
        if (stored) {
          setDismissed(new Set(JSON.parse(stored) as string[]))
        }
      })
      .catch(() => {})
  }, [])

  const dismiss = useCallback((id: string) => {
    setDismissed((prev) => {
      const next = new Set([...prev, id])
      sessionStorage.setItem('promo-dismissed', JSON.stringify([...next]))
      return next
    })
  }, [])

  if (!data) return null

  const visibleActive = data.active.filter((p) => !dismissed.has(p._id))
  const visibleExpired = data.recentlyExpired.filter((p) => !dismissed.has(p._id))

  if (visibleActive.length === 0 && visibleExpired.length === 0) return null

  const promo = visibleActive[0] ?? null
  const expired = visibleExpired[0] ?? null

  return (
    <>
      {/* Confetti overlay */}
      {showConfetti && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 9998,
            overflow: 'hidden',
          }}
        >
          {particles.map((p) => (
            <span
              key={p.id}
              style={{
                position: 'absolute',
                top: '-14px',
                left: `${p.left}%`,
                width: p.shape === 'circle' ? p.size : p.size * 0.5,
                height: p.shape === 'circle' ? p.size : p.size * 1.8,
                borderRadius: p.shape === 'circle' ? '50%' : '2px',
                backgroundColor: p.color,
                animation: `confetti-fall ${p.duration}ms ${p.delay}ms ease-in forwards`,
                opacity: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* Active promotion banner */}
      {promo && (
        <div
          role="banner"
          aria-label="Current promotion"
          style={{
            position: 'fixed',
            top: 70,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--color-leaf-green)',
            color: '#fff',
            borderRadius: '9999px',
            padding: '8px 18px 8px 14px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
            maxWidth: 'calc(100vw - 32px)',
            width: 'max-content',
            animation: 'banner-slide-in 0.4s ease-out both',
          }}
        >
          <span aria-hidden="true" style={{ fontSize: '1.1rem' }}>🎉</span>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.35, margin: 0 }}>
            {promo.aiDescription}
            {promo.validUntil && (
              <span style={{ fontWeight: 400, opacity: 0.85, marginLeft: 6 }}>
                · Ends {formatExpiry(promo.validUntil)}
              </span>
            )}
            {promo.minimumOrderValue && (
              <span style={{ fontWeight: 400, opacity: 0.75, marginLeft: 6 }}>
                · Min. ₹{promo.minimumOrderValue}
              </span>
            )}
          </p>
          <button
            onClick={() => dismiss(promo._id)}
            aria-label="Dismiss promotion"
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: 22,
              height: 22,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#fff',
              fontSize: '0.75rem',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Recently expired "missed out" banner */}
      {!promo && expired && (
        <div
          role="status"
          aria-label="Promotion ended"
          style={{
            position: 'fixed',
            top: 70,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#f5f0e8',
            color: '#6b5e4e',
            border: '1px solid #e8d9c4',
            borderRadius: '9999px',
            padding: '8px 18px 8px 14px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.10)',
            maxWidth: 'calc(100vw - 32px)',
            width: 'max-content',
            animation: 'banner-slide-in 0.4s ease-out both',
          }}
        >
          <span aria-hidden="true" style={{ fontSize: '1rem' }}>😔</span>
          <p style={{ fontSize: '0.78rem', fontWeight: 500, lineHeight: 1.35, margin: 0 }}>
            <strong style={{ color: '#5d2906' }}>{expired.title}</strong> offer ended{' '}
            {formatExpiry(expired.validUntil)}. You missed out this time!
          </p>
          <button
            onClick={() => dismiss(expired._id)}
            aria-label="Dismiss"
            style={{
              background: 'rgba(0,0,0,0.06)',
              border: 'none',
              borderRadius: '50%',
              width: 22,
              height: 22,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#6b5e4e',
              fontSize: '0.75rem',
            }}
          >
            ✕
          </button>
        </div>
      )}
    </>
  )
}
