# Henna by Chippy — Claude Code Instructions

> Premium organic henna e-commerce + portfolio web app.
> Karuvarakundu, Malappuram, Kerala. Built with Next.js 15 + Gemini AI + Sanity CMS.

---

## Project Overview

**Henna by Chippy** is a two-purpose digital platform:

1. **Product Shop** — Sell handmade, preservative-free nail cones (₹35) and skin cones (₹45)
2. **Bridal Showcase** — Portfolio for local bridal henna bookings

WhatsApp is the checkout channel. There is no payment gateway in v1.

---

## Tech Stack

| Layer      | Technology                    | Notes                                       |
| ---------- | ----------------------------- | ------------------------------------------- |
| Framework  | Next.js 15 (App Router)       | Server Components default, Streaming for AI |
| CMS        | Sanity.io                     | Products, prices, stock, bridal gallery     |
| Vector DB  | Pinecone                      | Knowledge base for RAG                      |
| AI         | Google Gemini 2.5 Flash       | Stain Consultant chatbot via RAG pipeline   |
| Styling    | Tailwind CSS v4               | CSS-variable theme, no arbitrary values     |
| Animations | Framer Motion + custom CSS    | Scroll reveals, hero glow, HennaTrail canvas |
| Deployment | Vercel                        | Edge functions for AI chat API route        |
| Language   | TypeScript (strict mode)      | No `any`, full type safety                  |

---

## Brand Design System — "Modern Kasavu"

### Color Tokens (Tailwind CSS v4 CSS Variables)

```css
@theme {
  --color-ivory-bg: #fffdf5; /* Page background — Kasavu Ivory */
  --color-henna-maroon: #5d2906; /* Primary text, headings */
  --color-leaf-green: #2d4b22; /* Buttons, CTAs, links */
  --color-terracotta: #d4a373; /* Warnings, alerts, storage banner */
}
```

### Design Aesthetic

- **Style**: Modern Kasavu — clean ivory with deep organic tones
- **Typography**: Serif for headings (cultural warmth), Sans for body (clarity)
- **Geometry**: Organic curves, NOT sharp brutalist edges
- **Animation**: Subtle scroll-reveals, NO mesh gradients or glassmorphism
- **Mobile-first**: Critical — target users are on 4G in rural Kerala

### Custom Animation Components

No third-party UI component library. All animation components are built in-house using Tailwind CSS v4 + Framer Motion only where CSS alone is insufficient. This keeps the bundle under 150KB and gives full control over the Kasavu aesthetic.

| Section        | Component            | Implementation                                                |
| -------------- | -------------------- | ------------------------------------------------------------- |
| Hero           | `HeroGlow`           | CSS `radial-gradient` maroon glow + Framer Motion `fadeIn` on mount |
| Navigation     | `FloatingNav`        | Fixed pill nav, CSS `backdrop-filter: blur`, scroll-aware show/hide via `IntersectionObserver` |
| Product Cards  | `HoverRevealCard`    | CSS hover overlay: `transform: translateY` + `opacity` transition, no JS |
| Contact/Bridal | `OrganicBackground`  | CSS `@keyframes` animated soft gradient blobs, `prefers-reduced-motion` respected |

**Framer Motion usage policy:** Only use it for entrance animations that need stagger timing (hero, section reveals). Never for hover effects or CSS-achievable transitions. Import only the hooks you need (`useInView`, `motion.div`) — not the full library.

### Henna Leaf Mouse Trail

A custom canvas-based mouse trail showing tiny henna leaf/dot particles that follow the cursor on desktop. **Disabled on touch/mobile** (no mouse).

**Component**: `src/components/ui/HennaTrail.tsx`

```tsx
// Implementation approach:
// - HTML5 Canvas overlay, pointer-events: none, position: fixed, z-index: 9999
// - On mousemove: spawn a "leaf" particle at cursor position
// - Each particle: small henna leaf SVG path OR a simple teardrop dot
// - Color: henna-maroon (#5D2906) with opacity fade-out
// - Particles drift slightly downward + fade out over ~800ms
// - Max 40 particles on screen at once (performance limit)
// - Respect prefers-reduced-motion: if reduced motion → disable trail
// - Only render on md+ screens (window.innerWidth > 768)
// - Mount in root layout.tsx as a Client Component
```

**Particle shape options** (pick one at build time):
1. Tiny teardrop/dot (simplest, most performant) — `●` scaled to 6-8px
2. SVG henna leaf path (more decorative) — `M 0,-5 C 3,-3 3,3 0,5 C -3,3 -3,-3 0,-5`
3. Three-dot cluster mimicking henna dots pattern

---

## Project Structure

```
e:/K4NN4N/Henna-by-Chippy/
├── CLAUDE.md                    # This file
├── docs/
│   ├── PRD.md                   # Full product requirements
│   └── PLAN.md                  # Development roadmap
├── src/
│   ├── app/
│   │   ├── (shop)/              # Product listing, product detail
│   │   ├── (bridal)/            # Bridal showcase, booking info
│   │   ├── api/
│   │   │   ├── chat/route.ts    # Gemini RAG endpoint
│   │   │   └── checkout/route.ts# WhatsApp message builder
│   │   ├── layout.tsx           # Root layout (FloatingNav + HennaTrail)
│   │   └── page.tsx             # Landing page (HeroGlow section)
│   ├── components/
│   │   ├── ui/                  # Custom animation components + HennaTrail.tsx
│   │   ├── shop/                # ProductCard, Cart, CartDrawer
│   │   ├── ai/                  # StainConsultant chat widget
│   │   └── shared/              # StorageWarningBanner, FreshnessChecker
│   ├── lib/
│   │   ├── sanity/              # client.ts, queries.ts, types.ts
│   │   ├── pinecone/            # client.ts, embed.ts, search.ts
│   │   └── gemini/              # client.ts, rag.ts, knowledge-base.ts
│   ├── store/
│   │   └── cart.ts              # Zustand cart store
│   └── types/
│       └── index.ts             # Shared TypeScript types
├── sanity/
│   ├── schemas/
│   │   ├── product.ts           # Nail/skin cone schema
│   │   ├── bridalGallery.ts     # Portfolio images
│   │   └── siteSettings.ts      # Contact, WhatsApp number
│   └── sanity.config.ts
├── public/
│   └── images/                  # Optimized henna photos
├── .env.local                   # API keys (never commit)
└── .agent/                      # AI agent configuration
```

---

## Dev Commands

```bash
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint check
npx tsc --noEmit    # TypeScript type check
npm run sanity       # Start Sanity Studio

# Pre-launch: seed AI-generated blog posts into Sanity
npx tsx scripts/seed-blog.ts --dry-run   # Preview (no writes)
npx tsx scripts/seed-blog.ts             # Generate + push all 8 posts

# Agent validation scripts
python .agent/scripts/checklist.py .
python .agent/scripts/verify_all.py . --url http://localhost:3000
```

---

## Critical Business Rules

### 1. Storage & Freshness (NON-NEGOTIABLE)

- EVERY product page MUST show the terracotta (`#D4A373`) storage warning banner
- Warning text: "Store in freezer immediately upon arrival. Product spoils if left outside freezer for more than 3 days."
- The `StorageWarningBanner` component is sticky on all product pages

### 2. WhatsApp Checkout Flow

- Checkout button sends to **+91 7561856754**
- Message format:

  ```
  🌿 *New Order — Henna by Chippy*

  Items:
  • [Product Name] x[Qty] — ₹[Amount]

  *Subtotal: ₹[Total]* (product price only)
  🚚 Delivery charges will be confirmed by Chippy based on your location.

  📦 Delivery Address: [Customer fills this]
  📍 Pincode: [Your pincode]
  ```

- Never implement Razorpay, Stripe, or any payment gateway in v1
- No user login or auth in v1

**Chippy's confirmation reply template** (she sends this manually after receiving the order):

  ```
  Thank you for your order! 🌿

  Your order is confirmed. I'll arrange delivery and share details shortly.
  Delivery charges will be based on your pincode. I'll confirm the full total before dispatch.

  Once your henna arrives, I'd love to hear about your experience:
  https://hennabyChippy.in/review

  Any questions? Just reply here! 💚
  — Chippy
  ```

  Note: This is a manual copy-paste template for Chippy. Automated WhatsApp replies require WhatsApp Business API (see Alternatives section). Not in v1.

### 3. The 3-Day Logistics Rule

- The AI consultant MUST warn users in far-away pincodes that delivery >3 days means product spoilage
- Show freshness checker UI: input pincode → show SAFE / CAUTION / RISKY delivery window
- Authoritative zone list (also in `docs/ai-instructions.md`):
  - SAFE: Malappuram, Kozhikode, Thrissur, Palakkad, Calicut (1-2 days)
  - CAUTION: Ernakulam, Kottayam, Alappuzha, Idukki, Kannur, Trivandrum, Kollam (2-3 days)
  - RISKY: Tamil Nadu, Karnataka, Goa (3+ days possible)
  - WARN STRONGLY: Delhi, Mumbai, other distant cities (very likely over 3 days)
  - NOT AVAILABLE: Outside India
- Pincode-to-district lookup uses a static JSON file (`src/lib/pincode-zones.json`) — no external API. No real-world data dependencies beyond Sanity and Pinecone.

### 4. Pricing (from Sanity — never hardcode)

| Product   | Size   | Price |
| --------- | ------ | ----- |
| Nail Cone | 10–15g | ₹35   |
| Skin Cone | 25–30g | ₹45   |

### 5. Language & Accessibility

- UI language: English
- AI Stain Consultant: Must handle English, Malayalam, and Manglish queries
- All images must have descriptive alt text
- Color contrast must meet WCAG AA

### 6. Refund and Replacement Policy (NON-NEGOTIABLE)

- If a product arrives damaged, the customer must send an **unboxing video** to WhatsApp (+91 7561856754) within **24 hours of delivery**
- Chippy will arrange a full refund OR replacement immediately, customer's choice
- The AI consultant must communicate this policy whenever a user reports a damaged product
- The website has a `/support/refund` page with a form for submitting the request online (video required, max 100MB)
- If spoilage is due to improper storage (left outside freezer), it is NOT covered — the AI must explain this clearly and kindly
- Wrong item sent: full replacement, no video required

**Refund form fields (all required unless noted):**
- Customer name
- WhatsApp number
- Order date (approximate)
- Product ordered (Nail Cone / Skin Cone / Both)
- Issue type (Damaged on arrival / Wrong item / Missing item / Other)
- Issue description (optional, max 500 characters)
- Unboxing video (required, max 100MB, stored as Sanity file asset)
- Additional photos (optional, up to 5)

### 7. Legal Pages (Required Before Launch)

All three must be linked in the footer and present before the site goes live:

| Page | Route | Required by |
|------|-------|-------------|
| Privacy Policy | `/privacy` | India DPDP Act 2023, Sanity DPA |
| Terms of Service | `/terms` | E-commerce best practice |
| Refund and Replacement Policy | `/refund-policy` | Consumer Protection Act 2019 |

**Privacy Policy must cover:**
- Data collected: reviews (with consent), chat logs (anonymised session ID + region code only), refund requests
- Purpose: business operations only. Data is never sold.
- Third-party processors: Sanity.io (content), Vercel (hosting), Pinecone (AI search), Google Gemini (AI)
- Data stored in: Sanity (cloud CDN), Pinecone (US servers — disclosed)
- Right to deletion: contact Chippy via WhatsApp at +91 7561856754
- Governed by India's Digital Personal Data Protection Act 2023 (DPDP Act)
- Cookie use: session cookies only (no ad cookies, no tracking pixels)

**India compliance notes:**
- DPDP Act 2023 — requires consent notice, purpose limitation, right to erasure
- Consumer Protection (E-Commerce) Rules 2020 — requires grievance officer name + contact (Chippy is the officer)
- IT Act 2000 Section 43A — requires reasonable security practices for sensitive data

---

## AI Stain Consultant — Knowledge Base

Hard-coded facts that MUST be in the Gemini system prompt:

```
SYSTEM INSTRUCTIONS:
You are Chippy's AI Stain Consultant for Henna by Chippy.

PRODUCT FACTS:
- Ingredients: 100% natural henna powder, water, essential oil, sugar
- NO preservatives, NO PPD (para-phenylenediamine), NO chemicals
- Two variants: Nail Cone (10-15g, ₹35) and Skin Cone (25-30g, ₹45)

STORAGE RULES (CRITICAL - always communicate this):
- Store in freezer IMMEDIATELY upon arrival
- Outside freezer for >3 days = product spoils = poor stain quality
- Spoiled product gives orange/light stain instead of deep maroon

APPLICATION GUIDE:
- Keep henna on for 8-12 hours for best results
- Avoid water/soap for first 24 hours after removal
- Durability: 8 - 12 days (fades faster in 3-6 days with frequent hand washing/dishwashing)

LOGISTICS:
- Based in Karuvarakundu, Malappuram District, Kerala
- Ships across Kerala
- Warn users if their location might cause >3 day transit

LANGUAGE:
- You understand English, Malayalam, and Manglish
- Always respond in the language the user writes in
- Keep responses warm, helpful, and culturally aware
```

---

## Environment Variables Required

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
SANITY_WEBHOOK_SECRET=          # HMAC secret for validating /api/webhooks/sync-review requests

# Google Gemini
GOOGLE_GENERATIVE_AI_API_KEY=

# Pinecone
PINECONE_API_KEY=
PINECONE_INDEX_NAME=henna-knowledge-base
# Index must be created with 768 dimensions (text-embedding-004 output size)

# Instagram / Meta (for oEmbed social post embeds)
INSTAGRAM_ACCESS_TOKEN=         # From Meta Business API. Required for /api/oembed proxy route.
                                # Get at: Meta for Developers → Apps → Instagram Basic Display API

# SEO / Google
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=  # From Google Search Console → HTML meta tag method

# Rate limiting (choose one)
UPSTASH_REDIS_REST_URL=         # If using Upstash Redis for per-IP rate limiting
UPSTASH_REDIS_REST_TOKEN=       # Required with above

# Business
NEXT_PUBLIC_WHATSAPP_NUMBER=917561856754
# Domain TBD — use Vercel preview URL during dev. Update when domain is registered.
NEXT_PUBLIC_SITE_URL=https://henna-by-chippy.vercel.app
```

---

## Performance Targets

| Metric    | Target          | Why                                     |
| --------- | --------------- | --------------------------------------- |
| LCP       | < 2.0s          | Rural 4G users in Kerala                |
| FID       | < 100ms         | Mobile-first audience                   |
| CLS       | < 0.1           | Reserve explicit dimensions on all images and embed containers |
| Bundle JS | < 150KB gzipped | Low-end Android devices                 |

**Key rule:** No photo, video, or social embed may block or delay the initial page render. See "Media Loading Strategy" in the Media section above.

---

## Agent Routing for This Project

| Task                      | Use Agent                | Key Skills                               |
| ------------------------- | ------------------------ | ---------------------------------------- |
| UI components, pages      | `frontend-specialist`    | Tailwind v4, Framer Motion, Next.js      |
| AI chat API, RAG pipeline | `backend-specialist`     | Gemini API, Pinecone, Next.js API routes |
| Sanity schemas            | `database-architect`     | Sanity schema design                     |
| WhatsApp checkout logic   | `backend-specialist`     | API patterns                             |
| SEO, local search         | `seo-specialist`         | "Organic Henna Malappuram" keywords      |
| Brand design decisions    | `henna-brand-specialist` | Modern Kasavu aesthetic                  |
| Deployment, env vars      | `devops-engineer`        | Vercel, environment setup                |

---

## SEO + GEO Strategy

See `docs/seo-geo-strategy.md` for the complete strategy.

### robots.ts — Allow AI crawlers (GEO critical)

```ts
// src/app/robots.ts
export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
```

### Google Search Console (GSC)

Add verification in `src/app/layout.tsx`:
```ts
export const metadata: Metadata = {
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}
```

GSC also tracks **AI Overview citations** (Performance → Search type → AI Overviews) — this is the primary GEO measurement tool. Check weekly after launch.

### JSON-LD Required

- Homepage → `LocalBusiness`
- Product pages → `Product`
- FAQ sections → `FAQPage`
- Blog posts → `BlogPosting`

### GEO Rule: Every FAQ answer must be complete and self-contained (no "read more").

## SEO Priority Keywords

- "Organic henna Malappuram"
- "Natural henna cone Kerala"
- "Bridal henna Malappuram"
- "PPD-free henna India"
- "Henna cone buy online Kerala"
- "Karuvarakundu henna"
- "How long to keep henna on for dark stain"
- "Why is henna stain orange"
- "Henna near me"

---

## Footer Attribution

Footer must include: **"Developed by [frpboy](https://github.com/frpboy)"**

```tsx
// In footer component:
<p>
  Developed by{" "}
  <a href="https://github.com/frpboy" target="_blank" rel="noopener noreferrer">
    frpboy
  </a>
</p>
```

---

## Media & Photo Handling

### Review Media Limits

| Type | Limit | Notes |
|------|-------|-------|
| Review text | No min, max 2000 chars | Emojis allowed (non-NSFW, non-flagged). No custom emoji picker in form. |
| Photos | Up to 10 | Total across all photos must be under 200MB. Client-side validation. |
| Videos (direct upload) | Up to 2 | Total across both must be under 50MB. Client-side validation. Stored as raw file in Sanity (no transcoding). Playback via `<video>` tag. |
| External video link | 1 | Any platform (Instagram Reel, YouTube, TikTok). No upload. |
| Social post links | Up to 5 | Strictly Instagram (`instagram.com`) or Facebook (`facebook.com` / `fb.com`) only. Validated per entry. |

- Photos are stored in **Sanity Assets** (no separate CDN needed)
- Serve all images via Sanity CDN with compression URL params:
  ```ts
  imageUrlBuilder.image(asset)
    .width(800).height(800).quality(80).format('webp').fit('crop')
  // Thumbnails: .width(400).quality(75).format('webp')
  ```
- Videos: stored as Sanity file assets. No transcoding. Render with `<video controls>` using the Sanity file URL.
- Social post links: validated strictly to `instagram.com` / `facebook.com` / `fb.com` — both in Sanity schema and client-side before submit.

### Media Loading Strategy (CRITICAL — never block page load)

Photos, videos, and social embeds must **never** delay the initial page render. Hero and above-the-fold content must load before any review/showcase media.

#### Photos — `next/image` with blur placeholder

```tsx
// Always use next/image, never <img>
import Image from 'next/image'

<Image
  src={sanityImageUrl}        // Sanity CDN WebP URL
  alt={altText}
  width={400}
  height={400}
  loading="lazy"              // default, but be explicit
  placeholder="blur"
  blurDataURL={lqipUrl}       // tiny blurred preview while loading
  sizes="(max-width: 768px) 50vw, 25vw"
/>

// LQIP (Low Quality Image Placeholder) — generate server-side
const lqipUrl = imageUrlBuilder.image(asset).width(20).quality(30).format('webp').blur(50).url()
```

Rules:
- Hero product image only: `priority={true}` (above fold, preload)
- All showcase / review / gallery images: `loading="lazy"` (default)
- Never set `priority` on anything below the fold

#### Videos — `preload="none"` with poster frame

```tsx
<video
  controls
  preload="none"          // load nothing until the user presses play
  poster={posterUrl}      // show a still thumbnail (first stainPhoto or placeholder)
  style={{ width: '100%', maxWidth: 640, aspectRatio: '16/9' }}
>
  <source src={sanityFileUrl} type="video/mp4" />
</video>

// posterUrl: use the Sanity image URL of the first review photo, or a generic henna placeholder
```

#### Social Post Embeds — IntersectionObserver gate

```tsx
// Only mount the embed after it scrolls into view
// Reserve explicit height before mount to prevent CLS

const [inView, setInView] = useState(false)
const ref = useRef<HTMLDivElement>(null)

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
    { rootMargin: '200px' }   // start loading 200px before visible
  )
  if (ref.current) observer.observe(ref.current)
  return () => observer.disconnect()
}, [])

return (
  <div ref={ref} style={{ minHeight: 400 }}>   {/* reserve space — prevents layout shift */}
    {inView && <EmbedContent url={url} platform={platform} />}
  </div>
)
```

- Never load the Facebook JS SDK globally. Inject it only when a Facebook embed scrolls into view.
- Never fetch Instagram oEmbed until the embed enters the viewport.

#### Showcase Grid — pagination, not infinite scroll

- First load: 12 photos max
- "Load more" button fetches next 12 (no infinite scroll — poor performance on low-end Android)
- `next/image` lazy loads images outside the viewport automatically

#### AI Chat Images — thumbnail, not full-res

```tsx
// Render small thumbnails inline — full-size opens in lightbox on click
<Image src={imageUrl} width={120} height={120} loading="lazy" alt="Customer stain result" />
```

### Showcase Promotion Flow

**Photo upload path:**
1. Customer submits review with photos + checks consent (`allowAiUsage: true`)
2. Chippy reviews in Sanity Studio, sets `approved: true`
3. If photo is great, Chippy sets `promoteToShowcase: true`
4. Chippy creates a `stainShowcase` document → `sourceType: 'customer_review'` → references the review

**Social post path:**
1. Customer pastes their Instagram or Facebook post URL in the review form (`socialPostLink`)
2. Chippy reviews, sets `approved: true` and `promotePostToShowcase: true`
3. Chippy creates a `stainShowcase` document → `sourceType: 'social_post'` → sets `socialPostUrl`
4. Frontend renders the post as an embed (Instagram oEmbed API or Facebook embed script)

**Social embed implementation:**
```tsx
// Instagram embed: use the oEmbed endpoint
// GET https://graph.facebook.com/v18.0/instagram_oembed?url={postUrl}&access_token={token}
// Returns: { html: '<blockquote>...</blockquote><script>...' }
// Render the html safely (dangerouslySetInnerHTML with sanitization, or use a library)

// Facebook embed: use the standard embed snippet
// <div class="fb-post" data-href="{postUrl}"></div>
// + load the Facebook JS SDK once in layout

// IMPORTANT: Only render embeds from instagram.com and facebook.com/fb.com — validate before rendering
// IMPORTANT: Add `loading="lazy"` logic — load embeds only when in viewport (IntersectionObserver)
```

### AI Photo Retrieval via Pinecone

When a review with `approved: true` and `allowAiUsage: true` is published, a Sanity webhook triggers `POST /api/webhooks/sync-review`, which:

1. Builds a text description of the review + photo context
2. Embeds it with `text-embedding-004`
3. Upserts to Pinecone with `imageUrl` in metadata:

```ts
// Pinecone entry format for review photos
{
  id: `review_photo_${reviewId}_${photoIndex}`,
  text: `Customer ${name} from ${location} rated ${rating} stars. Stain type: ${stainType}. Hours kept on: ${hoursKept}. Review: "${reviewText}". Photo alt: "${altText}"`,
  metadata: {
    category: 'customer_photo',
    imageUrl: sanityImageUrl, // WebP URL with ?w=800&q=80&fm=webp
    stainType,
    rating,
    hoursKept,
    coneUsed,
  }
}
```

4. When the AI receives a query asking for real stain examples, Pinecone returns these entries
5. The chat API includes `images: string[]` in the response if any retrieved chunks have `imageUrl` metadata
6. The frontend chat widget renders thumbnail images inline in the response

```ts
// Chat API response shape (streaming + structured)
type ChatResponse = {
  text: string      // streamed markdown text
  images?: string[] // optional: Sanity CDN image URLs to render in UI
}
```

### Chat Session Storage (Analytics + AI Training)

All AI chat interactions are logged to Sanity as `chatLog` documents. This gives Chippy visibility into what customers are asking, surfaces gaps in the knowledge base, and builds a training corpus for future AI improvements.

**Why Sanity (not a separate DB):**
- Volume is low (rate-limited to 10 req/min per IP, 10 messages/session)
- Chippy can review logs in Studio without a separate tool
- Same project, no extra infrastructure

**Schema: `chatLog`**

```ts
// sanity/schemas/chatLog.ts
{
  name: 'chatLog',
  type: 'document',
  fields: [
    { name: 'sessionId', type: 'string' },      // random UUID per browser session
    { name: 'messages', type: 'array', of: [
      {
        type: 'object',
        fields: [
          { name: 'role', type: 'string' },      // 'user' | 'model'
          { name: 'text', type: 'text' },
          { name: 'timestamp', type: 'datetime' },
        ]
      }
    ]},
    { name: 'userLanguage', type: 'string' },   // 'en' | 'ml' | 'manglish'
    { name: 'startedAt', type: 'datetime' },
    { name: 'ipRegion', type: 'string' },        // coarse location only (e.g. 'KL', 'TN')
    { name: 'flagged', type: 'boolean', initialValue: false },  // Chippy can flag for review
    { name: 'notes', type: 'text' },             // Chippy's internal notes
  ]
}
```

**How logging works in `/api/chat/route.ts`:**

```ts
// After streaming response completes, write to Sanity (non-blocking — don't await)
void sanityClient.create({
  _type: 'chatLog',
  sessionId,
  messages: [...history, { role: 'user', text: message }, { role: 'model', text: fullResponse }],
  startedAt: new Date().toISOString(),
  userLanguage: detectedLang,   // simple heuristic on the user message
  ipRegion: req.headers.get('x-vercel-ip-country-region') ?? 'unknown',
})
// Use void + fire-and-forget — never let logging delay the response
```

**Privacy rules:**
- No name, email, or identifying info is stored — session ID is random, not tied to any account
- IP is stored only as country-region code (e.g. "KL"), never raw IP
- Chippy can delete any log document from Studio

**How to use logs for AI improvement:**
1. Open Sanity Studio → Chat Logs → sort by date
2. Read common questions → add answers to `docs/knowledge-base.json`
3. Add new FAQ entries to `docs/content.md`
4. Re-run `npx tsx scripts/seed-knowledge-base.ts` to re-embed and upsert to Pinecone
5. This closes the loop: real questions → updated knowledge base → better AI answers

### Sanity Webhook Setup (post-launch)

Configure in Sanity → API → Webhooks:
- **Trigger**: document type `review`, filter `approved == true && allowAiUsage == true`
- **URL**: `https://henna-by-chippy.vercel.app/api/webhooks/sync-review`
- **Secret**: Set `SANITY_WEBHOOK_SECRET` in env + validate in route

---

## What NOT to Do

- ❌ Never hardcode product prices — always fetch from Sanity
- ❌ Never add a payment gateway in v1
- ❌ Never use purple/violet colors (not on-brand)
- ❌ Never use glassmorphism or mesh gradients
- ❌ Never skip the `StorageWarningBanner` on product pages
- ❌ Never commit `.env.local`
- ❌ Never use `any` type in TypeScript
- ❌ Never add a third-party UI component library (Aceternity, shadcn, etc.) without explicit approval — build custom instead
- ❌ Never use em dashes (—) in any user-facing content. Use commas, periods, or colons instead.
- ❌ Never write copy that sounds AI-generated. Avoid "elevate", "seamless", "delve", "moreover", "furthermore", "it's worth noting", "in conclusion".
- ❌ Blog posts must sound like Chippy wrote them herself, not like a content marketer. Short sentences. Real stories. No filler.

---

> **Agent System**: This project uses the Antigravity Kit agent system. See `.agent/ARCHITECTURE.md` for the full agent/skill/workflow map.
