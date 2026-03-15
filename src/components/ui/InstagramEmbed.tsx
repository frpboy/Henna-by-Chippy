'use client'

import { useState, useEffect, useRef } from 'react'

interface Props {
  url: string
  caption?: string
}

export default function InstagramEmbed({ url, caption }: Props) {
  const [inView, setInView] = useState(false)
  const [embedHtml, setEmbedHtml] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Trigger load when scrolled into view
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

  // Fetch oEmbed HTML once in view
  useEffect(() => {
    if (!inView) return
    fetch(`/api/oembed?url=${encodeURIComponent(url)}`)
      .then((r) => {
        if (!r.ok) throw new Error('oEmbed failed')
        return r.json() as Promise<{ html: string }>
      })
      .then((data) => setEmbedHtml(data.html))
      .catch(() => setFailed(true))
  }, [inView, url])

  // Trigger Instagram's embed.js after HTML is injected
  useEffect(() => {
    if (!embedHtml) return
    if (typeof window !== 'undefined' && window.instgrm) {
      window.instgrm.Embeds.process()
    } else {
      const script = document.createElement('script')
      script.src = 'https://www.instagram.com/embed.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [embedHtml])

  return (
    <div
      ref={ref}
      style={{ minHeight: 420, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {failed ? (
        // Fallback: just link to the post
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full h-full min-h-[200px] rounded-xl border border-henna-maroon/10 text-sm text-warm-gray hover:text-henna-maroon transition-colors"
        >
          View on Instagram
        </a>
      ) : embedHtml ? (
        <div
          dangerouslySetInnerHTML={{ __html: embedHtml }}
          className="w-full"
        />
      ) : (
        // Skeleton while loading
        <div className="w-full min-h-[420px] rounded-xl bg-henna-maroon/5 animate-pulse" />
      )}
      {caption && (
        <p className="text-xs text-warm-gray mt-2 text-center">{caption}</p>
      )}
    </div>
  )
}

// Extend window type for Instagram embed script
declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } }
  }
}
