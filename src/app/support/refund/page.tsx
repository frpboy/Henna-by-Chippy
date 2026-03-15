'use client'

import { useState } from 'react'
import Link from 'next/link'
import StorageWarningBanner from '@/components/shared/StorageWarningBanner'

type IssueType = 'damaged_arrival' | 'wrong_item' | 'missing_item' | 'other'

export default function RefundFormPage() {
  const [issueType, setIssueType] = useState<IssueType | ''>('')
  const [product, setProduct] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoError, setVideoError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setVideoError('')
    if (file && file.size > 100 * 1024 * 1024) {
      setVideoError('Video must be under 100MB.')
      setVideoFile(null)
      return
    }
    setVideoFile(file)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!videoFile) {
      setVideoError('Unboxing video is required for all claims.')
      return
    }

    setSubmitting(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    if (videoFile) formData.set('unboxingVideo', videoFile)

    try {
      const res = await fetch('/api/refund', { method: 'POST', body: formData })
      if (!res.ok) {
        const data = await res.json() as { error?: string }
        setError(data.error ?? 'Something went wrong. Please try WhatsApp instead.')
      } else {
        setSuccess(true)
      }
    } catch {
      setError('Could not submit. Please message Chippy on WhatsApp directly.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="section-container pt-28 max-w-xl text-center">
        <div className="text-5xl mb-4">🌿</div>
        <h1 className="font-serif text-henna-maroon text-2xl mb-3">Request Submitted</h1>
        <p className="text-dark-earth/70 mb-6">
          Chippy will review your request and get back to you on WhatsApp within 24 hours.
        </p>
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <>
      <StorageWarningBanner />
      <div className="section-container pt-24 max-w-xl">
        <h1
          className="font-serif text-henna-maroon mb-2"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)' }}
        >
          Refund or Replacement Request
        </h1>

        {/* Policy notices */}
        <div
          style={{
            background: '#fef3cd',
            border: '1px solid #f5c842',
            borderRadius: 10,
            padding: '12px 16px',
            marginBottom: 12,
            fontSize: '0.82rem',
            color: '#7a5c00',
          }}
        >
          <strong>No Cancellations:</strong> Orders cannot be cancelled once placed. All sales are final.
        </div>
        <div
          style={{
            background: '#fef3cd',
            border: '1px solid #f5c842',
            borderRadius: 10,
            padding: '12px 16px',
            marginBottom: 12,
            fontSize: '0.82rem',
            color: '#7a5c00',
          }}
        >
          <strong>Prepaid Orders Only:</strong> We accept prepaid orders only. Payment is collected before dispatch.
        </div>
        <div
          style={{
            background: '#fff0f0',
            border: '1px solid #f5c6c6',
            borderRadius: 10,
            padding: '12px 16px',
            marginBottom: 24,
            fontSize: '0.82rem',
            color: '#8b1a1a',
          }}
        >
          <strong>Unboxing video required for all claims.</strong> Record the video while opening the package without cutting. Claims without a video cannot be processed.
        </div>

        <p className="text-warm-gray text-sm mb-8">
          You can also message Chippy directly on{' '}
          <a href="https://wa.me/917561856754" target="_blank" rel="noopener noreferrer" className="underline text-leaf-green">
            WhatsApp
          </a>
          .
        </p>

        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          {/* Customer name */}
          <div>
            <label htmlFor="customerName" className="block text-sm font-semibold text-henna-maroon mb-1">
              Your Name *
            </label>
            <input
              id="customerName"
              name="customerName"
              type="text"
              required
              className="w-full border border-henna-maroon/20 rounded-xl px-4 py-2.5 text-sm bg-warm-white focus:outline-none focus:ring-2 focus:ring-leaf-green"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label htmlFor="whatsappNumber" className="block text-sm font-semibold text-henna-maroon mb-1">
              WhatsApp Number * <span className="text-warm-gray font-normal">(with country code, e.g. 919876543210)</span>
            </label>
            <input
              id="whatsappNumber"
              name="whatsappNumber"
              type="tel"
              required
              className="w-full border border-henna-maroon/20 rounded-xl px-4 py-2.5 text-sm bg-warm-white focus:outline-none focus:ring-2 focus:ring-leaf-green"
            />
          </div>

          {/* Order date */}
          <div>
            <label htmlFor="orderDate" className="block text-sm font-semibold text-henna-maroon mb-1">
              Approximate Order Date
            </label>
            <input
              id="orderDate"
              name="orderDate"
              type="date"
              className="w-full border border-henna-maroon/20 rounded-xl px-4 py-2.5 text-sm bg-warm-white focus:outline-none focus:ring-2 focus:ring-leaf-green"
            />
          </div>

          {/* Product */}
          <fieldset>
            <legend className="text-sm font-semibold text-henna-maroon mb-2">
              Product Ordered *
            </legend>
            <div className="space-y-2">
              {[
                { value: 'nail', label: 'Nail Cone (10-15g, Rs 35)' },
                { value: 'skin', label: 'Skin Cone (25-30g, Rs 45)' },
                { value: 'both', label: 'Both' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="productOrdered"
                    value={opt.value}
                    required
                    checked={product === opt.value}
                    onChange={() => setProduct(opt.value)}
                    className="accent-leaf-green"
                  />
                  <span className="text-sm text-dark-earth">{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Issue type */}
          <fieldset>
            <legend className="text-sm font-semibold text-henna-maroon mb-2">Issue Type *</legend>
            <div className="space-y-2">
              {[
                { value: 'damaged_arrival', label: 'Damaged on arrival' },
                { value: 'wrong_item', label: 'Wrong item sent' },
                { value: 'missing_item', label: 'Missing item' },
                { value: 'other', label: 'Other' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="issueType"
                    value={opt.value}
                    required
                    checked={issueType === opt.value}
                    onChange={() => setIssueType(opt.value as IssueType)}
                    className="accent-leaf-green"
                  />
                  <span className="text-sm text-dark-earth">{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Issue description */}
          <div>
            <label htmlFor="issueDescription" className="block text-sm font-semibold text-henna-maroon mb-1">
              Description <span className="text-warm-gray font-normal">(optional, max 500 characters)</span>
            </label>
            <textarea
              id="issueDescription"
              name="issueDescription"
              rows={4}
              maxLength={500}
              className="w-full border border-henna-maroon/20 rounded-xl px-4 py-2.5 text-sm bg-warm-white focus:outline-none focus:ring-2 focus:ring-leaf-green resize-none"
            />
          </div>

          {/* Unboxing video */}
          <div>
            <label
              htmlFor="unboxingVideo"
              className="block text-sm font-semibold text-henna-maroon mb-1"
            >
              Unboxing Video <span className="text-red-600">* Required</span>
            </label>
            <p className="text-xs text-warm-gray mb-2">
              Record while opening the package without cutting the video. Max 100MB. No video = no claim.
            </p>
            <input
              id="unboxingVideo"
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="text-sm text-dark-earth file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-light-sage file:text-henna-maroon hover:file:bg-leaf-green/10"
            />
            {videoError && <p className="text-red-600 text-xs mt-1">{videoError}</p>}
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl p-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full justify-center disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </>
  )
}
