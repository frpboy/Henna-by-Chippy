import { NextRequest, NextResponse } from 'next/server'
import type { FreshnessZone, PincodeZoneEntry } from '@/types'

// Districts that ship from Karuvarakundu, Malappuram — 1-2 day window
const SAFE_DISTRICTS = new Set([
  'malappuram', 'kozhikode', 'palakkad', 'thrissur', 'wayanad',
])

// Kerala districts with 2-3 day window
const CAUTION_DISTRICTS = new Set([
  'ernakulam', 'kottayam', 'alappuzha', 'idukki', 'kannur',
  'thiruvananthapuram', 'trivandrum', 'kollam', 'pathanamthitta', 'kasaragod',
])

// States that may breach the 3-day freshness window
const RISKY_STATES = new Set(['tamil nadu', 'karnataka', 'goa', 'andhra pradesh', 'telangana'])

// Very far states — almost certainly >3 days
const WARN_STATES = new Set([
  'maharashtra', 'delhi', 'gujarat', 'rajasthan', 'uttar pradesh', 'madhya pradesh',
  'west bengal', 'bihar', 'jharkhand', 'odisha', 'chhattisgarh', 'haryana', 'punjab',
  'himachal pradesh', 'uttarakhand', 'jammu and kashmir', 'assam', 'manipur', 'meghalaya',
  'mizoram', 'nagaland', 'tripura', 'arunachal pradesh', 'sikkim',
])

const DAYS: Record<FreshnessZone, string> = {
  safe: '1-2 days',
  caution: '2-3 days',
  risky: '3+ days',
  warn: '4+ days',
  unavailable: 'N/A',
}

function classify(district: string, state: string): FreshnessZone {
  const d = district.toLowerCase()
  const s = state.toLowerCase()

  if (s === 'kerala') {
    if (SAFE_DISTRICTS.has(d)) return 'safe'
    if (CAUTION_DISTRICTS.has(d)) return 'caution'
    // Any other Kerala district defaults to caution — still within state
    return 'caution'
  }

  if (RISKY_STATES.has(s)) return 'risky'
  if (WARN_STATES.has(s)) return 'warn'

  // Catch-all for Indian states not explicitly mapped
  return 'warn'
}

export async function GET(request: NextRequest) {
  const pin = request.nextUrl.searchParams.get('pin') ?? ''

  if (!/^\d{6}$/.test(pin)) {
    return NextResponse.json({ error: 'Invalid pincode' }, { status: 400 })
  }

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`, {
      next: { revalidate: 86400 }, // cache for 24h — pincode data is stable
    })

    if (!res.ok) throw new Error('API error')

    const data = await res.json() as Array<{
      Status: string
      PostOffice: Array<{ District: string; State: string; Country: string }>
    }>

    const result = data[0]

    if (result.Status !== 'Success' || !result.PostOffice?.length) {
      return NextResponse.json({ error: 'Pincode not found' }, { status: 404 })
    }

    const po = result.PostOffice[0]

    // India Post returns "India" in Country — guard against non-India (shouldn't happen but be safe)
    if (po.Country !== 'India') {
      const entry: PincodeZoneEntry = {
        district: po.District,
        state: po.State,
        zone: 'unavailable',
        estimatedDays: DAYS.unavailable,
      }
      return NextResponse.json(entry)
    }

    const zone = classify(po.District, po.State)
    const entry: PincodeZoneEntry = {
      district: po.District,
      state: po.State,
      zone,
      estimatedDays: DAYS[zone],
    }

    return NextResponse.json(entry)
  } catch {
    return NextResponse.json({ error: 'Lookup failed' }, { status: 502 })
  }
}
