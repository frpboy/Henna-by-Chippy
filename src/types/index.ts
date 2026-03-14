// ── Shared TypeScript types for Henna by Chippy ──────────────────

export type ProductVariant = 'nail' | 'skin'

export interface Product {
  _id: string
  _type: 'product'
  name: string
  variant: ProductVariant
  price: number
  weight: string
  description: string
  image: SanityImage
  inStock: boolean
  slug: { current: string }
}

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
}

export interface BridalGallery {
  _id: string
  _type: 'bridalGallery'
  title: string
  image: SanityImage
  occasion?: string
  location?: string
  featured: boolean
  order: number
}

export interface Review {
  _id: string
  _type: 'review'
  customerName: string
  location?: string
  rating: number
  reviewText?: string
  coneUsed: 'nail' | 'skin' | 'both'
  hoursKept?: number
  stainPhotos?: SanityImage[]
  approved: boolean
  submittedAt: string
}

export interface SiteSettings {
  _id: string
  _type: 'siteSettings'
  whatsappNumber: string
  instagramHandle?: string
  facebookUrl?: string
  businessName: string
  tagline?: string
  contactEmail?: string
}

// ── Cart ─────────────────────────────────────────────────────────

export interface CartItem {
  productId: string
  name: string
  variant: ProductVariant
  price: number
  quantity: number
  image?: string
}

export interface CartStore {
  items: CartItem[]
  isOpen: boolean
  messageCount: number
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  incrementMessageCount: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

// ── AI Chat ───────────────────────────────────────────────────────

export type MessageRole = 'user' | 'model'

export interface ChatMessage {
  role: MessageRole
  text: string
  images?: string[]
}

export interface ChatResponse {
  text: string
  images?: string[]
}

// ── Freshness zones ───────────────────────────────────────────────

export type FreshnessZone = 'safe' | 'caution' | 'risky' | 'warn' | 'unavailable'

export interface PincodeZoneEntry {
  district: string
  state: string
  zone: FreshnessZone
  estimatedDays: string
}

// ── Refund request ────────────────────────────────────────────────

export interface RefundRequest {
  customerName: string
  whatsappNumber: string
  orderDate?: string
  productOrdered: 'nail' | 'skin' | 'both'
  issueType: 'damaged_arrival' | 'wrong_item' | 'missing_item' | 'other'
  issueDescription?: string
}
