'use client'

import { useState } from 'react'
import { MapPin, Hash } from 'lucide-react'
import type { FreshnessZone, PincodeZoneEntry } from '@/types'

const ZONE_MESSAGES: Record<FreshnessZone, { label: string; detail: string; className: string }> = {
  safe: {
    label: 'Safe to order',
    detail: 'Estimated delivery 1-2 days. Your henna will arrive fresh.',
    className: 'zone-safe',
  },
  caution: {
    label: 'Caution',
    detail: 'Estimated delivery 2-3 days. Order is fine but store in freezer the moment it arrives.',
    className: 'zone-caution',
  },
  risky: {
    label: 'Risky',
    detail: 'Delivery may take 3+ days. There is a risk of spoilage. Chippy will confirm before dispatch.',
    className: 'zone-risky',
  },
  warn: {
    label: 'Not recommended',
    detail: 'This location is very far from Kerala. Delivery very likely exceeds 3 days and the product may spoil. Please contact Chippy on WhatsApp before ordering.',
    className: 'zone-risky',
  },
  unavailable: {
    label: 'Not available',
    detail: 'Henna by Chippy only ships within India.',
    className: 'zone-risky',
  },
}

type Mode = 'pincode' | 'gps'
type GpsState = 'idle' | 'requesting' | 'denied' | 'error'

export default function FreshnessChecker() {
  const [mode, setMode] = useState<Mode>('pincode')
  const [pincode, setPincode] = useState('')
  const [result, setResult] = useState<PincodeZoneEntry | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [gpsState, setGpsState] = useState<GpsState>('idle')

  const reset = () => { setResult(null); setError(null); setGpsState('idle') }

  const classify = async (url: string) => {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await fetch(url)
      const body = await res.json() as PincodeZoneEntry & { error?: string }
      if (!res.ok) throw new Error(body.error ?? 'Lookup failed')
      setResult(body)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lookup failed')
    } finally {
      setLoading(false)
    }
  }

  const handlePincodeCheck = () => {
    if (!/^\d{6}$/.test(pincode)) return
    void classify(`/api/pincode?pin=${pincode}`)
  }

  const handleGps = () => {
    if (!navigator.geolocation) {
      setError('Your browser does not support location access.')
      return
    }
    setGpsState('requesting')
    setResult(null)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsState('idle')
        void classify(`/api/pincode?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
      },
      (err) => {
        if (err.code === 1) {
          setGpsState('denied')
        } else {
          setGpsState('error')
          setError('Could not get your location. Try entering your pincode instead.')
        }
        setLoading(false)
      },
      { timeout: 10000, maximumAge: 300000 }
    )
  }

  const zoneInfo = result ? ZONE_MESSAGES[result.zone] : null

  return (
    <div className="max-w-sm">
      {/* Mode tabs */}
      <div className="flex gap-1 mb-4 p-1 bg-henna-maroon/5 rounded-full w-fit">
        <button
          onClick={() => { setMode('pincode'); reset() }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            mode === 'pincode'
              ? 'bg-white text-henna-maroon shadow-sm'
              : 'text-warm-gray hover:text-henna-maroon'
          }`}
        >
          <Hash size={14} strokeWidth={2} aria-hidden="true" />
          Pincode
        </button>
        <button
          onClick={() => { setMode('gps'); reset() }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            mode === 'gps'
              ? 'bg-white text-henna-maroon shadow-sm'
              : 'text-warm-gray hover:text-henna-maroon'
          }`}
        >
          <MapPin size={14} strokeWidth={2} aria-hidden="true" />
          My location
        </button>
      </div>

      {/* Pincode mode */}
      {mode === 'pincode' && (
        <>
          <label htmlFor="pincode-input" className="block text-sm font-semibold text-henna-maroon mb-2">
            Enter your 6-digit pincode
          </label>
          <div className="flex gap-2">
            <input
              id="pincode-input"
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              value={pincode}
              onChange={(e) => { setPincode(e.target.value.replace(/\D/g, '')); reset() }}
              onKeyDown={(e) => e.key === 'Enter' && pincode.length === 6 && handlePincodeCheck()}
              placeholder="e.g. 676101"
              className="flex-1 border border-henna-maroon/20 rounded-full px-4 py-2 text-sm bg-warm-white focus:outline-none focus:ring-2 focus:ring-leaf-green"
              aria-label="Enter your 6-digit pincode"
            />
            <button
              onClick={handlePincodeCheck}
              disabled={pincode.length !== 6 || loading}
              className="btn-primary py-2 px-5 text-sm disabled:opacity-50"
            >
              {loading ? '...' : 'Check'}
            </button>
          </div>
        </>
      )}

      {/* GPS mode */}
      {mode === 'gps' && (
        <div>
          {gpsState === 'denied' ? (
            <div className="p-3 rounded-lg text-sm bg-warm-white border border-henna-maroon/15 text-warm-gray">
              <p className="font-medium text-henna-maroon mb-1">Location access denied</p>
              <p>Please allow location access in your browser settings, or switch to pincode mode.</p>
            </div>
          ) : (
            <button
              onClick={handleGps}
              disabled={loading || gpsState === 'requesting'}
              className="btn-primary flex items-center gap-2 py-2 px-5 text-sm disabled:opacity-50"
            >
              <MapPin size={15} strokeWidth={2} aria-hidden="true" />
              {gpsState === 'requesting' || loading ? 'Detecting...' : 'Detect my location'}
            </button>
          )}
          <p className="mt-2 text-xs text-warm-gray">
            Your coordinates are used only to check delivery freshness and are not stored
            with any personal identifier.{' '}
            <a href="/privacy#location" className="underline hover:text-henna-maroon">
              Learn more
            </a>
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="mt-3 p-3 rounded-lg text-sm bg-warm-white border border-henna-maroon/15 text-warm-gray"
          role="alert"
          aria-live="polite"
        >
          <p>{error}</p>
        </div>
      )}

      {/* Result */}
      {result && zoneInfo && (
        <div
          className={`mt-3 p-3 rounded-lg text-sm ${zoneInfo.className}`}
          role="status"
          aria-live="polite"
        >
          <p className="font-semibold">{zoneInfo.label}</p>
          <p className="mt-0.5 opacity-90">{zoneInfo.detail}</p>
          <p className="mt-1 text-xs opacity-75">
            {result.district} / {result.state} — Est. {result.estimatedDays}
          </p>
        </div>
      )}
    </div>
  )
}
