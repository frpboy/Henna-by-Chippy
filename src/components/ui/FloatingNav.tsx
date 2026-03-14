'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'

export default function FloatingNav() {
  const [hidden, setHidden] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const totalItems = useCartStore((s) => s.getTotalItems())
  const openCart = useCartStore((s) => s.openCart)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hide nav when sentinel (top of page) is not visible = user scrolled down
        setHidden(!entry.isIntersecting)
      },
      { threshold: 0 },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Sentinel at the very top */}
      <div ref={sentinelRef} aria-hidden="true" style={{ position: 'absolute', top: 0 }} />

      <nav className={`floating-nav${hidden ? ' nav-hidden' : ''}`} aria-label="Main navigation">
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
            aria-label={`Cart, ${totalItems} items`}
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
            {totalItems > 0 && (
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
