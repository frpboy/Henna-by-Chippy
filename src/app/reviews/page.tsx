import type { Metadata } from 'next'
import Image from 'next/image'
import { getApprovedReviews } from '@/lib/sanity/queries'
import { thumbnailUrl, lqipUrl } from '@/lib/sanity/image'
import ReviewForm from '@/components/reviews/ReviewForm'

export const metadata: Metadata = {
  title: 'Customer Reviews — Henna by Chippy',
  description:
    'Read real customer reviews for Henna by Chippy henna cones. See stain results, ratings, and share your own experience.',
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} out of 5 stars`} role="img">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{ color: star <= rating ? '#5d2906' : '#d4a373' }}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </span>
  )
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews(0, 20)

  return (
    <div className="section-container pt-28">
      <h1
        className="font-serif text-henna-maroon text-center mb-2"
        style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
      >
        Customer Reviews
      </h1>
      <p className="text-center text-warm-gray text-sm mb-12">
        Real stain results from real customers.
      </p>

      {/* Reviews list */}
      <div className="max-w-3xl mx-auto space-y-8 mb-20">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-dark-earth/60 text-sm">
              No reviews yet. Be the first to leave a review below.
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <article
              key={review._id}
              className="bg-white/60 rounded-2xl p-6 shadow-card border border-warm-gray/20"
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div>
                  <p className="font-semibold text-henna-maroon text-sm">{review.customerName}</p>
                  {review.location && (
                    <p className="text-warm-gray text-xs mt-0.5">{review.location}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StarRating rating={review.rating} />
                  <p className="text-warm-gray text-xs">{formatDate(review.submittedAt)}</p>
                </div>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-3 mb-3">
                <span className="text-xs bg-ivory-bg border border-warm-gray/30 text-dark-earth/70 rounded-full px-3 py-1">
                  {review.coneUsed === 'nail'
                    ? 'Nail Cone'
                    : review.coneUsed === 'skin'
                      ? 'Skin Cone'
                      : 'Both Cones'}
                </span>
                {review.hoursKept && (
                  <span className="text-xs bg-ivory-bg border border-warm-gray/30 text-dark-earth/70 rounded-full px-3 py-1">
                    {review.hoursKept}h on skin
                  </span>
                )}
              </div>

              {/* Review text */}
              {review.reviewText && (
                <p className="text-dark-earth/75 text-sm leading-relaxed mb-4">
                  {review.reviewText}
                </p>
              )}

              {/* Stain photos */}
              {review.stainPhotos && review.stainPhotos.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {review.stainPhotos.map((photo, i) => {
                    const src = thumbnailUrl(photo)
                    const blur = lqipUrl(photo)
                    return (
                      <div
                        key={i}
                        className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"
                      >
                        <Image
                          src={src}
                          alt={photo.alt ?? `Stain photo ${i + 1} by ${review.customerName}`}
                          fill
                          sizes="80px"
                          className="object-cover"
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL={blur}
                        />
                      </div>
                    )
                  })}
                </div>
              )}
            </article>
          ))
        )}
      </div>

      {/* Submission form */}
      <div className="max-w-xl mx-auto">
        <h2
          className="font-serif text-henna-maroon mb-6"
          style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}
        >
          Share Your Experience
        </h2>
        <ReviewForm />
      </div>
    </div>
  )
}
