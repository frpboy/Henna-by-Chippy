# Development Plan: Henna by Chippy

**Project**: Henna by Chippy — Digital Studio & Shop
**Stack**: Next.js 15 + Tailwind v4 + Sanity + Pinecone + Gemini 2.5 Flash
**Deploy**: Vercel

---

## Phase Overview

| Phase | Name | Scope | Status |
|-------|------|-------|--------|
| 0 | Scaffold & Setup | Project init, env, global styles | ⬜ TODO |
| 1 | Foundation | Landing page, navigation, brand theme | ⬜ TODO |
| 2 | Shop | Product catalog, cart, WhatsApp checkout | ⬜ TODO |
| 3 | AI Brain | Pinecone RAG, Gemini chatbot, freshness checker | ⬜ TODO |
| 4 | Bridal + Blog | Gallery, booking CTA, Chippy's Stories blog | ⬜ TODO |
| 5 | Launch | SEO, performance, Vercel deploy, analytics | ⬜ TODO |

---

## Phase 0 — Scaffold & Setup

### Tasks

- [ ] **P0-01** — Initialize Next.js 15 project with TypeScript + App Router
  ```bash
  npx create-next-app@latest henna-by-chippy \
    --typescript --tailwind --eslint --app --src-dir
  ```
- [ ] **P0-02** — Install core dependencies
  ```bash
  npm install @sanity/client @sanity/image-url next-sanity
  npm install @google/generative-ai @pinecone-database/pinecone
  npm install zustand framer-motion
  npm install @aceternity-ui/components  # or manual copy
  ```
- [ ] **P0-03** — Configure Tailwind v4 theme in `src/app/globals.css` (see `globals.css`)
- [ ] **P0-04** — Set up `.env.local` from `.env.example`
- [ ] **P0-05** — Initialize Sanity project + Studio
  ```bash
  npm create sanity@latest -- --project henna-by-chippy --dataset production
  ```
- [ ] **P0-06** — Create Sanity schemas: `product.ts`, `bridalGallery.ts`, `stainShowcase.ts`, `review.ts`, `post.ts`, `siteSettings.ts`, `chatLog.ts`, `refundRequest.ts`
- [ ] **P0-07** — Initialize Pinecone index `henna-knowledge-base` (768 dimensions, cosine)
  - **768 not 1536** — Google `text-embedding-004` outputs 768-dimensional vectors. Using 1536 will cause a dimension mismatch error on every upsert.
- [ ] **P0-08** — Run knowledge base ingestion script
- [ ] **P0-09** — Configure Vercel project + environment variables
- [ ] **P0-10** — Seed AI-generated blog posts into Sanity *(before launch)*
  ```bash
  # Preview what will be generated (no writes)
  npx tsx scripts/seed-blog.ts --dry-run

  # Generate and push all 8 posts to Sanity
  npx tsx scripts/seed-blog.ts

  # Generate a single post
  npx tsx scripts/seed-blog.ts --post "Why I'll Never Put a Chemical"
  ```
  > After seeding: review each post in Sanity Studio → edit Chippy's voice → publish

### Acceptance Criteria

- `npm run dev` starts without errors
- Sanity Studio accessible at `/studio`
- Pinecone index populated with knowledge base entries
- All environment variables validated
- 8 blog posts seeded and reviewed in Sanity Studio

---

## Phase 1 — Foundation

### Tasks

- [ ] **P1-01** — Root layout (`src/app/layout.tsx`)
  - Playfair Display + Plus Jakarta Sans fonts (next/font/google)
  - `FloatingNav` component (custom: fixed pill, CSS `backdrop-filter: blur`, `IntersectionObserver` show/hide)
  - Global StorageWarningBanner context
  - Vercel Analytics + Speed Insights

- [ ] **P1-02** — Landing page hero (`src/app/page.tsx`)
  - `HeroGlow` section: CSS `radial-gradient` henna-maroon glow + Framer Motion `fadeIn` entrance
  - Headline: "Pure Organic Henna from the Hills of Karuvarakundu."
  - Subheadline + CTA buttons (Shop Now, Book Bridal)
  - Scroll-triggered entrance animations

- [ ] **P1-03** — "Why Organic?" section
  - The science of no-preservatives
  - Ingredient list visual (henna powder, water, essential oil, sugar)
  - `HoverRevealCard` for each ingredient: CSS hover overlay, `translateY` + `opacity` transition

- [ ] **P1-04** — "The Malappuram Tradition" section
  - Chippy's bio + journey
  - Workshop photo
  - Values: 100% organic, artisanal, educational

- [ ] **P1-05** — Social proof / testimonials section
  - Customer stain photos + short quotes
  - Star rating display

- [ ] **P1-06** — `FloatingNav` component (custom, no library)
  - Links: Shop, Bridal, About, Blog, Contact
  - Mobile-responsive
  - Hides on scroll down, shows on scroll up

- [ ] **P1-07** — Footer
  - WhatsApp link (+91 7561856754)
  - Instagram link
  - Address: Karuvarakundu, Malappuram
  - Copyright

### Acceptance Criteria

- [ ] Landing page LCP < 2s on Lighthouse 4G throttled
- [ ] No layout shift (CLS < 0.1)
- [ ] FloatingNav works on mobile (375px viewport)
- [ ] All sections have proper scroll animations

---

## Phase 2 — Shop

### Tasks

- [ ] **P2-01** — Sanity product queries (`src/lib/sanity/queries.ts`)
  - `getAllProducts()` — for listing page
  - `getProductBySlug(slug)` — for detail page
  - `getProductsByType(type)` — nail vs skin

- [ ] **P2-02** — Product listing page (`src/app/(shop)/shop/page.tsx`)
  - Server Component — fetches from Sanity
  - Grid of `HoverRevealCard` product cards
  - Filter tabs: All / Nail Cones / Skin Cones
  - Stock status badge

- [ ] **P2-03** — Product detail page (`src/app/(shop)/shop/[slug]/page.tsx`)
  - Product image gallery
  - Full ingredient list
  - Weight, price from Sanity
  - Sticky **StorageWarningBanner** (terracotta)
  - Add to Cart button
  - Freshness checker widget (pincode input)

- [ ] **P2-04** — `StorageWarningBanner` component
  ```tsx
  // Always visible, terracotta background, sticky top
  // Text: "🧊 Store immediately in freezer. Shelf life: 3-4 months frozen."
  ```

- [ ] **P2-05** — Cart store (`src/store/cart.ts`) with Zustand
  - `addItem(product, qty)`
  - `removeItem(productId)`
  - `updateQty(productId, qty)`
  - `clearCart()`
  - `total` computed
  - Persist to localStorage

- [ ] **P2-06** — Cart drawer component (`src/components/shop/CartDrawer.tsx`)
  - Slide-in from right
  - Item list with qty controls
  - Subtotal
  - "Order via WhatsApp" CTA

- [ ] **P2-07** — WhatsApp checkout utility (`src/lib/whatsapp.ts`)
  - `buildOrderMessage(cartItems)` → formatted string
  - `getWhatsAppURL(message)` → `https://wa.me/917561856754?text=...`

- [ ] **P2-08** — Freshness checker component (`src/components/shared/FreshnessChecker.tsx`)
  - Pincode input
  - Client-side district lookup (static JSON map)
  - Display SAFE / CAUTION / RISKY badge

- [ ] **P2-09** — Cart warning modal
  - Triggered when user clicks "Order via WhatsApp"
  - "Ready to freeze? Store cones immediately on arrival!"
  - Confirm → open WhatsApp

### Acceptance Criteria

- [ ] Products load from Sanity (no hardcoded data)
- [ ] Cart persists across page refreshes
- [ ] WhatsApp message is correctly formatted with all items
- [ ] StorageWarningBanner appears on every product page
- [ ] Freshness checker shows correct zone for Malappuram pincode (676501)

---

## Phase 3 — AI Brain

### Tasks

- [ ] **P3-01** — Knowledge base ingestion script (`src/lib/pinecone/ingest.ts`)
  - Load `docs/knowledge-base.json`
  - Embed with Google text-embedding-004
  - Upsert to Pinecone index `henna-knowledge-base`

- [ ] **P3-02** — Pinecone search utility (`src/lib/pinecone/search.ts`)
  - `searchKnowledge(query: string, topK: number)` → relevant chunks

- [ ] **P3-03** — Gemini RAG pipeline (`src/lib/gemini/rag.ts`)
  - Embed user query
  - Retrieve top-5 Pinecone results
  - Inject into Gemini system prompt
  - Stream response

- [ ] **P3-04** — Chat API route (`src/app/api/chat/route.ts`)
  - `POST /api/chat` with `{ message: string, history: Message[] }`
  - Rate limiting: **two separate limits**:
    - 10 requests per IP per minute (server-side, use Upstash Redis or Vercel KV)
    - 10 messages per session max (client-side, tracked in Zustand store)
  - Both limits exist independently. Hitting either shows the WhatsApp fallback.
  - Returns streaming response
  - Error fallback: WhatsApp redirect

- [ ] **P3-05** — AI chat widget (`src/components/chat/StainConsultant.tsx`)
  - Floating button (bottom-right, leaf-green)
  - Expandable chat panel
  - Message history display
  - Input box + send button
  - Typing indicator
  - Language-aware (EN/ML/Manglish)

- [ ] **P3-06** — Integrate freshness warning into AI responses
  - If AI detects delivery/distance questions → auto-trigger freshness check UI
  - AI references the 3-day rule in context-appropriate responses

- [ ] **P3-07** — Review photo sync to Pinecone (`src/app/api/webhooks/sync-review/route.ts`)
  - Triggered by Sanity webhook when review is published with `approved: true && allowAiUsage: true`
  - For each photo in `stainPhotos[]`, build Pinecone entry:
    - `text`: customer name, location, rating, stain type, hours kept, review text, alt text
    - `metadata.imageUrl`: Sanity CDN URL with `?w=800&q=80&fm=webp`
    - `metadata.category`: `'customer_photo'`
  - Validate webhook HMAC signature using `SANITY_WEBHOOK_SECRET`

- [ ] **P3-08** — Extend chat API response to include images
  - After Pinecone search, check if any retrieved chunks have `metadata.imageUrl`
  - Return `{ text: streamedText, images: string[] }` when photos are found
  - Frontend chat widget renders `<Image>` thumbnails below AI text response

- [ ] **P3-09** — Review submission form (`src/app/reviews/submit/page.tsx`)
  - **Text**: textarea, no minimum, max 2000 characters with live counter. Emojis welcome (type or paste — no custom picker).
  - **Photos**: multi-file input (`accept="image/*"`), max 10 files, total size under 200MB (client-side check before submit). Show running total size as files are added.
  - **Videos**: separate file input (`accept="video/*"`), max 2 files, total size under 50MB (client-side check). Show running total size.
  - **External video link**: single URL input (any platform, optional).
  - **Social post links**: up to 5 URL inputs (add/remove dynamically). Client-side: validate each URL contains `instagram.com` or `facebook.com` / `fb.com` before submit. Show platform badge (📸 / 👤) next to each valid URL.
  - **Consent checkbox**: "Allow Chippy to share my photos with future customers via the AI assistant"
  - Submit to `/api/reviews/submit` → create draft `review` document in Sanity (approved: false by default)

- [ ] **P3-10** — Social post embed component (`src/components/shared/SocialPostEmbed.tsx`)
  - Accepts `url: string` and `platform: 'instagram' | 'facebook'`
  - Instagram: fetch oEmbed HTML from `/api/oembed?url=...` (server-side proxy to avoid CORS + hide token)
  - Facebook: render `<div class="fb-post" data-href={url}>` + load FB JS SDK once in layout
  - Gate render behind IntersectionObserver: only mount when embed enters viewport (rootMargin: 200px)
  - Reserve explicit `minHeight: 400` on container before load to prevent CLS
  - Never inject Facebook SDK globally — load on demand
  - Strict allow-list: reject render if URL does not match `instagram.com` or `facebook.com`

- [ ] **P3-11** — Media lazy loading across all pages
  - All review/showcase photos: `next/image` with `loading="lazy"` + `placeholder="blur"` + LQIP from Sanity (`?w=20&q=30&fm=webp&blur=50`)
  - Hero product image only: `priority={true}`. Never `priority` on below-fold images.
  - Videos: `preload="none"` + `poster` attribute (use first review photo or placeholder). Never preload video data on page load.
  - Showcase grid: paginate at 12 per load. "Load more" button. No infinite scroll.
  - AI chat images: render as 120x120 thumbnails only. Full-size in lightbox on click.
  - Test with Lighthouse throttled to "Slow 4G" — LCP must stay under 2s.

- [ ] **P3-12** — Chat log storage in Sanity (`sanity/schemas/chatLog.ts`)
  - Schema: `sessionId` (random UUID), `messages[]` (role + text + timestamp), `userLanguage`, `startedAt`, `ipRegion` (country-region code only, e.g. "KL"), `flagged` boolean, `notes` text
  - In `/api/chat/route.ts`: fire-and-forget `sanityClient.create(chatLog)` after streaming completes. Use `void` — never await in the response path.
  - Privacy: no names, no emails, no raw IPs. Region code only. Session ID is random, not tied to any account.
  - Chippy reviews logs in Studio → identifies repeated questions → adds answers to `docs/knowledge-base.json` → re-seeds Pinecone

### Acceptance Criteria

- [ ] AI correctly answers: "How long should I keep henna on?"
- [ ] AI correctly answers: "Can I order from Bangalore?"
- [ ] AI understands: "Enikk henna cone vendum" (Malayalam)
- [ ] Rate limiting works (11th request within 1min → 429 error)
- [ ] Fallback message appears when Gemini/Pinecone is unreachable
- [ ] Chat streams response (not waiting for full completion)

---

## Phase 4 — Bridal + Blog

### Tasks

- [ ] **P4-01** — Bridal showcase page (`src/app/(bridal)/bridal/page.tsx`)
  - `OrganicBackground` CSS animated gradient atmosphere
  - Gallery grid with category filter
  - Images from Sanity `bridalGallery` collection
  - "Book Bridal Henna" CTA → WhatsApp with bridal inquiry template

- [ ] **P4-02** — Bridal booking WhatsApp template
  ```
  💍 Bridal Henna Inquiry
  Wedding Date: [Please fill]
  Location: [Venue / City]
  Design preference: [Full / Half / Feet / Custom]
  No. of people: [Count]
  ```

- [ ] **P4-03** — Blog: "Chippy's Stories" (`src/app/(blog)/blog/page.tsx`)
  - Server Component — fetches posts from Sanity
  - Post listing with featured image, date, excerpt
  - Warm ivory design with henna-maroon typography

- [ ] **P4-04** — Blog post detail (`src/app/(blog)/blog/[slug]/page.tsx`)
  - Rich text renderer (Sanity Portable Text)
  - Author: Chippy with photo
  - Reading time estimate
  - Share to WhatsApp / Instagram buttons

- [ ] **P4-05** — Blog Sanity schema (`sanity/schemas/post.ts`)
  - title, slug, excerpt, body (Portable Text), featuredImage, publishedAt, tags

- [ ] **P4-06** — "About Chippy" page (`src/app/about/page.tsx`)
  - Full story, values, photos
  - Embed recent blog posts

### Sample Blog Post Ideas (seed content)

1. "Why I Never Add Chemicals to My Henna — My Promise to You"
2. "The Art of Freezing: How I Keep My Cones Fresh for Months"
3. "A Bride's Guide to Henna Application Night"
4. "From Karuvarakundu to Your Doorstep — Our Journey"
5. "FAQ: Everything You Asked About Organic Henna Cones"

### Acceptance Criteria

- [ ] Bridal gallery loads images from Sanity
- [ ] Blog posts render Portable Text correctly
- [ ] Blog post has proper OG meta for Instagram sharing
- [ ] Bridal WhatsApp template is correctly formatted

---

## Phase 5 — Launch

### Tasks

- [ ] **P5-01** — SEO configuration
  - `src/app/layout.tsx` — base metadata
  - Per-page metadata (product pages, blog posts)
  - JSON-LD structured data:
    - `LocalBusiness` for Chippy's business
    - `Product` for each cone
    - `FAQPage` for the FAQ section
    - `BlogPosting` for blog posts
  - `sitemap.ts` — dynamic sitemap (includes all product, blog, and legal pages)
  - `robots.ts` — allow all bots including GPTBot, PerplexityBot, ClaudeBot

- [ ] **P5-02** — Legal pages (required before launch)
  - `/privacy` — Privacy Policy (India DPDP Act 2023 compliant)
    - Data collected, purpose, third-party processors, right to deletion via WhatsApp
    - Grievance officer: Chippy, +91 7561856754
  - `/terms` — Terms of Service
    - No payment gateway, COD/UPI arranged via WhatsApp
    - Storage responsibility is customer's after delivery
    - Product guarantee limited to damaged-on-arrival claims
  - `/refund-policy` — Refund and Replacement Policy
    - Damaged on arrival: unboxing video to WhatsApp within 24 hours
    - Wrong item: replacement, no video needed
    - Spoilage due to improper storage: not covered
    - Link to `/support/refund` form
  - All three pages linked in footer (small text, same row as copyright)
  - Add `FAQPage` JSON-LD to `/privacy` (common questions about data)

- [ ] **P5-03** — Refund request form (`src/app/support/refund/page.tsx`)
  - Fields: customer name, WhatsApp number, order date, product ordered, issue type, description, unboxing video (required, 100MB max client-side), additional photos (up to 5)
  - Client-side video size check before allowing submit (reject > 100MB with clear message)
  - On submit: `POST /api/refund` → creates `refundRequest` document in Sanity
  - Success message: "Your request has been submitted. Chippy will contact you on WhatsApp within a few hours."
  - Also show direct WhatsApp link as alternative

- [ ] **P5-04** — Performance audit
  - Run Lighthouse on production build
  - Fix any LCP > 2s issues (image optimization, font loading)
  - Check CLS on mobile

- [ ] **P5-05** — Vercel deployment
  - Connect GitHub repo → Vercel
  - Set all environment variables (see CLAUDE.md env section)
  - Configure custom domain `hennabyChippy.in`
  - Enable Vercel Analytics + Speed Insights

- [ ] **P5-06** — Google Search Console (GSC) setup
  - Add `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` env var
  - Verify via HTML meta tag method in `layout.tsx`
  - Submit sitemap: `https://hennabyChippy.in/sitemap.xml`
  - Set up keyword tracking for priority terms (see CLAUDE.md SEO section)
  - After launch: check GSC weekly for AI Overview citations (Performance → Search type → AI Overviews)

- [ ] **P5-07** — Sanity Studio production setup
  - Studio hosted at `/studio` or separate subdomain
  - Add Chippy as editor with limited permissions

- [ ] **P5-08** — Final validation
  ```bash
  python .agent/scripts/verify_all.py . --url https://hennabyChippy.in
  ```

### Go-Live Checklist

- [ ] All env vars set in Vercel production
- [ ] Sanity dataset: production (not development)
- [ ] Pinecone index populated (all knowledge base entries)
- [ ] WhatsApp number verified (+91 7561856754)
- [ ] Google Analytics / Vercel Analytics active
- [ ] Test full purchase flow (mobile + desktop)
- [ ] Test AI chat on 3G throttled connection
- [ ] Lighthouse score > 90 (Performance, Accessibility, SEO)
- [ ] Privacy Policy live at `/privacy`
- [ ] Terms of Service live at `/terms`
- [ ] Refund Policy live at `/refund-policy`
- [ ] Refund form live at `/support/refund`
- [ ] Legal pages linked in footer
- [ ] GSC domain verified + sitemap submitted
- [ ] JSON-LD validated: LocalBusiness, Product, FAQPage, BlogPosting
- [ ] Chippy's WhatsApp reply template ready to copy-paste

---

## File Structure (Final Target)

```
henna-by-chippy/
├── CLAUDE.md
├── .env.example
├── .env.local                    # Never commit
├── docs/
│   ├── PRD.md
│   ├── PLAN.md
│   ├── content.md               # All website copy
│   ├── ai-instructions.md       # Gemini system prompt
│   └── knowledge-base.json      # Pinecone RAG data
├── sanity/
│   ├── sanity.config.ts
│   └── schemas/
│       ├── product.ts
│       ├── bridalGallery.ts
│       ├── review.ts
│       ├── stainShowcase.ts
│       ├── post.ts              # Blog posts
│       ├── chatLog.ts           # AI session logs for analytics
│       ├── refundRequest.ts     # Refund/replacement submissions
│       └── siteSettings.ts
├── src/
│   ├── app/
│   │   ├── globals.css          # Tailwind v4 theme
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Landing page
│   │   ├── (shop)/
│   │   │   ├── shop/page.tsx
│   │   │   └── shop/[slug]/page.tsx
│   │   ├── (bridal)/
│   │   │   └── bridal/page.tsx
│   │   ├── (blog)/
│   │   │   ├── blog/page.tsx
│   │   │   └── blog/[slug]/page.tsx
│   │   ├── about/page.tsx
│   │   ├── privacy/page.tsx          # Privacy Policy (DPDP Act compliant)
│   │   ├── terms/page.tsx            # Terms of Service
│   │   ├── refund-policy/page.tsx    # Refund and Replacement Policy
│   │   ├── support/
│   │   │   └── refund/page.tsx       # Refund request form
│   │   └── api/
│   │       ├── chat/route.ts
│   │       ├── checkout/route.ts
│   │       ├── refund/route.ts       # Creates refundRequest in Sanity
│   │       ├── oembed/route.ts       # Instagram oEmbed proxy (hides token)
│   │       └── webhooks/
│   │           └── sync-review/route.ts  # Sanity webhook → Pinecone sync
│   ├── components/
│   │   ├── ui/                  # Custom animation components
│   │   │   ├── HeroGlow.tsx           # CSS radial-gradient glow + Framer Motion entrance
│   │   │   ├── FloatingNav.tsx        # Custom sticky pill nav, CSS blur
│   │   │   ├── HoverRevealCard.tsx    # CSS hover overlay card
│   │   │   ├── OrganicBackground.tsx  # CSS @keyframes gradient blobs
│   │   │   └── HennaTrail.tsx         # Canvas mouse trail
│   │   ├── shop/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   └── CartIcon.tsx
│   │   ├── chat/
│   │   │   └── StainConsultant.tsx
│   │   └── shared/
│   │       ├── StorageWarningBanner.tsx
│   │       ├── FreshnessChecker.tsx
│   │       └── WhatsAppButton.tsx
│   ├── lib/
│   │   ├── sanity/
│   │   │   ├── client.ts
│   │   │   ├── queries.ts
│   │   │   └── image.ts
│   │   ├── pinecone/
│   │   │   ├── client.ts
│   │   │   ├── search.ts
│   │   │   └── ingest.ts
│   │   ├── gemini/
│   │   │   ├── client.ts
│   │   │   └── rag.ts
│   │   └── whatsapp.ts
│   ├── store/
│   │   └── cart.ts
│   └── types/
│       └── index.ts
└── .agent/
    ├── ARCHITECTURE.md
    ├── agents/
    │   ├── henna-brand-specialist.md   # Custom agent
    │   └── [existing agents...]
    └── rules/
        └── GEMINI.md
```

---

## Dependency List

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.0.0",
    "@sanity/client": "^6.0.0",
    "@sanity/image-url": "^1.0.0",
    "next-sanity": "^9.0.0",
    "@google/generative-ai": "^0.21.0",
    "@pinecone-database/pinecone": "^3.0.0",
    "zustand": "^5.0.0",
    "framer-motion": "^11.0.0",
    "@tailwindcss/typography": "^0.5.0"
  }
}
```

---

*Document Status: Living document — update as phases complete.*
*Last Updated: March 2026*
