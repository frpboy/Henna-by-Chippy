'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'

type SocialLink = {
  id: string
  url: string
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

const SOCIAL_DOMAINS = ['instagram.com', 'facebook.com', 'fb.com']

function isValidSocialUrl(url: string): boolean {
  return SOCIAL_DOMAINS.some((d) => url.includes(d))
}

function StarRating({
  value,
  onChange,
}: {
  value: number
  onChange: (n: number) => void
}) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1" role="group" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          className="text-3xl leading-none cursor-pointer transition-transform hover:scale-110 focus:outline-none"
        >
          <span className={n <= (hovered || value) ? 'text-terracotta' : 'text-warm-gray'}>
            {n <= (hovered || value) ? '★' : '☆'}
          </span>
        </button>
      ))}
    </div>
  )
}

type PhotoPreview = {
  id: string
  file: File
  objectUrl: string
}

export default function ReviewForm() {
  const [customerName, setCustomerName] = useState('')
  const [location, setLocation] = useState('')
  const [rating, setRating] = useState(0)
  const [coneUsed, setConeUsed] = useState<'nail' | 'skin' | 'both' | ''>('')
  const [hoursKept, setHoursKept] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [photos, setPhotos] = useState<PhotoPreview[]>([])
  const [videoLink, setVideoLink] = useState('')
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [allowAiUsage, setAllowAiUsage] = useState(true)
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [photoError, setPhotoError] = useState('')
  const [socialErrors, setSocialErrors] = useState<Record<string, string>>({})

  const fileInputRef = useRef<HTMLInputElement>(null)

  const totalPhotoSize = photos.reduce((acc, p) => acc + p.file.size, 0)
  const MAX_TOTAL_BYTES = 200 * 1024 * 1024 // 200 MB

  const handlePhotoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPhotoError('')
      const incoming = Array.from(e.target.files ?? [])
      const combined = [...photos, ...incoming.map((f) => ({
        id: crypto.randomUUID(),
        file: f,
        objectUrl: URL.createObjectURL(f),
      }))]

      if (combined.length > 10) {
        setPhotoError('You can upload up to 10 photos.')
        return
      }

      const size = combined.reduce((acc, p) => acc + p.file.size, 0)
      if (size > MAX_TOTAL_BYTES) {
        setPhotoError('Total photo size must be under 200 MB.')
        return
      }

      setPhotos(combined)
      // Reset file input so same files can be re-added after removal
      if (fileInputRef.current) fileInputRef.current.value = ''
    },
    [photos, MAX_TOTAL_BYTES],
  )

  const removePhoto = useCallback((id: string) => {
    setPhotos((prev) => {
      const p = prev.find((x) => x.id === id)
      if (p) URL.revokeObjectURL(p.objectUrl)
      return prev.filter((x) => x.id !== id)
    })
  }, [])

  const addSocialLink = () => {
    if (socialLinks.length >= 5) return
    setSocialLinks((prev) => [...prev, { id: crypto.randomUUID(), url: '' }])
  }

  const updateSocialLink = (id: string, url: string) => {
    setSocialLinks((prev) => prev.map((l) => (l.id === id ? { ...l, url } : l)))
    setSocialErrors((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const removeSocialLink = (id: string) => {
    setSocialLinks((prev) => prev.filter((l) => l.id !== id))
    setSocialErrors((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const validateSocialLinks = (): boolean => {
    const errors: Record<string, string> = {}
    for (const link of socialLinks) {
      if (link.url.trim() && !isValidSocialUrl(link.url.trim())) {
        errors[link.id] = 'Only Instagram and Facebook links are allowed.'
      }
    }
    setSocialErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!customerName.trim()) {
      setErrorMessage('Please enter your name.')
      return
    }
    if (rating === 0) {
      setErrorMessage('Please select a star rating.')
      return
    }
    if (!coneUsed) {
      setErrorMessage('Please select which cone you used.')
      return
    }
    if (!validateSocialLinks()) return

    setFormState('submitting')

    const fd = new FormData()
    fd.append('customerName', customerName.trim())
    if (location.trim()) fd.append('location', location.trim())
    fd.append('rating', String(rating))
    fd.append('coneUsed', coneUsed)
    if (hoursKept) fd.append('hoursKept', hoursKept)
    if (reviewText.trim()) fd.append('reviewText', reviewText.trim())
    fd.append('allowAiUsage', String(allowAiUsage))
    if (videoLink.trim()) fd.append('videoLink', videoLink.trim())

    const validSocial = socialLinks
      .filter((l) => l.url.trim() && isValidSocialUrl(l.url.trim()))
      .map((l) => ({
        url: l.url.trim(),
        platform: l.url.includes('instagram.com') ? 'instagram' : 'facebook',
      }))
    fd.append('socialPostLinks', JSON.stringify(validSocial))

    for (const p of photos) {
      fd.append('photos', p.file)
    }

    try {
      const res = await fetch('/api/reviews', { method: 'POST', body: fd })
      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error ?? 'Submission failed.')
      }
      setFormState('success')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setFormState('error')
    }
  }

  const inputClass =
    'w-full border border-henna-maroon/20 rounded-xl px-4 py-2.5 text-sm bg-warm-white focus:outline-none focus:ring-2 focus:ring-leaf-green'

  if (formState === 'success') {
    return (
      <div className="min-h-screen bg-ivory-bg pt-24 pb-16 px-4">
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="text-5xl mb-6">🌿</div>
          <h2 className="font-serif text-2xl text-henna-maroon mb-4">Thank you!</h2>
          <p className="text-dark-earth/70 mb-2">
            Your review has been sent to Chippy. She personally reads every one.
          </p>
          <p className="text-dark-earth/70 mb-8">
            Once she approves it, it will appear on the site.
          </p>
          <Link href="/shop" className="btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory-bg pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-10">
          <h1 className="font-serif text-3xl text-henna-maroon mb-2">Share your experience</h1>
          <p className="text-dark-earth/60 text-sm">Tell Chippy how your henna turned out.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7" noValidate>
          {/* Customer name */}
          <div>
            <label className="block font-serif text-henna-maroon text-sm mb-1.5" htmlFor="customerName">
              Your name <span className="text-terracotta">*</span>
            </label>
            <input
              id="customerName"
              type="text"
              className={inputClass}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Fathima"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block font-serif text-henna-maroon text-sm mb-1.5" htmlFor="location">
              Location <span className="text-warm-gray text-xs">(optional)</span>
            </label>
            <input
              id="location"
              type="text"
              className={inputClass}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Kozhikode, Malappuram"
            />
          </div>

          {/* Star rating */}
          <div>
            <p className="font-serif text-henna-maroon text-sm mb-2">
              Rating <span className="text-terracotta">*</span>
            </p>
            <StarRating value={rating} onChange={setRating} />
          </div>

          {/* Cone used */}
          <div>
            <p className="font-serif text-henna-maroon text-sm mb-2">
              Cone used <span className="text-terracotta">*</span>
            </p>
            <div className="flex gap-5">
              {(['nail', 'skin', 'both'] as const).map((v) => (
                <label key={v} className="flex items-center gap-2 cursor-pointer text-sm text-dark-earth">
                  <input
                    type="radio"
                    name="coneUsed"
                    value={v}
                    checked={coneUsed === v}
                    onChange={() => setConeUsed(v)}
                    className="accent-leaf-green"
                  />
                  {v === 'nail' ? 'Nail Cone' : v === 'skin' ? 'Skin Cone' : 'Both'}
                </label>
              ))}
            </div>
          </div>

          {/* Hours kept */}
          <div>
            <label className="block font-serif text-henna-maroon text-sm mb-1.5" htmlFor="hoursKept">
              Hours kept on <span className="text-warm-gray text-xs">(optional)</span>
            </label>
            <input
              id="hoursKept"
              type="number"
              min={1}
              max={24}
              className={inputClass}
              value={hoursKept}
              onChange={(e) => setHoursKept(e.target.value)}
              placeholder="e.g. 10"
            />
          </div>

          {/* Review text */}
          <div>
            <label className="block font-serif text-henna-maroon text-sm mb-1.5" htmlFor="reviewText">
              Your review <span className="text-warm-gray text-xs">(optional)</span>
            </label>
            <textarea
              id="reviewText"
              className={`${inputClass} resize-none`}
              rows={4}
              maxLength={2000}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="How did the stain turn out? Would you recommend it?"
            />
            <p className="text-xs text-warm-gray text-right mt-1">
              {reviewText.length} / 2000
            </p>
          </div>

          {/* Stain photos */}
          <div>
            <p className="font-serif text-henna-maroon text-sm mb-2">
              Stain photos <span className="text-warm-gray text-xs">(optional, up to 10 photos, 200 MB total)</span>
            </p>

            {photos.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3">
                {photos.map((p) => (
                  <div key={p.id} className="relative w-20 h-20 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.objectUrl}
                      alt="Stain photo preview"
                      className="w-20 h-20 object-cover rounded-xl border border-henna-maroon/10"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(p.id)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-henna-maroon text-warm-white text-xs leading-none flex items-center justify-center hover:bg-dark-earth transition-colors"
                      aria-label="Remove photo"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-sm border border-henna-maroon/30 rounded-xl text-henna-maroon hover:bg-henna-maroon/5 transition-colors"
              >
                {photos.length === 0 ? 'Choose photos' : 'Add more'}
              </button>
              {photos.length > 0 && (
                <span className="text-xs text-warm-gray">
                  {photos.length} photo{photos.length > 1 ? 's' : ''},{' '}
                  {(totalPhotoSize / (1024 * 1024)).toFixed(1)} MB total
                </span>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotoChange}
              aria-label="Upload stain photos"
            />

            {photoError && (
              <p className="mt-2 text-xs text-terracotta">{photoError}</p>
            )}
          </div>

          {/* External video link */}
          <div>
            <label className="block font-serif text-henna-maroon text-sm mb-1.5" htmlFor="videoLink">
              Video link <span className="text-warm-gray text-xs">(optional)</span>
            </label>
            <input
              id="videoLink"
              type="url"
              className={inputClass}
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              placeholder="Instagram Reel, YouTube, TikTok link"
            />
          </div>

          {/* Social post links */}
          <div>
            <p className="font-serif text-henna-maroon text-sm mb-2">
              Social post links{' '}
              <span className="text-warm-gray text-xs">(optional, Instagram or Facebook only, up to 5)</span>
            </p>

            {socialLinks.map((link) => (
              <div key={link.id} className="flex items-center gap-2 mb-2">
                <input
                  type="url"
                  className={`${inputClass} flex-1`}
                  value={link.url}
                  onChange={(e) => updateSocialLink(link.id, e.target.value)}
                  placeholder="https://www.instagram.com/p/..."
                />
                <button
                  type="button"
                  onClick={() => removeSocialLink(link.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-henna-maroon/20 text-henna-maroon hover:bg-henna-maroon/5 transition-colors flex-shrink-0"
                  aria-label="Remove link"
                >
                  ×
                </button>
              </div>
            ))}
            {socialLinks.map((link) =>
              socialErrors[link.id] ? (
                <p key={`err-${link.id}`} className="text-xs text-terracotta mb-1">
                  {socialErrors[link.id]}
                </p>
              ) : null,
            )}

            {socialLinks.length < 5 && (
              <button
                type="button"
                onClick={addSocialLink}
                className="mt-1 text-sm text-leaf-green hover:underline"
              >
                + Add a post link
              </button>
            )}
          </div>

          {/* AI consent */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={allowAiUsage}
              onChange={(e) => setAllowAiUsage(e.target.checked)}
              className="mt-0.5 accent-leaf-green w-4 h-4 flex-shrink-0"
            />
            <span className="text-sm text-dark-earth/70 leading-relaxed">
              Chippy&apos;s AI assistant can use my photos as stain examples for other customers.
            </span>
          </label>

          {/* Error message */}
          {(formState === 'error' || errorMessage) && (
            <p className="text-sm text-terracotta bg-terracotta/10 rounded-xl px-4 py-3">
              {errorMessage || 'Something went wrong. Please try again.'}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={formState === 'submitting'}
            className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {formState === 'submitting' ? 'Sending...' : 'Send review to Chippy'}
          </button>
        </form>
      </div>
    </div>
  )
}
