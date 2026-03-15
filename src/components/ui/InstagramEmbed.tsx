'use client'

import { useState, useEffect, useRef } from 'react'

interface Props {
  url: string
  caption?: string
}

/** Extract the shortcode from any Instagram post/reel URL.
 *  Handles: /p/CODE/, /reel/CODE/, /tv/CODE/ */
function getShortcode(url: string): string | null {
  const match = url.match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/)
  return match?.[1] ?? null
}

export default function InstagramEmbed({ url, caption }: Props) {
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const shortcode = getShortcode(url)
  const embedSrc = shortcode
    ? `https://www.instagram.com/p/${shortcode}/embed/`
    : null

  // Load iframe only when scrolled into view
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ minHeight: 440, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
    >
      {!embedSrc ? (
        // Invalid URL — link fallback
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full min-h-[200px] rounded-xl border border-henna-maroon/10 text-sm text-warm-gray hover:text-henna-maroon transition-colors"
        >
          View on Instagram
        </a>
      ) : inView ? (
        <iframe
          src={embedSrc}
          width="320"
          height="440"
          frameBorder="0"
          scrolling="no"
          allowTransparency
          loading="lazy"
          title="Instagram post"
          style={{ borderRadius: 12, border: 'none', maxWidth: '100%' }}
        />
      ) : (
        // Skeleton while waiting for intersection
        <div className="w-full min-h-[440px] rounded-xl bg-henna-maroon/5 animate-pulse" />
      )}
      {caption && (
        <p className="text-xs text-warm-gray mt-2 text-center">{caption}</p>
      )}
    </div>
  )
}
