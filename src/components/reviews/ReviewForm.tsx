'use client'

import { useState } from 'react'

type FormState = {
  customerName: string
  location: string
  rating: number
  reviewText: string
  coneUsed: 'nail' | 'skin' | 'both'
  hoursKept: string
  allowAiUsage: boolean
}

const initialState: FormState = {
  customerName: '',
  location: '',
  rating: 0,
  reviewText: '',
  coneUsed: 'nail',
  hoursKept: '',
  allowAiUsage: false,
}

export default function ReviewForm() {
  const [form, setForm] = useState<FormState>(initialState)
  const [hoverRating, setHoverRating] = useState(0)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setForm((prev) => ({ ...prev, [name]: checked }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.customerName.trim()) {
      setErrorMessage('Please enter your name.')
      return
    }
    if (form.rating === 0) {
      setErrorMessage('Please select a star rating.')
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.customerName.trim(),
          location: form.location.trim() || undefined,
          rating: form.rating,
          reviewText: form.reviewText.trim() || undefined,
          coneUsed: form.coneUsed,
          hoursKept: form.hoursKept ? Number(form.hoursKept) : undefined,
          allowAiUsage: form.allowAiUsage,
        }),
      })

      if (res.ok) {
        setStatus('success')
        setForm(initialState)
        setHoverRating(0)
      } else {
        const data = (await res.json()) as { error?: string }
        setErrorMessage(data.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
      }
    } catch {
      setErrorMessage('Network error. Please check your connection and try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-leaf-green/10 border border-leaf-green/30 rounded-2xl p-8 text-center">
        <p className="text-leaf-green font-semibold text-lg mb-2">Thank you!</p>
        <p className="text-dark-earth/70 text-sm">
          Your review is pending approval. Chippy will review it shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Name */}
      <div>
        <label
          htmlFor="customerName"
          className="block text-sm font-semibold text-henna-maroon mb-1.5"
        >
          Your Name <span aria-hidden="true">*</span>
        </label>
        <input
          id="customerName"
          name="customerName"
          type="text"
          value={form.customerName}
          onChange={handleChange}
          required
          className="w-full border border-warm-gray/40 rounded-xl px-4 py-2.5 text-sm text-dark-earth bg-ivory-bg focus:outline-none focus:ring-2 focus:ring-leaf-green/40"
          placeholder="e.g. Ayisha"
        />
      </div>

      {/* Location */}
      <div>
        <label
          htmlFor="location"
          className="block text-sm font-semibold text-henna-maroon mb-1.5"
        >
          Location <span className="text-warm-gray font-normal">(optional)</span>
        </label>
        <input
          id="location"
          name="location"
          type="text"
          value={form.location}
          onChange={handleChange}
          className="w-full border border-warm-gray/40 rounded-xl px-4 py-2.5 text-sm text-dark-earth bg-ivory-bg focus:outline-none focus:ring-2 focus:ring-leaf-green/40"
          placeholder="e.g. Kozhikode"
        />
      </div>

      {/* Star Rating */}
      <div>
        <p className="block text-sm font-semibold text-henna-maroon mb-1.5">
          Rating <span aria-hidden="true">*</span>
        </p>
        <div className="flex gap-1" role="radiogroup" aria-label="Star rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={form.rating === star}
              aria-label={`${star} star${star !== 1 ? 's' : ''}`}
              onClick={() => setForm((prev) => ({ ...prev, rating: star }))}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-3xl leading-none transition-colors focus:outline-none"
              style={{
                color:
                  star <= (hoverRating || form.rating) ? '#5d2906' : '#d4a373',
              }}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Review Text */}
      <div>
        <label
          htmlFor="reviewText"
          className="block text-sm font-semibold text-henna-maroon mb-1.5"
        >
          Your Review
        </label>
        <textarea
          id="reviewText"
          name="reviewText"
          value={form.reviewText}
          onChange={handleChange}
          maxLength={2000}
          rows={4}
          className="w-full border border-warm-gray/40 rounded-xl px-4 py-2.5 text-sm text-dark-earth bg-ivory-bg focus:outline-none focus:ring-2 focus:ring-leaf-green/40 resize-none"
          placeholder="Tell us about your stain result, how long you kept it on, and anything else."
        />
        <p className="text-right text-xs text-warm-gray mt-1">{form.reviewText.length}/2000</p>
      </div>

      {/* Cone Used */}
      <div>
        <p className="block text-sm font-semibold text-henna-maroon mb-2">Cone Used</p>
        <div className="flex gap-4 flex-wrap">
          {(['nail', 'skin', 'both'] as const).map((value) => (
            <label key={value} className="flex items-center gap-2 text-sm text-dark-earth cursor-pointer">
              <input
                type="radio"
                name="coneUsed"
                value={value}
                checked={form.coneUsed === value}
                onChange={() => setForm((prev) => ({ ...prev, coneUsed: value }))}
                className="accent-leaf-green"
              />
              {value === 'nail' ? 'Nail Cone' : value === 'skin' ? 'Skin Cone' : 'Both'}
            </label>
          ))}
        </div>
      </div>

      {/* Hours Kept */}
      <div>
        <label
          htmlFor="hoursKept"
          className="block text-sm font-semibold text-henna-maroon mb-1.5"
        >
          Hours Kept On <span className="text-warm-gray font-normal">(optional)</span>
        </label>
        <input
          id="hoursKept"
          name="hoursKept"
          type="number"
          min={1}
          max={24}
          value={form.hoursKept}
          onChange={handleChange}
          className="w-28 border border-warm-gray/40 rounded-xl px-4 py-2.5 text-sm text-dark-earth bg-ivory-bg focus:outline-none focus:ring-2 focus:ring-leaf-green/40"
          placeholder="e.g. 10"
        />
      </div>

      {/* AI Usage Consent */}
      <div className="flex items-start gap-3">
        <input
          id="allowAiUsage"
          name="allowAiUsage"
          type="checkbox"
          checked={form.allowAiUsage}
          onChange={handleChange}
          className="mt-0.5 accent-leaf-green flex-shrink-0"
        />
        <label htmlFor="allowAiUsage" className="text-xs text-dark-earth/70 leading-relaxed">
          I consent to Chippy sharing my photo with the AI assistant to help other customers see
          real stain results. Your name will not be shared without permission.
        </label>
      </div>

      {/* Error message */}
      {(status === 'error' || errorMessage) && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {errorMessage}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn-primary w-full sm:w-auto px-8 py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}
