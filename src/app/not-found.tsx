import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Page Not Found | Henna by Chippy',
}

export default function NotFound() {
  return (
    <main
      className="min-h-screen bg-ivory-bg flex flex-col items-center justify-center px-6 text-center"
      style={{ paddingTop: '80px', paddingBottom: '60px' }}
    >
      {/* Henna tree */}
      <div style={{ marginBottom: '2rem' }}>
        <svg
          className="henna-tree-sway"
          width="120"
          height="144"
          viewBox="0 0 100 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Ground / root shadow */}
          <ellipse cx="50" cy="113" rx="9" ry="2.5" fill="#5D2906" opacity="0.2" />

          {/* Trunk — gentle S-curve */}
          <path
            d="M50 112 C49 93 51 76 50 56"
            stroke="#5D2906"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Lower branches */}
          <path
            d="M50 90 C41 83 29 77 17 69"
            stroke="#5D2906"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M50 90 C59 83 71 77 83 69"
            stroke="#5D2906"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Mid branches */}
          <path
            d="M50 74 C39 67 25 59 13 48"
            stroke="#5D2906"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M50 74 C61 67 75 59 87 48"
            stroke="#5D2906"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Upper branches */}
          <path
            d="M50 58 C41 49 29 38 23 22"
            stroke="#5D2906"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M50 58 C59 49 71 38 77 22"
            stroke="#5D2906"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Center top */}
          <path
            d="M50 54 C50 40 50 24 50 8"
            stroke="#5D2906"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Leaves — teardrop ellipses at branch tips */}
          {/* Lower left */}
          <ellipse
            cx="14"
            cy="66"
            rx="5.5"
            ry="9"
            fill="#5D2906"
            transform="rotate(-45 14 66)"
          />
          {/* Lower right */}
          <ellipse
            cx="86"
            cy="66"
            rx="5.5"
            ry="9"
            fill="#5D2906"
            transform="rotate(45 86 66)"
          />
          {/* Mid left */}
          <ellipse
            cx="10"
            cy="44"
            rx="5"
            ry="8"
            fill="#5D2906"
            transform="rotate(-55 10 44)"
          />
          {/* Mid right */}
          <ellipse
            cx="90"
            cy="44"
            rx="5"
            ry="8"
            fill="#5D2906"
            transform="rotate(55 90 44)"
          />
          {/* Upper left */}
          <ellipse
            cx="20"
            cy="18"
            rx="4.5"
            ry="7.5"
            fill="#5D2906"
            transform="rotate(-65 20 18)"
          />
          {/* Upper right */}
          <ellipse
            cx="80"
            cy="18"
            rx="4.5"
            ry="7.5"
            fill="#5D2906"
            transform="rotate(65 80 18)"
          />
          {/* Top leaf */}
          <ellipse cx="50" cy="5" rx="5" ry="8" fill="#5D2906" />

          {/* Small decorative henna dots on branches */}
          <circle cx="31" cy="82" r="2.5" fill="#5D2906" opacity="0.55" />
          <circle cx="69" cy="82" r="2.5" fill="#5D2906" opacity="0.55" />
          <circle cx="23" cy="62" r="2" fill="#5D2906" opacity="0.45" />
          <circle cx="77" cy="62" r="2" fill="#5D2906" opacity="0.45" />
          <circle cx="33" cy="43" r="1.5" fill="#5D2906" opacity="0.4" />
          <circle cx="67" cy="43" r="1.5" fill="#5D2906" opacity="0.4" />
        </svg>
      </div>

      {/* 404 number */}
      <p
        className="font-serif text-henna-maroon font-bold"
        style={{ fontSize: 'clamp(4rem, 15vw, 7rem)', lineHeight: 1, marginBottom: '0.5rem' }}
      >
        404
      </p>

      {/* Dialogue bubble from the tree */}
      <div
        className="relative inline-block bg-white border border-henna-maroon/15 rounded-2xl px-5 py-3 text-sm text-henna-maroon font-medium shadow-sm mb-6"
        style={{ maxWidth: 320 }}
      >
        {/* Little speech-bubble tail pointing up toward the tree */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '9px solid transparent',
            borderRight: '9px solid transparent',
            borderBottom: '10px solid white',
          }}
        />
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderBottom: '11px solid rgba(93,41,6,0.15)',
          }}
        />
        &ldquo;I was just swaying here peacefully. No idea where that page went.&rdquo;
      </div>

      {/* Main message */}
      <h1 className="font-serif text-henna-maroon text-2xl font-semibold mb-2">
        Page not found
      </h1>
      <p className="text-warm-gray text-sm mb-8" style={{ maxWidth: 340 }}>
        This page wandered off into the henna garden. Maybe it got distracted by a nice bridal
        design.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors"
          style={{ background: 'var(--color-henna-maroon)' }}
        >
          Go home
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-henna-maroon border border-henna-maroon/30 hover:bg-henna-maroon/5 transition-colors"
        >
          Browse the shop
        </Link>
      </div>

      {/* Secondary dialogue */}
      <p className="text-warm-gray text-xs mt-10" style={{ maxWidth: 280 }}>
        Psst. The tree says the henna is fresh. Don&apos;t let it go to waste.
      </p>
    </main>
  )
}
