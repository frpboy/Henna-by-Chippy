import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { getApprovedReviews } from '@/lib/sanity/queries'
import { thumbnailUrl } from '@/lib/sanity/image'
import type { Review, SanityImage } from '@/types'

export const metadata: Metadata = {
  title: 'Customer Reviews — Henna by Chippy',
  description:
    'Real reviews from customers across Kerala. See actual henna stain results and what people say about Henna by Chippy.',
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rating ? 'text-terracotta' : 'text-warm-gray'}>
          {n <= rating ? '★' : '☆'}
        </span>
      ))}
    </div>
  )
}

function ConeLabel({ coneUsed }: { coneUsed: string }) {
  const label =
    coneUsed === 'nail' ? 'Nail Cone' : coneUsed === 'skin' ? 'Skin Cone' : 'Both'
  return (
    <span className="bg-leaf-green/10 text-leaf-green text-xs px-2 py-0.5 rounded-full">
      {label}
    </span>
  )
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
  } catch {
    return ''
  }
}

function ReviewCard({ review }: { review: Review }) {
  const photos: (SanityImage & { alt?: string })[] = review.stainPhotos ?? []
  const displayPhotos = photos.slice(0, 3)

  return (
    <article className="bg-white rounded-2xl p-5 border border-henna-maroon/8 shadow-sm flex flex-col gap-3">
      {/* Rating + date row */}
      <div className="flex items-center justify-between">
        <StarDisplay rating={review.rating} />
        {review.submittedAt && (
          <span className="text-xs text-warm-gray">{formatDate(review.submittedAt)}</span>
        )}
      </div>

      {/* Name + location */}
      <div>
        <p className="font-semibold text-henna-maroon text-sm">{review.customerName}</p>
        {review.location && (
          <p className="flex items-center gap-1 text-warm-gray text-xs mt-0.5">
            <MapPin size={11} aria-hidden="true" />
            {review.location}
          </p>
        )}
      </div>

      {/* Review text */}
      {review.reviewText && (
        <p className="text-dark-earth/70 text-sm italic line-clamp-4 leading-relaxed">
          {review.reviewText}
        </p>
      )}

      {/* Photos */}
      {displayPhotos.length > 0 && (
        <div className="flex gap-2">
          {displayPhotos.map((photo, idx) => (
            <Image
              key={photo.asset._ref}
              src={thumbnailUrl(photo)}
              alt={photo.alt ?? `Stain photo ${idx + 1} by ${review.customerName}`}
              width={80}
              height={80}
              loading="lazy"
              className="rounded-xl object-cover w-20 h-20 border border-henna-maroon/8"
            />
          ))}
        </div>
      )}

      {/* Footer: cone badge + hours */}
      <div className="flex items-center gap-2 flex-wrap mt-auto">
        {review.coneUsed && <ConeLabel coneUsed={review.coneUsed} />}
        {review.hoursKept && (
          <span className="text-warm-gray text-xs">Kept on {review.hoursKept} hrs</span>
        )}
      </div>
    </article>
  )
}

function SkeletonCard() {
  return (
    <div
      className="animate-pulse bg-henna-maroon/5 rounded-2xl h-48"
      aria-hidden="true"
    />
  )
}

export default async function ReviewShowcasePage() {
  let reviews: Review[] = []
  try {
    reviews = await getApprovedReviews(0, 24)
  } catch {
    reviews = []
  }

  return (
    <main className="min-h-screen bg-ivory-bg pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-serif text-3xl text-henna-maroon mb-2">What customers say</h1>
          <p className="text-dark-earth/60 text-sm">
            Real results. Real people. From across Kerala.
          </p>
        </div>

        {reviews.length === 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <p className="text-center text-dark-earth/50 text-sm">
              Reviews will appear here once Chippy approves them.
            </p>
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-14 text-center">
          <p className="text-dark-earth/60 text-sm mb-4">Bought from Chippy?</p>
          <Link href="/review/submission" className="btn-primary">
            Share your experience
          </Link>
        </div>
      </div>
    </main>
  )
}
