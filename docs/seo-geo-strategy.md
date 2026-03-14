# SEO & GEO Strategy — Henna by Chippy

> SEO = rank on Google. GEO = get cited by AI (ChatGPT, Perplexity, Google AI Overviews, Claude).
> Both are essential. This document covers both.

---

## Part 1: SEO Strategy

### Target Keywords

#### Primary (High Intent)
| Keyword | Intent | Target Page |
|---------|--------|-------------|
| "organic henna Malappuram" | Buy / Local | Homepage |
| "natural henna cone Kerala" | Buy | Shop Page |
| "bridal henna Malappuram" | Book | Bridal Page |
| "PPD-free henna India" | Trust/Safety | Homepage / Product |
| "henna cone buy online Kerala" | Buy | Shop Page |
| "organic henna cone" | Buy | Product Detail |

#### Long-tail (Blog / FAQ)
| Keyword | Page |
|---------|------|
| "how long to keep henna on for dark stain" | Blog / FAQ |
| "why henna stain is orange instead of maroon" | Blog Post |
| "how to store henna cone at home" | Blog Post |
| "henna cone for bridal night Kerala" | Blog / Bridal |
| "safe henna for children no PPD" | Product Page / FAQ |
| "Karuvarakundu henna artist" | About Page |
| "henna delivery Malappuram" | FAQ / Product |

#### Location-based (Local SEO)
| Keyword | Page |
|---------|------|
| "henna artist Malappuram" | About / Bridal |
| "henna near me Karuvarakundu" | Local Schema |
| "bridal henna Kerala" | Bridal |
| "organic henna Kozhikode" | Shop / About |

---

### Technical SEO Implementation

#### 1. Metadata (Next.js `generateMetadata`)

Every page must have:
```tsx
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Page Title | Henna by Chippy',
    description: 'Descriptive, keyword-rich, under 160 chars',
    keywords: ['organic henna', 'Malappuram', 'PPD-free'],
    openGraph: {
      title: '...',
      description: '...',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
    },
    alternates: {
      canonical: 'https://hennabyChippy.in/...',
    },
  }
}
```

#### 2. Structured Data (JSON-LD)

**LocalBusiness** — on every page:
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Henna by Chippy",
  "description": "Handmade organic henna cones. No PPD, no preservatives.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Karuvarakundu",
    "addressRegion": "Malappuram, Kerala",
    "addressCountry": "IN"
  },
  "telephone": "+917561856754",
  "url": "https://hennabyChippy.in",
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "11.0876",
    "longitude": "76.0531"
  },
  "openingHours": "Mo-Su",
  "priceRange": "₹35 - ₹45"
}
```

**Product** — on each product page:
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Nail Henna Cone",
  "description": "Handmade organic nail henna cone...",
  "brand": { "@type": "Brand", "name": "Henna by Chippy" },
  "offers": {
    "@type": "Offer",
    "price": "35",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "seller": { "@type": "Organization", "name": "Henna by Chippy" }
  }
}
```

**FAQPage** — on FAQ sections:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long should I keep henna on?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Keep henna on for 8-12 hours for deep maroon..."
      }
    }
  ]
}
```

**BlogPosting** — on blog posts:
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "...",
  "author": { "@type": "Person", "name": "Chippy" },
  "publisher": { "@type": "Organization", "name": "Henna by Chippy" },
  "datePublished": "...",
  "image": "..."
}
```

#### 3. Sitemap & Robots

`src/app/sitemap.ts` — dynamic sitemap including all product pages, blog posts, static pages
`src/app/robots.ts` — allow all crawlers, point to sitemap

#### 4. Core Web Vitals (Technical Performance SEO)
- LCP < 2s (next/image for all product/showcase photos)
- CLS < 0.1 (set image dimensions, avoid layout shifts)
- INP < 100ms (minimal JS on page load)
- All images: WebP format, `sizes` attribute set correctly

#### 5. Canonical URLs
- Every page has `canonical` meta to prevent duplicate content

---

### On-Page SEO Rules

- **H1**: One per page, includes primary keyword
- **H2/H3**: Secondary keywords naturally included
- **Image alt text**: Descriptive, includes location when relevant
  - ✅ "Deep maroon bridal henna on hands, Malappuram"
  - ❌ "henna image 1"
- **Internal linking**: Products link to related blog posts; blog posts link to products
- **Page speed**: Under 2s on 4G throttled (measured with Lighthouse)

---

### Google Search Console (GSC) — Setup & Usage

GSC is the primary tool for monitoring both SEO performance AND Google AI Overview citations.

#### Setup Steps
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property → URL prefix → `https://henna-by-chippy.vercel.app` (update when domain is set)
3. Verify ownership via the HTML meta tag method:
   ```html
   <!-- Add to src/app/layout.tsx metadata: -->
   verification: {
     google: 'YOUR_VERIFICATION_CODE_HERE',
   }
   ```
4. Submit sitemap: `[site-url]/sitemap.xml`

#### What to Monitor in GSC

| Report | What to Look For |
|--------|-----------------|
| **Search results** | Which queries drive clicks; CTR per page |
| **AI Overviews** | Pages cited in Google AI-generated answers (GEO signal) |
| **Coverage** | Indexed pages; fix any "not indexed" errors |
| **Core Web Vitals** | LCP, INP, CLS per page — must be green |
| **Rich results** | Confirm JSON-LD (Product, FAQ, LocalBusiness) is valid |
| **Sitemaps** | Ensure sitemap is submitted and all URLs discovered |

#### GSC + GEO: AI Overview Tracking

Google Search Console now shows **"Search type: AI Overviews"** in the Performance report. This tells you:
- Which of your pages appear **inside** Google AI-generated answers
- The queries that trigger your AI Overview citations
- Click and impression data from AI Overview appearances

**How to check:**
> GSC → Performance → Search type dropdown → Select "AI Overviews"

This is the primary tool for measuring GEO success for this project. Check weekly after launch.

---

## Part 2: GEO Strategy (Generative Engine Optimization)

GEO = getting cited in AI answers (ChatGPT, Google AI Overviews, Perplexity, Claude).
AI systems cite content that is **factual, structured, authoritative, and specific**.

### GEO Principles Applied to Henna by Chippy

#### 1. Answer Questions Directly (Most Important)

AI systems look for direct, factual answers. Structure content like:

**Instead of:**
> "Our organic henna gives the best stain..."

**Write:**
> "**How long to keep henna on for deep maroon?** Apply henna and keep it on for 8-12 hours. Overnight application (10-12 hours) gives the deepest maroon stain. Remove by scraping (not washing) and avoid water for 24 hours."

Every FAQ, blog post, and product description should front-load the direct answer.

#### 2. Factual Specificity

AI cites specific, verifiable facts over vague claims:
- ✅ "Henna cones last 3-4 months when frozen at 0°C or below"
- ✅ "PPD (para-phenylenediamine) is banned in cosmetics in several EU countries"
- ✅ "Lawsone (2-Hydroxy-1,4-naphthoquinone) is the natural dye in henna leaves"
- ❌ "Our henna is very good quality"

#### 3. E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)

For Google AI Overviews and LLM citations:
- **Author byline on every blog post** — "Written by Chippy, organic henna artist, Karuvarakundu"
- **About page with credentials** — years of experience, local heritage
- **Cite facts** — mention scientific terms (lawsone, keratin, oxidation) correctly
- **No misinformation** — every claim must be accurate

#### 4. Structured Content

AI reads structured content better:
- Use **bullet points** for step-by-step instructions
- Use **tables** for comparison (organic vs chemical henna)
- Use **numbered lists** for processes
- Use **clear headings** with question-style H2s
- Write **short paragraphs** (2-3 sentences max)

#### 5. FAQ Schema for AI Overview Eligibility

Google AI Overviews heavily pull from FAQ schemas. Every FAQ on the site must have:
- `FAQPage` JSON-LD structured data
- Direct, complete answers (not "click here to read more")
- Questions that match how people actually ask AI assistants

#### 6. Multi-Platform Presence (GEO Signal)

AI systems cross-reference multiple sources:
- **Google My Business** — Create listing for "Henna by Chippy, Karuvarakundu"
- **Instagram** — Regular posts with keyword-rich captions
- **Wikipedia-style references** — Link to credible sources (e.g., Ayurveda journals about lawsone)
- **Local news/blog mentions** — Even one feature in a Kerala lifestyle blog boosts GEO signal

#### 7. GEO-Optimized Blog Post Structure

```markdown
# [Question-style H1] — e.g., "Why Does Henna Turn Orange? The Storage Secret Most People Miss"

**Quick Answer**: Henna turns orange when the cone is left outside the freezer
for more than 3 days, degrading the lawsone dye before it can bind to skin keratin.

## The Science Behind Henna Color
[2-3 sentences with specific facts]

## The 3-Day Rule: Why Freezing Matters
[Bullet point list of storage rules]

## How to Fix It Next Time
[Numbered steps]

## FAQ
**Q: Can I refreeze a henna cone?**
A: No — do not refreeze a thawed cone...

[Author: Chippy, organic henna artist since [year], Karuvarakundu, Malappuram]
```

---

### GEO Keywords to Target in AI Answers

These are questions people ask AI assistants that we want to be cited for:

| AI Question | Target Content |
|-------------|---------------|
| "How long to leave henna on for dark stain?" | FAQ + Blog post |
| "Is organic henna safe for children?" | FAQ + Product page |
| "What is PPD in henna and why avoid it?" | Blog post |
| "How to store henna cones at home?" | FAQ + Blog post |
| "Best henna in Malappuram Kerala" | Homepage + GMB |
| "How to choose henna cone for bridal?" | Bridal page |
| "Why does henna fade quickly?" | FAQ |

---

### Implementation Checklist

#### Technical
- [ ] JSON-LD for LocalBusiness, Product, FAQPage, BlogPosting on all pages
- [ ] Sitemap.ts with all pages, products, blog posts
- [ ] Robots.ts allowing all AI crawlers (Googlebot, GPTBot, PerplexityBot, ClaudeBot)
- [ ] Canonical URLs on every page
- [ ] Open Graph + Twitter Card meta on all pages
- [ ] next/image with proper alt text and sizes
- [ ] GSC HTML verification meta tag in `layout.tsx` metadata

#### Google Search Console
- [ ] GSC property created and verified (URL prefix method)
- [ ] Sitemap submitted at `[site-url]/sitemap.xml`
- [ ] Rich results test run for Product, FAQ, LocalBusiness JSON-LD
- [ ] Core Web Vitals report checked — all green
- [ ] **AI Overviews report** checked weekly (Performance → Search type → AI Overviews)

#### Content
- [ ] Each FAQ answer is complete and self-contained (no "click here")
- [ ] Blog posts have author byline with name + credentials
- [ ] Specific facts cited throughout (lawsone, PPD full name, specific timeframes)
- [ ] All product descriptions use target keywords naturally
- [ ] H1 includes primary keyword on all pages

#### Off-site
- [ ] Google My Business listing created and verified
- [ ] Instagram handle consistent (@hennabyChippy)
- [ ] WhatsApp Business profile complete with location
