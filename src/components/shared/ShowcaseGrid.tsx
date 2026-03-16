'use client'

import { useState } from 'react'
import Image from 'next/image'
import InstagramEmbed from '@/components/ui/InstagramEmbed'
import { useLightbox } from '@/components/ui/Lightbox'
import { thumbnailUrl, fullSizeUrl } from '@/lib/sanity/image'
import type { ShowcaseItem } from '@/lib/sanity/queries'

const PAGE_SIZE = 12

interface StaticPhoto {
  src: string
  alt: string
}

interface Props {
  items: ShowcaseItem[]
  staticFallback: StaticPhoto[]
}

export default function ShowcaseGrid({ items, staticFallback }: Props) {
  const [visible, setVisible] = useState(PAGE_SIZE)

  // Build the lightbox image list from image-type items (not social posts)
  const lightboxImages = items
    .filter((item) => item.image && item.sourceType !== 'social_post')
    .map((item) => ({
      src: fullSizeUrl(item.image!),
      alt: item.image!.alt ?? item.caption ?? 'Henna stain result',
    }))

  const { open: openLightbox, lightbox } = useLightbox(lightboxImages)

  // Map item _id to lightbox index (only image items)
  const lightboxIndexMap = new Map<string, number>()
  let li = 0
  for (const item of items) {
    if (item.image && item.sourceType !== 'social_post') {
      lightboxIndexMap.set(item._id, li++)
    }
  }

  // Use Sanity items if available, else static fallback
  if (items.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
        {staticFallback.map((photo) => (
          <div key={photo.src} className="relative aspect-square rounded-xl overflow-hidden shadow-sm">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    )
  }

  const shown = items.slice(0, visible)
  const hasMore = visible < items.length

  return (
    <>
      {lightbox}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
        {shown.map((item) =>
          item.sourceType === 'social_post' && item.socialPostUrl ? (
            <div key={item._id} className="col-span-1">
              <InstagramEmbed url={item.socialPostUrl} caption={item.caption} />
            </div>
          ) : item.image ? (
            <button
              key={item._id}
              onClick={() => {
                const idx = lightboxIndexMap.get(item._id)
                if (idx !== undefined) openLightbox(idx)
              }}
              className="relative aspect-square rounded-xl overflow-hidden shadow-sm group text-left"
              aria-label={`View: ${item.image.alt ?? item.caption ?? 'Henna stain result'}`}
            >
              <Image
                src={thumbnailUrl(item.image)}
                alt={item.image.alt ?? item.caption ?? 'Henna stain result'}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              {/* Zoom hint on hover */}
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-dark-earth/30">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
                  <path d="M16.5 16.5 L21 21" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M8 11 H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M11 8 V14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              {item.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-dark-earth/55 text-ivory-bg text-xs px-2 py-1.5 text-center">
                  {item.caption}
                </div>
              )}
            </button>
          ) : null,
        )}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-henna-maroon border border-henna-maroon/30 hover:bg-henna-maroon/5 transition-colors"
          >
            Load more ({items.length - visible} remaining)
          </button>
        </div>
      )}
    </>
  )
}
