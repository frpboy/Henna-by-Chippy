import { NextRequest, NextResponse } from 'next/server'
import type { FreshnessZone, PincodeZoneEntry } from '@/types'
import { sanityWriteClient } from '@/lib/sanity/client'

const SAFE_DISTRICTS = new Set([
  'malappuram', 'kozhikode', 'palakkad', 'thrissur', 'wayanad',
])
const CAUTION_DISTRICTS = new Set([
  'ernakulam', 'kottayam', 'alappuzha', 'idukki', 'kannur',
  'thiruvananthapuram', 'trivandrum', 'kollam', 'pathanamthitta', 'kasaragod',
])
const RISKY_STATES = new Set(['tamil nadu', 'karnataka', 'goa', 'andhra pradesh', 'telangana'])
const WARN_STATES = new Set([
  'maharashtra', 'delhi', 'gujarat', 'rajasthan', 'uttar pradesh', 'madhya pradesh',
  'west bengal', 'bihar', 'jharkhand', 'odisha', 'chhattisgarh', 'haryana', 'punjab',
  'himachal pradesh', 'uttarakhand', 'jammu and kashmir', 'assam', 'manipur', 'meghalaya',
  'mizoram', 'nagaland', 'tripura', 'arunachal pradesh', 'sikkim',
])

const DAYS: Record<FreshnessZone, string> = {
  safe: '1-2 days', caution: '2-3 days', risky: '3+ days', warn: '4+ days', unavailable: 'N/A',
}

function classify(district: string, state: string): FreshnessZone {
  const d = district.toLowerCase()
  const s = state.toLowerCase()
  if (s === 'kerala') {
    if (SAFE_DISTRICTS.has(d)) return 'safe'
    if (CAUTION_DISTRICTS.has(d)) return 'caution'
    return 'caution'
  }
  if (RISKY_STATES.has(s)) return 'risky'
  if (WARN_STATES.has(s)) return 'warn'
  return 'warn'
}

// Fire-and-forget: save the lookup for analytics (never blocks the response)
function saveLog(pincode: string, district: string, state: string, zone: FreshnessZone, method: 'typed' | 'gps') {
  const isSanityConfigured = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'placeholder' &&
    process.env.SANITY_API_TOKEN

  if (!isSanityConfigured) return

  void sanityWriteClient.create({
    _type: 'pincodeLog',
    pincode,
    district,
    state,
    zone,
    method,
    checkedAt: new Date().toISOString(),
  }).catch(() => { /* ignore — analytics must never fail the user */ })
}

// GPS: reverse geocode lat/lon via Nominatim → get postcode → classify
async function fromCoords(lat: string, lon: string): Promise<NextResponse> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'HennaByChippy/1.0 (henna-by-chippy.vercel.app)' },
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error('Geocode failed')

  const data = await res.json() as {
    address?: { postcode?: string; state_district?: string; county?: string; state?: string; country_code?: string }
  }

  const addr = data.address
  if (!addr || addr.country_code !== 'in') {
    return NextResponse.json({ error: 'Location outside India' }, { status: 422 })
  }

  const pincode = addr.postcode?.replace(/\s/g, '') ?? ''
  const district = addr.state_district ?? addr.county ?? ''
  const state = addr.state ?? ''

  if (!district || !state) {
    return NextResponse.json({ error: 'Could not determine location' }, { status: 422 })
  }

  const zone = classify(district, state)
  const entry: PincodeZoneEntry = { district, state, zone, estimatedDays: DAYS[zone] }

  saveLog(pincode || 'gps', district, state, zone, 'gps')
  return NextResponse.json(entry)
}

// Pincode: call India Post API → classify
async function fromPincode(pin: string): Promise<NextResponse> {
  const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`, {
    next: { revalidate: 86400 },
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
  if (po.Country !== 'India') {
    const entry: PincodeZoneEntry = { district: po.District, state: po.State, zone: 'unavailable', estimatedDays: DAYS.unavailable }
    return NextResponse.json(entry)
  }

  const zone = classify(po.District, po.State)
  const entry: PincodeZoneEntry = { district: po.District, state: po.State, zone, estimatedDays: DAYS[zone] }

  saveLog(pin, po.District, po.State, zone, 'typed')
  return NextResponse.json(entry)
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const pin = searchParams.get('pin')
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  try {
    if (lat && lon) {
      if (isNaN(Number(lat)) || isNaN(Number(lon))) {
        return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 })
      }
      return await fromCoords(lat, lon)
    }

    if (pin) {
      if (!/^\d{6}$/.test(pin)) {
        return NextResponse.json({ error: 'Invalid pincode' }, { status: 400 })
      }
      return await fromPincode(pin)
    }

    return NextResponse.json({ error: 'Provide ?pin= or ?lat=&lon=' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Lookup failed' }, { status: 502 })
  }
}
