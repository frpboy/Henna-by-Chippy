# PRD: Henna by Chippy — Digital Studio & Shop

**Version**: 1.0
**Date**: March 2026
**Status**: Active Development
**Owner**: Chippy (Artist & Business Owner), K4NN4N (Tech Lead)

---

## 1. Executive Summary

Henna by Chippy is a premium organic henna brand based in Karuvarakundu, Malappuram, Kerala. This document defines the complete product requirements for a web platform that serves two primary missions:

1. **Sell** handmade, preservative-free henna cones directly to customers across Kerala
2. **Showcase** bridal henna artistry to attract local wedding bookings

The platform replaces ad-hoc Instagram DMs with a structured, AI-assisted ordering experience while educating customers on proper product use — reducing "orange stain" complaints caused by improper storage.

---

## 2. Problem Statement

### 2.1 Current Pain Points

| Pain Point | Impact |
|------------|--------|
| Customers don't know how to store the product → poor stain | Repeat complaints, returns, damaged brand reputation |
| Chippy manually answers "How much?" / "How to use?" questions via DM | Lost hours per week, delayed orders |
| No central product catalog — prices shared manually | Inconsistent pricing, confusion |
| Customers in distant locations order without knowing transit risks | Spoiled product, unhappy customers |
| No portfolio visibility beyond Instagram | Missed bridal booking opportunities |

### 2.2 Hypothesis

A web platform with an AI consultant embedded will:
- Reduce repetitive DMs by 70%+ (handled by AI)
- Eliminate "orange stain" complaints (storage warning always visible)
- Convert browsing customers into WhatsApp orders faster

---

## 3. Target Audience

### Primary Personas

**Priya — The Kerala Bride (Age 22–35)**
- Planning a wedding in Malappuram or nearby districts
- Values authenticity, cultural heritage, safety of ingredients
- Discovers via Instagram, searches "bridal henna Malappuram"
- Decision factor: Artist portfolio quality + trusted brand

**Nisha — The DIY Henna Enthusiast (Age 18–30)**
- Wants natural, chemical-free henna for personal use
- May be anywhere in Kerala or a Malayali in another state
- Searches "organic henna cone buy online"
- Decision factor: Price, ingredients clarity, ease of ordering

**Amina — The Safety-Conscious Mom (Age 30–45)**
- Buying henna for children's celebrations
- Highly concerned about chemicals (PPD-free)
- Influenced by other mothers' recommendations
- Decision factor: Ingredient transparency, storage guidance

---

## 4. Brand Identity

| Attribute | Value |
|-----------|-------|
| Origin | Karuvarakundu, Malappuram (Highland Kerala) |
| Core Values | 100% Organic, Preservative-free, Artisanal, Educational |
| Aesthetic | Modern Kasavu — ivory base, deep organic tones |
| Tone | Warm, knowledgeable, culturally aware, safety-first |
| Tagline | *"Pure Organic Henna from the Hills of Karuvarakundu."* |

---

## 5. Visual & UI Design Specification

### 5.1 Color System (Tailwind CSS v4)

```css
@theme {
  --color-ivory-bg:      #FFFDF5; /* Kasavu Ivory — background */
  --color-henna-maroon:  #5D2906; /* Primary text, headings */
  --color-leaf-green:    #2D4B22; /* Buttons, CTAs */
  --color-terracotta:    #D4A373; /* Warnings, storage alerts */
}
```

### 5.2 Typography

| Use Case | Font | Weight |
|----------|------|--------|
| Headings | Playfair Display (Serif) | 600–700 |
| Body / UI | Plus Jakarta Sans | 400–500 |
| Price / Labels | Plus Jakarta Sans | 600 |

### 5.3 Custom Animation Components

No third-party UI library. All components are built with Tailwind CSS v4 + targeted Framer Motion usage.

| Section | Component | Implementation |
|---------|-----------|----------------|
| Hero | `HeroGlow` | CSS `radial-gradient` maroon glow + Framer Motion entrance fade |
| Navigation | `FloatingNav` | Fixed pill nav, CSS `backdrop-filter: blur`, scroll-aware via `IntersectionObserver` |
| Product Cards | `HoverRevealCard` | CSS hover overlay: `translateY` + `opacity` transition, no JS |
| Bridal/Contact | `OrganicBackground` | CSS `@keyframes` animated soft gradient blobs |

### 5.4 Animation Philosophy

- Scroll-triggered reveal for sections (Framer Motion `useInView` — import only what's needed)
- CSS transitions for all hover/interactive states
- `prefers-reduced-motion` respected globally on every animated component
- NO mesh gradients, NO glassmorphism, NO aurora blobs, NO third-party animation libraries

---

## 6. Functional Requirements

### 6.1 Landing Page

**FR-001**: Hero section with `HeroGlow` — CSS radial-gradient maroon spotlight + Framer Motion fade-in
**FR-002**: "Why organic?" section explaining no-preservative formula
**FR-003**: Product quick-add (Nail Cone, Skin Cone) above the fold
**FR-004**: Customer testimonial/stain showcase section
**FR-005**: AI chat widget floating bottom-right
**FR-006**: Bridal portfolio teaser with CTA to full gallery
**FR-007**: Footer with WhatsApp contact, location (Karuvarakundu, Malappuram)

### 6.2 Product Catalog (Shop)

**FR-010**: Product listing page with all available cones
**FR-011**: Product detail page with:
  - Full ingredient list (from Sanity)
  - Weight and price
  - Stock status (in stock / out of stock)
  - Sticky `StorageWarningBanner` (terracotta, always visible)
  - "Add to Cart" button
**FR-012**: Product data managed entirely via Sanity CMS (no hardcoded prices)
**FR-013**: Out-of-stock products shown as disabled with "Notify me" (Phase 2)

### 6.3 Shopping Cart

**FR-020**: Floating cart icon showing item count
**FR-021**: Cart drawer (slide-in panel) showing:
  - Product name, quantity, price per unit
  - Quantity increment/decrement
  - Remove item
  - Subtotal
  - "Order via WhatsApp" CTA
**FR-022**: Cart persists in localStorage (no login required)
**FR-023**: Cart state managed with Zustand
**FR-024**: Maximum order quantity per SKU: 20 units (prevent abuse)

### 6.4 WhatsApp Checkout

**FR-030**: "Order via WhatsApp" generates a pre-formatted message
**FR-031**: Message format:
```
🌿 *New Order — Henna by Chippy*

Items:
• Nail Cone (10-15g) x3 — ₹105
• Skin Cone (25-30g) x2 — ₹90

*Total: ₹195*

📦 Delivery Address: [Please fill your address]
📍 Pincode: [Your pincode]

Ordered via hennabyChippy.in
```
**FR-032**: Opens `https://wa.me/917561856754?text=[encoded message]`
**FR-033**: Pincode input before checkout triggers freshness check
**FR-034**: Freshness check shows SAFE/RISKY delivery estimate

### 6.5 AI Stain Consultant

**FR-040**: Floating chat widget (bottom-right corner)
**FR-041**: Powered by Gemini 2.5 Flash with Pinecone RAG
**FR-042**: Must answer questions about:
  - Storage and freezing rules
  - Application instructions (8-12 hours)
  - Ingredients (no PPD, no preservatives)
  - Shelf life (3-4 months frozen)
  - Delivery timing and logistics
  - Stain color expectations
**FR-043**: Understands English, Malayalam, and Manglish
**FR-044**: Responds in the same language as the user's query
**FR-045**: Proactively warns about the 3-day transit rule when user mentions delivery
**FR-046**: Chat history persists within single session (not across sessions in v1)
**FR-047**: Graceful fallback: "I'm not sure about that. WhatsApp Chippy directly: +91 7561856754"

### 6.6 Bridal Showcase

**FR-050**: Full-screen gallery of bridal henna work
**FR-051**: Images managed via Sanity (upload in Studio)
**FR-052**: Gallery with category filters (Bridal Full / Bridal Half / Feet / Custom)
**FR-053**: Booking inquiry CTA → opens WhatsApp with bridal inquiry template
**FR-054**: `OrganicBackground` CSS animated gradient on bridal section

### 6.7 Product Freshness / Logistics Check

**FR-060**: Pincode input on product detail page and before checkout
**FR-061**: Simple rule-based check (authoritative source: `docs/ai-instructions.md`):
  - Malappuram, Kozhikode, Thrissur, Palakkad, Calicut → SAFE (1-2 days typical)
  - Ernakulam, Kottayam, Alappuzha, Idukki, Kannur, Trivandrum, Kollam → CAUTION (2-3 days)
  - Tamil Nadu, Karnataka, Goa → RISKY (3+ days possible)
  - Delhi, Mumbai, other distant cities → WARN STRONGLY (very likely over 3 days)
  - Outside India → Not available
**FR-062**: SAFE → green checkmark: "Your location is within safe delivery range"
**FR-063**: CAUTION → amber alert: "Delivery is typically 2-3 days. Check with Chippy if you need it sooner."
**FR-064-old** renumbered: RISKY → terracotta alert: "Delivery might take 3+ days. Request express shipping via WhatsApp before ordering."
**FR-064**: AI consultant integrates same logic when discussing delivery

---

## 7. Non-Functional Requirements

### 7.1 Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| LCP | < 2.0s | Lighthouse on 4G throttled |
| FID / INP | < 100ms | Real User Monitoring (Vercel Analytics) |
| CLS | < 0.1 | Lighthouse |
| Bundle JS | < 150KB gzipped | @next/bundle-analyzer |
| TTFB | < 400ms | Vercel Edge |

### 7.2 Accessibility

- WCAG 2.1 AA compliance
- All images: descriptive alt text in English + Malayalam where relevant
- Keyboard navigation for all interactive elements
- Focus management in cart drawer and chat widget
- Color contrast ratio ≥ 4.5:1 for text on backgrounds

### 7.3 SEO

- Server-side rendering via Next.js Server Components
- Structured data (JSON-LD) for products and local business
- Target keywords: "Organic henna Malappuram", "Natural henna cone Kerala", "PPD-free henna India"
- Open Graph + Twitter Card meta for social sharing
- Google Search Console setup
- Sitemap.xml auto-generated

### 7.4 Security

- No user auth or PII storage in v1 (zero attack surface)
- API keys in Vercel environment variables (never in code)
- Rate limiting on `/api/chat` (10 req/min per IP) to prevent AI cost abuse
- Input sanitization on all user-facing inputs

### 7.5 Reliability

- Uptime: 99.9% via Vercel's global CDN
- AI fallback: if Gemini/Pinecone is unreachable, show WhatsApp contact
- Sanity webhooks for ISR (Incremental Static Regeneration) on product updates

---

## 8. Content Requirements

### 8.1 Copywriting (see `docs/content.md` for full copy)

| Page / Section | Content Status |
|----------------|---------------|
| Hero headline | "Pure Organic Henna from the Hills of Karuvarakundu." |
| About Chippy | Short bio, journey, values |
| Why organic? | No preservatives explanation |
| Storage science | Freezing rule, why it matters |
| FAQ (10 questions) | Training data for AI |
| Bridal page | Portfolio + booking info |

### 8.2 Media

- High-resolution henna stain photos (dark maroon on skin)
- Chippy's portrait / workshop photos for About section
- Product photos (clean, natural-light, close-up cones)
- All images: WebP format, next/image with proper `sizes` attribute

---

## 9. Sanity CMS Schema Overview

| Collection | Key Fields |
|------------|-----------|
| `product` | name, slug, type (nail/skin), weight, price, stock, ingredients[], image |
| `bridalGallery` | title, category, image, tags[], featured |
| `review` | customerName, location, stayDuration, image, text, rating |
| `siteSettings` | whatsappNumber, storeName, tagline, address, socialLinks |

---

## 10. AI Knowledge Base Topics (Pinecone Vectors)

| ID Range | Topic |
|----------|-------|
| `storage_*` | Freezing rules, shelf life, spoilage signs |
| `application_*` | How to apply, duration, post-care |
| `ingredients_*` | What's in the cone, what's NOT in it |
| `stain_*` | Color expectations, durability, fading |
| `logistics_*` | Delivery zones, transit time, 3-day rule |
| `bridal_*` | Booking process, what to expect, preparation |
| `comparison_*` | Organic vs chemical henna, PPD risks |

---

## 11. User Journey

```
[Discovery] → Search "Organic Henna Malappuram" / Instagram link
     ↓
[Landing Page] → Hero + product preview + AI widget notice
     ↓
[Education] → Ask AI: "Will this work for my wedding Sunday?"
     ↓         AI: "Apply Thursday night, keep 10 hrs. Order today!"
[Product Page] → View Nail Cone → See ingredients → See STORAGE WARNING
     ↓
[Freshness Check] → Enter pincode → "Safe delivery zone ✓"
     ↓
[Cart] → Add 5 Nail Cones, 2 Skin Cones
     ↓
[Cart Warning] → "Ready to freeze? Store immediately on arrival!"
     ↓
[Checkout] → "Order via WhatsApp" → Pre-filled message to Chippy
     ↓
[Conversion] → Chippy receives structured order on WhatsApp
```

---

## 12. Out of Scope (v1)

- Payment gateway (Razorpay, Stripe, UPI)
- User accounts / order history
- Email notifications (Phase 2)
- Mobile app
- Shipping rate calculator (manual via WhatsApp)
- Review submission form (Phase 2, manual curation for now)
- International shipping

---

## 13. Success Metrics

| Metric | Baseline | Target (3 months) |
|--------|----------|-------------------|
| "How to use?" DMs per week | ~20 | < 5 (AI handles) |
| "Orange stain" complaints | Occasional | Zero (storage education) |
| WhatsApp orders from site | 0 | 15+ per month |
| Page Load (4G) | N/A (no site) | < 2s LCP |
| Bridal inquiries via site | 0 | 3+ per month |

---

## 14. Development Roadmap

| Phase | Scope | Timeline |
|-------|-------|----------|
| **Phase 1 — Foundation** | Tailwind v4 theme, Sanity setup, Landing Page, FloatingNav, HeroGlow | Week 1-2 |
| **Phase 2 — Shop** | Product catalog, Cart (Zustand), WhatsApp checkout, StorageWarningBanner | Week 2-3 |
| **Phase 3 — AI Brain** | Pinecone ingestion, Gemini RAG API route, Chat widget, Freshness checker | Week 3-4 |
| **Phase 4 — Bridal** | Gallery, booking CTA, OrganicBackground section | Week 4 |
| **Phase 5 — Launch** | SEO, Vercel deploy, Search Console, Analytics, Performance audit | Week 5 |

---

## 15. Technical Architecture

```
                    ┌─────────────────────────────┐
                    │       Next.js 15 App         │
                    │    (Server Components)        │
                    └──────────┬──────────────────┘
                               │
          ┌────────────────────┼──────────────────┐
          │                    │                   │
   ┌──────▼──────┐    ┌───────▼───────┐   ┌──────▼──────┐
   │  Sanity CMS  │    │  /api/chat    │   │   Vercel    │
   │  (Products,  │    │  (RAG Route)  │   │   Edge CDN  │
   │   Gallery)   │    └───────┬───────┘   └─────────────┘
   └─────────────┘            │
                     ┌────────┴────────┐
                     │                 │
              ┌──────▼──────┐  ┌──────▼──────┐
              │  Pinecone   │  │   Gemini    │
              │ (Knowledge  │  │  2.5 Flash  │
              │   Base)     │  │   (LLM)     │
              └─────────────┘  └─────────────┘
```

---

*See `docs/PLAN.md` for sprint breakdown and `docs/content.md` for all website copy.*
