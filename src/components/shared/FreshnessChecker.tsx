'use client'

import { useState } from 'react'
import type { FreshnessZone, PincodeZoneEntry } from '@/types'

// Static pincode prefix lookup — authoritative source
// Full file: src/lib/pincode-zones.json
const ZONE_MESSAGES: Record<FreshnessZone, { label: string; detail: string; className: string }> =
  {
    safe: {
      label: 'Safe to order',
      detail: 'Estimated delivery 1-2 days. Your henna will arrive fresh.',
      className: 'zone-safe',
    },
    caution: {
      label: 'Caution',
      detail:
        'Estimated delivery 2-3 days. Order is fine but store in freezer the moment it arrives.',
      className: 'zone-caution',
    },
    risky: {
      label: 'Risky',
      detail:
        'Delivery may take 3+ days. There is a risk of spoilage. Chippy will confirm before dispatch.',
      className: 'zone-risky',
    },
    warn: {
      label: 'Not recommended',
      detail:
        'This location is very far from Kerala. Delivery very likely exceeds 3 days and the product may spoil. Please contact Chippy on WhatsApp before ordering.',
      className: 'zone-risky',
    },
    unavailable: {
      label: 'Not available',
      detail: 'Henna by Chippy only ships within India.',
      className: 'zone-risky',
    },
  }

async function lookupPincode(pincode: string): Promise<PincodeZoneEntry | null> {
  try {
    const raw = (await import('@/lib/pincode-zones.json')).default
    const zones = raw as unknown as Record<string, PincodeZoneEntry>
    // Try full pincode first, then 3-digit prefix
    return zones[pincode] ?? zones[pincode.slice(0, 3)] ?? null
  } catch {
    return null
  }
}

export default function FreshnessChecker() {
  const [pincode, setPincode] = useState('')
  const [result, setResult] = useState<PincodeZoneEntry | null | 'unknown'>(null)
  const [loading, setLoading] = useState(false)

  const handleCheck = async () => {
    if (!/^\d{6}$/.test(pincode)) return
    setLoading(true)
    const entry = await lookupPincode(pincode)
    setResult(entry ?? 'unknown')
    setLoading(false)
  }

  const zoneInfo = result && result !== 'unknown' ? ZONE_MESSAGES[result.zone] : null

  return (
    <div className="max-w-sm">
      <label htmlFor="pincode-input" className="block text-sm font-semibold text-henna-maroon mb-2">
        Check delivery freshness
      </label>
      <div className="flex gap-2">
        <input
          id="pincode-input"
          type="text"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter your pincode"
          className="flex-1 border border-henna-maroon/20 rounded-full px-4 py-2 text-sm bg-warm-white focus:outline-none focus:ring-2 focus:ring-leaf-green"
          aria-label="Enter your 6-digit pincode"
        />
        <button
          onClick={handleCheck}
          disabled={pincode.length !== 6 || loading}
          className="btn-primary py-2 px-5 text-sm disabled:opacity-50"
        >
          {loading ? '...' : 'Check'}
        </button>
      </div>

      {result && (
        <div
          className={`mt-3 p-3 rounded-lg text-sm ${
            result === 'unknown'
              ? 'bg-warm-white border border-henna-maroon/15 text-warm-gray'
              : zoneInfo?.className
          }`}
          role="status"
          aria-live="polite"
        >
          {result === 'unknown' ? (
            <p>Pincode not found. Contact Chippy on WhatsApp to check delivery availability.</p>
          ) : (
            <>
              <p className="font-semibold">{zoneInfo?.label}</p>
              <p className="mt-0.5 opacity-90">{zoneInfo?.detail}</p>
              <p className="mt-1 text-xs opacity-75">
                {result.district}, {result.state} — Est. {result.estimatedDays}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
