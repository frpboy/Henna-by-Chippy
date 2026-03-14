import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getFeaturedBridalGallery } from '@/lib/sanity/queries'
import { thumbnailUrl, lqipUrl } from '@/lib/sanity/image'

export const metadata: Metadata = {
  title: 'Bridal Henna Portfolio',
  description:
    'Bridal henna designs from Malappuram, Kerala. Book Chippy for your wedding or special occasion. Traditional and modern patterns.',
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '917561856754'
const BOOKING_MSG = encodeURIComponent(
  "Hi Chippy! I'd like to book a bridal henna session. Can you share availability and pricing?",
)

// Static gallery — replaced by Sanity data once projectId is configured
const STATIC_GALLERY = [
  { src: '/images/bridal-1.webp', alt: 'Full bridal henna on both hands with gold bangles and pink embroidered dress' },
  { src: '/images/bridal-2.jpg', alt: 'Bold dark bridal henna design signed by Chippy' },
  { src: '/images/bridal-3.jpg', alt: 'Bridal henna on folded hands with maroon outfit and silver jewellery' },
  { src: '/images/bridal-4.jpg', alt: 'Delicate bridal henna with pink saree and gold accessories' },
  { src: '/images/bridal-5.jpg', alt: 'Skin henna design against green tropical leaves' },
  { src: '/images/stain-skin-1.jpg', alt: 'Elegant skin henna with floral motifs and diamond ring' },
  { src: '/images/stain-floral-1.jpg', alt: 'Artistic henna floral design in deep maroon' },
  { src: '/images/stain-nail-1.jpg', alt: 'Nail cone henna applied on fingertips' },
]

export default async function BridalPage() {
  const sanityGallery = await getFeaturedBridalGallery()
  const hasSanityData = sanityGallery.length > 0

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="relative overflow-hidden" aria-label="Bridal hero">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bridal-1.webp"
            alt="Bridal henna — full hand design with gold bangles"
            fill
            className="object-cover object-top"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-ivory-bg/65" />
        </div>
        <div className="relative z-10 section-container text-center">
          <h1
            className="font-serif text-henna-maroon mb-4"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
          >
            Bridal Henna
          </h1>
          <p className="text-dark-earth/75 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Traditional and modern bridal henna designs for your wedding day. Based in Malappuram,
            serving across the district.
          </p>
          <a
            id="booking"
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${BOOKING_MSG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp text-base"
          >
            Book a Session
          </a>
        </div>
      </section>

      {/* Gallery */}
      <section className="section-container" aria-labelledby="gallery-heading">
        <h2
          id="gallery-heading"
          className="font-serif text-henna-maroon text-center mb-8"
          style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}
        >
          Portfolio
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {hasSanityData
            ? sanityGallery.map((item) => {
                const imgUrl = item.image ? thumbnailUrl(item.image) : null
                const blur = item.image ? lqipUrl(item.image) : undefined
                return (
                  <div key={item._id} className="relative aspect-square rounded-lg overflow-hidden">
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={item.image?.alt ?? item.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        placeholder={blur ? 'blur' : 'empty'}
                        blurDataURL={blur}
                      />
                    ) : (
                      <div className="w-full h-full bg-light-sage flex items-center justify-center">
                        <span className="text-4xl">🌿</span>
                      </div>
                    )}
                  </div>
                )
              })
            : STATIC_GALLERY.map((photo) => (
                <div key={photo.src} className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              ))}
        </div>
      </section>

      {/* Booking info */}
      <section id="booking-info" className="organic-bg" aria-label="Booking information">
        <div className="organic-blob organic-blob-1" aria-hidden="true" />
        <div className="organic-blob organic-blob-2" aria-hidden="true" />
        <div className="section-container relative z-10">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-serif text-henna-maroon text-2xl mb-4">Book a Session</h2>
          <p className="text-dark-earth/70 text-sm mb-6 leading-relaxed">
            Reach out on WhatsApp to check availability, pricing, and design options for your
            wedding or special event.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${BOOKING_MSG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
          >
            Message Chippy on WhatsApp
          </a>
          <p className="text-xs text-warm-gray mt-4">
            Based in Karuvarakundu, Malappuram District, Kerala.
          </p>
        </div>
        </div>
      </section>
    </div>
  )
}
