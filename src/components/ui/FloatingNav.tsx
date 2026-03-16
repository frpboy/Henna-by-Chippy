'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'

const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/bridal', label: 'Bridal' },
  { href: '/bridal#booking', label: 'Book' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
]

export default function FloatingNav() {
  const [hidden, setHidden] = useState(false)
  const [topOffset, setTopOffset] = useState(16) // default 1rem = 16px
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const totalItems = useCartStore((s) => s.getTotalItems())
  const openCart = useCartStore((s) => s.openCart)

  useEffect(() => { setMounted(true) }, [])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [menuOpen, closeMenu])

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
          onClick={closeMenu}
          className="font-serif text-henna-maroon font-semibold text-sm hover:opacity-75 transition-opacity"
        >
          Henna by Chippy
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-henna-maroon hover:text-leaf-green transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={openCart}
            aria-label={mounted && totalItems > 0 ? `Cart, ${totalItems} items` : 'Cart'}
            className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors"
          >
            <CartIcon />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-leaf-green text-white text-xs flex items-center justify-center font-bold">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={openCart}
            aria-label={mounted && totalItems > 0 ? `Cart, ${totalItems} items` : 'Cart'}
            className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors"
          >
            <CartIcon />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-leaf-green text-white text-xs flex items-center justify-center font-bold">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors"
          >
            {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-50" aria-hidden="true" onClick={closeMenu} />

          <div
            className="nav-mobile-menu"
            style={{ top: topOffset + 58 }}
            role="dialog"
            aria-label="Navigation menu"
          >
            {/* Decorative mini henna tree */}
            <div className="flex justify-center mb-3" aria-hidden="true">
              <svg
                width="28"
                height="34"
                viewBox="0 0 100 120"
                fill="none"
                className="henna-tree-icon-sway opacity-25"
              >
                <ellipse cx="50" cy="113" rx="9" ry="2.5" fill="#5D2906" opacity="0.4" />
                <path d="M50 112 C49 93 51 76 50 56" stroke="#5D2906" strokeWidth="5" strokeLinecap="round" />
                <path d="M50 90 C41 83 29 77 17 69" stroke="#5D2906" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M50 90 C59 83 71 77 83 69" stroke="#5D2906" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M50 68 C39 61 25 53 13 42" stroke="#5D2906" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M50 68 C61 61 75 53 87 42" stroke="#5D2906" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M50 52 C50 38 50 22 50 6" stroke="#5D2906" strokeWidth="2" strokeLinecap="round" />
                <ellipse cx="14" cy="66" rx="5.5" ry="9" fill="#5D2906" transform="rotate(-45 14 66)" />
                <ellipse cx="86" cy="66" rx="5.5" ry="9" fill="#5D2906" transform="rotate(45 86 66)" />
                <ellipse cx="10" cy="38" rx="5" ry="8" fill="#5D2906" transform="rotate(-55 10 38)" />
                <ellipse cx="90" cy="38" rx="5" ry="8" fill="#5D2906" transform="rotate(55 90 38)" />
                <ellipse cx="50" cy="3" rx="5" ry="8" fill="#5D2906" />
              </svg>
            </div>

            <nav aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-henna-maroon font-medium text-sm hover:bg-henna-maroon/5 transition-colors"
                >
                  {/* Henna leaf dot accent */}
                  <svg width="7" height="11" viewBox="0 0 7 11" fill="none" aria-hidden="true">
                    <ellipse cx="3.5" cy="5.5" rx="3" ry="5" fill="#5D2906" opacity="0.35" />
                  </svg>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-3 pt-3 border-t border-henna-maroon/10">
              <Link
                href="/shop"
                onClick={closeMenu}
                className="flex items-center justify-center w-full rounded-full py-2.5 text-sm font-semibold text-white transition-colors"
                style={{ background: 'var(--color-leaf-green)' }}
              >
                Shop Now
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  )
}

/* ── Icon sub-components ─────────────────────────────────────── */

function CartIcon() {
  return (
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
  )
}

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {/* Organic branch-style lines */}
      <path d="M3 5.5 Q10 4.5 17 5.5" stroke="#5D2906" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 10 Q10 10 17 10" stroke="#5D2906" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 14.5 Q10 15.5 17 14.5" stroke="#5D2906" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 5 L15 15" stroke="#5D2906" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15 5 L5 15" stroke="#5D2906" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
