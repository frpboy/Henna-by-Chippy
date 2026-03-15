'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'

export default function FloatingNav() {
  const [hidden, setHidden] = useState(false)
  const [topOffset, setTopOffset] = useState(16) // default 1rem = 16px
  const [mounted, setMounted] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const totalItems = useCartStore((s) => s.getTotalItems())
  const openCart = useCartStore((s) => s.openCart)

  useEffect(() => { setMounted(true) }, [])

  // Scroll-aware show/hide
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHidden(!entry.isIntersecting)
      },
      { threshold: 0 },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  // Offset the nav below the storage warning banner if one is present
  useEffect(() => {
    const GAP = 10 // px gap between banner bottom and nav top

    function measure() {
      const banner = document.querySelector<HTMLElement>('.storage-warning')
      if (banner) {
        setTopOffset(banner.offsetHeight + GAP)
      } else {
        setTopOffset(16) // 1rem fallback
      }
    }

    measure()

    // Watch for banner appearing/disappearing on route changes and resizes
    const ro = new ResizeObserver(measure)
    const mo = new MutationObserver(measure)

    const banner = document.querySelector<HTMLElement>('.storage-warning')
    if (banner) ro.observe(banner)

    // Watch for banner being added/removed from DOM
    mo.observe(document.body, { childList: true, subtree: true })

    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      mo.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <>
      {/* Sentinel at the very top */}
      <div ref={sentinelRef} aria-hidden="true" style={{ position: 'absolute', top: 0 }} />

      <nav
        className={`floating-nav${hidden ? ' nav-hidden' : ''}`}
        style={{ top: topOffset }}
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="font-serif text-henna-maroon font-semibold text-sm hover:opacity-75 transition-opacity"
        >
          Henna by Chippy
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/shop"
            className="text-sm font-medium text-henna-maroon hover:text-leaf-green transition-colors"
          >
            Shop
          </Link>
          <Link
            href="/bridal"
            className="text-sm font-medium text-henna-maroon hover:text-leaf-green transition-colors"
          >
            Bridal
          </Link>
          <Link
            href="/bridal#booking"
            className="text-sm font-medium text-henna-maroon hover:text-leaf-green transition-colors"
          >
            Book
          </Link>

          <button
            onClick={openCart}
            aria-label={mounted && totalItems > 0 ? `Cart, ${totalItems} items` : 'Cart'}
            className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <line x1="3" x2="21" y1="6" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-leaf-green text-white text-xs flex items-center justify-center font-bold">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  )
}
