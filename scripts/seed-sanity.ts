/**
 * Henna by Chippy — Full Sanity Seeder
 *
 * Creates all initial content: products, siteSettings, reviews, bridal gallery,
 * blog posts, and a sample promotion.
 *
 * Images must be uploaded manually via Sanity Studio — they cannot be seeded from a script.
 * Safe to re-run — uses createOrReplace with fixed IDs.
 *
 * Usage:
 *   npx tsx scripts/seed-sanity.ts
 *   npx tsx scripts/seed-sanity.ts --dry-run
 */

import { createClient } from '@sanity/client'
import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '..', '.env.local') })

const isDryRun = process.argv.includes('--dry-run')

const missing = ['NEXT_PUBLIC_SANITY_PROJECT_ID', 'SANITY_API_TOKEN'].filter(
  (k) => !process.env[k],
)
if (missing.length > 0) {
  console.error(`Missing env vars: ${missing.join(', ')}`)
  process.exit(1)
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// ── Helper: portable text block ───────────────────────────────────────────────

function block(text: string, style = 'normal', key?: string) {
  return {
    _type: 'block',
    _key: key ?? `k${Math.random().toString(36).slice(2, 8)}`,
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: 's1', text, marks: [] }],
  }
}

// ── Products ─────────────────────────────────────────────────────────────────

const products = [
  {
    _id: 'product-nail-cone',
    _type: 'product',
    name: 'Nail Cone',
    slug: { _type: 'slug', current: 'nail-cone' },
    type: 'nail',
    variant: 'nail',
    price: 35,
    weight: '10-15g',
    shortDescription: '100% natural henna cone for nail art. No PPD, no preservatives.',
    inStock: true,
    stockCount: 50,
    ingredients: ['Henna Powder', 'Water', 'Essential Oil', 'Sugar'],
    howToUse: [
      'Apply henna onto nails in your desired pattern.',
      'Leave on for 8-12 hours for a deep stain.',
      'Remove dried henna and avoid water for 24 hours.',
      'Store unused cone in freezer immediately.',
    ],
    storageNote: 'Store in freezer immediately. Shelf life: 3-4 months frozen.',
    featured: true,
    seoTitle: 'Natural Henna Nail Cone — Henna by Chippy | Karuvarakundu, Malappuram',
    seoDescription:
      'Handmade organic henna nail cone, 10-15g. No PPD, no chemicals. Deep maroon stain in 8-12 hours. Rs.35. Ships across Kerala.',
  },
  {
    _id: 'product-skin-cone',
    _type: 'product',
    name: 'Skin Cone',
    slug: { _type: 'slug', current: 'skin-cone' },
    type: 'skin',
    variant: 'skin',
    price: 45,
    weight: '25-30g',
    shortDescription: '100% natural henna cone for bridal and skin designs. No PPD.',
    inStock: true,
    stockCount: 40,
    ingredients: ['Henna Powder', 'Water', 'Essential Oil', 'Sugar'],
    howToUse: [
      'Apply henna to clean, dry skin.',
      'Keep on for 8-12 hours for best results.',
      'Gently scrape off dried henna. Do not wash.',
      'Avoid water and soap for 24 hours after removal.',
      'Store unused cone in freezer immediately.',
    ],
    storageNote: 'Store in freezer immediately. Shelf life: 3-4 months frozen.',
    featured: true,
    seoTitle: 'Natural Henna Skin Cone — Henna by Chippy | Karuvarakundu, Malappuram',
    seoDescription:
      'Handmade organic henna skin cone, 25-30g. Perfect for bridal mehndi and body art. No PPD. Deep stain in 8-12 hours. Rs.45. Ships across Kerala.',
  },
]

// ── Site Settings ─────────────────────────────────────────────────────────────

const siteSettings = [
  {
    _id: 'siteSettings',
    _type: 'siteSettings',
    storeName: 'Henna by Chippy',
    tagline: 'Pure Organic Henna from the Hills of Karuvarakundu.',
    whatsappNumber: '917561856754',
    address: {
      town: 'Karuvarakundu',
      district: 'Malappuram',
      state: 'Kerala',
    },
    socialLinks: {
      instagramHandle: 'hennabyChippy',
    },
    acceptingOrders: true,
    dispatchDays: '1-2 business days',
    announcementBanner: { enabled: false, message: '' },
    seo: {
      metaTitle: 'Henna by Chippy — Organic Henna Cones, Karuvarakundu Malappuram',
      metaDescription:
        'Handmade organic henna cones from Karuvarakundu, Malappuram. No PPD, no preservatives. Nail cones Rs.35, Skin cones Rs.45. Order via WhatsApp.',
    },
  },
]

// ── Customer Reviews ──────────────────────────────────────────────────────────

const reviews = [
  {
    _id: 'review-priya-k',
    _type: 'review',
    customerName: 'Priya K.',
    location: 'Kozhikode',
    rating: 5,
    reviewText:
      'I have been using different henna cones for years and this is by far the best I have tried. The stain came out deep maroon after just 10 hours. No chemicals smell at all. Will definitely order again!',
    coneUsed: 'nail',
    hoursKept: 10,
    productPurchased: 'nail',
    usageContext: 'personal',
    approved: true,
    featured: true,
    allowAiUsage: true,
    publishedAt: '2025-01-10T10:00:00Z',
  },
  {
    _id: 'review-fatima-n',
    _type: 'review',
    customerName: 'Fatima N.',
    location: 'Malappuram',
    rating: 5,
    reviewText:
      'Used the skin cone for my cousin\'s wedding and everyone was asking where I got it from. The stain lasted 10 days even with daily washing. Chippy\'s cones are the real deal. 100% natural and you can tell.',
    coneUsed: 'skin',
    hoursKept: 12,
    productPurchased: 'skin',
    usageContext: 'bridal',
    approved: true,
    featured: true,
    allowAiUsage: true,
    publishedAt: '2025-01-18T14:00:00Z',
  },
  {
    _id: 'review-aiswarya-r',
    _type: 'review',
    customerName: 'Aiswarya R.',
    location: 'Thrissur',
    rating: 4,
    reviewText:
      'Ordered both nail and skin cones for Onam. The skin cone gave a beautiful deep stain. Nail cone was also good but I only kept it for 8 hours so the color was a bit lighter. My fault, not the product! Next time I will keep it longer.',
    coneUsed: 'both',
    hoursKept: 10,
    productPurchased: 'both',
    usageContext: 'festival',
    approved: true,
    featured: false,
    allowAiUsage: true,
    publishedAt: '2025-01-25T09:00:00Z',
  },
  {
    _id: 'review-zainab-m',
    _type: 'review',
    customerName: 'Zainab M.',
    location: 'Calicut',
    rating: 5,
    reviewText:
      'Got this as a gift for Eid. The packaging was clean and the cone was still perfectly fresh because I kept it in the freezer as instructed. Applied it for my bridal mehndi and the color is stunning. Thank you Chippy!',
    coneUsed: 'skin',
    hoursKept: 11,
    productPurchased: 'skin',
    usageContext: 'bridal',
    approved: true,
    featured: true,
    allowAiUsage: true,
    publishedAt: '2025-02-03T16:00:00Z',
  },
  {
    _id: 'review-nithya-s',
    _type: 'review',
    customerName: 'Nithya S.',
    location: 'Ernakulam',
    rating: 4,
    reviewText:
      'Delivery took 2 days to reach Ernakulam but the cone was still good as I put it in the freezer the moment it arrived. Stain is rich and dark. I appreciate that there are no PPD chemicals. My skin is sensitive and this was completely fine.',
    coneUsed: 'nail',
    hoursKept: 8,
    productPurchased: 'nail',
    usageContext: 'personal',
    approved: true,
    featured: false,
    allowAiUsage: true,
    publishedAt: '2025-02-14T11:00:00Z',
  },
  {
    _id: 'review-reshma-a',
    _type: 'review',
    customerName: 'Reshma A.',
    location: 'Palakkad',
    rating: 5,
    reviewText:
      'Bought three skin cones. Applied one and froze the other two. The stain is exactly the deep maroon I was looking for. All natural ingredients, you can actually smell the essential oil. Nothing artificial. Highly recommend!',
    coneUsed: 'skin',
    hoursKept: 12,
    productPurchased: 'skin',
    usageContext: 'personal',
    approved: true,
    featured: false,
    allowAiUsage: true,
    publishedAt: '2025-02-22T13:00:00Z',
  },
]

// ── Bridal Gallery ────────────────────────────────────────────────────────────
// Images must be added in Studio. These are metadata-only placeholders.

const bridalGallery = [
  {
    _id: 'bridal-001',
    _type: 'bridalGallery',
    title: 'Full bridal, Malappuram wedding',
    category: 'bridal-full',
    tags: ['Traditional', 'Indo-Arabic'],
    location: 'Malappuram, 2025',
    featured: true,
    order: 1,
  },
  {
    _id: 'bridal-002',
    _type: 'bridalGallery',
    title: 'Bridal feet design, Kozhikode',
    category: 'feet',
    tags: ['Traditional'],
    location: 'Kozhikode, 2025',
    featured: true,
    order: 2,
  },
  {
    _id: 'bridal-003',
    _type: 'bridalGallery',
    title: 'Arabic style half bridal',
    category: 'bridal-half',
    tags: ['Arabic', 'Contemporary'],
    location: 'Malappuram, 2025',
    featured: true,
    order: 3,
  },
  {
    _id: 'bridal-004',
    _type: 'bridalGallery',
    title: 'Minimal nail art design',
    category: 'nail-art',
    tags: ['Minimal', 'Contemporary'],
    featured: false,
    order: 4,
  },
  {
    _id: 'bridal-005',
    _type: 'bridalGallery',
    title: 'Full bridal arm and feet, Calicut',
    category: 'bridal-full',
    tags: ['Traditional', 'Rajasthani'],
    location: 'Calicut, 2024',
    featured: false,
    order: 5,
  },
]

// ── Blog Posts (Chippy's Stories) ─────────────────────────────────────────────

const posts = [
  {
    _id: 'post-why-freezer',
    _type: 'post',
    title: 'Why I Keep My Henna in the Freezer',
    slug: { _type: 'slug', current: 'why-keep-henna-in-freezer' },
    excerpt: 'The one thing customers always ask me: why does henna need to go in the freezer? Here is the real reason, and what happens when you skip this step.',
    category: 'tips',
    tags: ['storage', 'organic', 'freshness'],
    publishedAt: '2025-01-05T08:00:00Z',
    featured: true,
    seoTitle: 'Why Keep Henna in the Freezer? — Henna by Chippy',
    seoDescription: 'Henna spoils outside the freezer in just 3 days. Learn why storing it correctly makes the difference between a deep maroon stain and an orange one.',
    body: [
      block('When I first started making henna cones at home, my mother told me: keep it cold. I did not fully understand why at the time. I just did what she said.', 'normal', 'p1'),
      block('Later I understood. Natural henna has no preservatives. Nothing artificial to stop it from breaking down. The moment you expose it to warm temperatures, the active compound in henna (lawsone) starts to weaken. After 3 days outside the freezer, the stain quality drops noticeably. After a week, it is gone.', 'normal', 'p2'),
      block('What Happens When You Skip the Freezer', 'h2', 'h1'),
      block('The stain turns orange instead of deep maroon. Customers sometimes message me saying the color was not what they expected. The first question I ask is: where did you store the cone? Nine times out of ten, it was left on a shelf or in a bag.', 'normal', 'p3'),
      block('Orange stain is not a bad product. It is a warm product. The lawsone is still there, just weaker. You can still get some color, but not the deep result you want.', 'normal', 'p4'),
      block('What To Do When It Arrives', 'h2', 'h2'),
      block('The moment your order arrives, put it in the freezer. Not in the fridge. The freezer. It can stay there for up to 3-4 months without any quality loss. When you are ready to use it, take it out 30 minutes before applying so it softens a little.', 'normal', 'p5'),
      block('This is the single most important thing I tell every customer. The product I send is always fresh. What you do with it after that makes all the difference.', 'normal', 'p6'),
    ],
  },
  {
    _id: 'post-orange-stain',
    _type: 'post',
    title: 'Why Your Henna Stain Turned Orange',
    slug: { _type: 'slug', current: 'why-henna-stain-turned-orange' },
    excerpt: 'You kept the henna on for hours, removed it carefully, waited. And the stain is orange. Here is exactly why that happens and what you can do next time.',
    category: 'tips',
    tags: ['stain', 'tips', 'organic', 'storage'],
    publishedAt: '2025-01-20T08:00:00Z',
    featured: false,
    seoTitle: 'Why Is My Henna Stain Orange? — Henna by Chippy',
    seoDescription: 'Orange henna stain usually means the product got warm before use, or it was washed too soon. Learn how to get a deep maroon result every time.',
    body: [
      block('An orange henna stain is one of the most common things people message me about. Let me explain what is happening and how to avoid it.', 'normal', 'p1'),
      block('Reason 1: The Cone Was Not Stored Properly', 'h2', 'h1'),
      block('Natural henna is temperature sensitive. If the cone spent more than 3 days outside the freezer before you used it, the staining compound (lawsone) weakens. The result is a lighter, more orange color. This is the most common reason.', 'normal', 'p2'),
      block('Reason 2: You Did Not Keep It On Long Enough', 'h2', 'h2'),
      block('Henna needs at least 8 hours to transfer properly to the skin. If you removed it after 3 or 4 hours, the stain will be light. Try to keep it on overnight. 10 to 12 hours gives the best result.', 'normal', 'p3'),
      block('Reason 3: You Washed It Too Soon', 'h2', 'h3'),
      block('After removing dried henna, avoid water and soap for at least 24 hours. The stain continues to develop during this time. Washing too soon stops the process early.', 'normal', 'p4'),
      block('The stain also darkens gradually over 24-48 hours after removal. What looks orange on day one often deepens to a rich maroon by day two.', 'normal', 'p5'),
      block('How to Get a Deep Maroon Stain', 'h2', 'h4'),
      block('Keep the cone frozen until use. Apply to clean dry skin. Leave on 10-12 hours. Scrape off dry, do not wash. No soap or water for 24 hours. That is all there is to it.', 'normal', 'p6'),
    ],
  },
  {
    _id: 'post-how-long-keep-on',
    _type: 'post',
    title: 'How Long Should You Keep Henna On?',
    slug: { _type: 'slug', current: 'how-long-to-keep-henna-on' },
    excerpt: 'The most searched question about henna: how many hours do you actually need? I will give you the honest answer based on what I have seen with real customers.',
    category: 'tips',
    tags: ['tips', 'stain', 'application'],
    publishedAt: '2025-02-01T08:00:00Z',
    featured: false,
    seoTitle: 'How Long to Keep Henna On for Dark Stain — Henna by Chippy',
    seoDescription: 'For a deep maroon henna stain, keep it on for 8-12 hours. Less time means a lighter result. Here is what actually happens hour by hour.',
    body: [
      block('People ask me this all the time. There is a short answer and a long answer.', 'normal', 'p1'),
      block('Short answer: 8 to 12 hours.', 'normal', 'p2'),
      block('Long answer: it depends on what result you want.', 'normal', 'p3'),
      block('What Happens Hour by Hour', 'h2', 'h1'),
      block('The first 2-3 hours: the henna paste is wet and transferring to the skin. The color you see is mostly the paste itself, not the actual stain.', 'normal', 'p4'),
      block('Hours 4-6: the paste starts drying. The lawsone (staining compound) is bonding with your skin cells. The real stain is forming under the dried paste.', 'normal', 'p5'),
      block('Hours 8-12: this is where deep stains happen. The longer you keep it on during this window, the richer the result. If you can sleep with it on, do that.', 'normal', 'p6'),
      block('After 12 hours: there is not much more to gain. The skin has absorbed what it will absorb. You can remove it.', 'normal', 'p7'),
      block('What About 4 or 6 Hours?', 'h2', 'h2'),
      block('You will get a stain, but it will be lighter. More of a red-brown than a deep maroon. If you are in a hurry, 6 hours is the minimum I recommend.', 'normal', 'p8'),
      block('After Removal', 'h2', 'h3'),
      block('Scrape off the dry paste gently. Do not wash. Wait 24 hours before water touches the area. The stain keeps developing during this time and will darken noticeably.', 'normal', 'p9'),
    ],
  },
  {
    _id: 'post-ingredients',
    _type: 'post',
    title: "What's Actually in My Henna Cones",
    slug: { _type: 'slug', current: 'ingredients-in-henna-cones' },
    excerpt: 'Four ingredients. That is all. No chemicals, no black henna, no PPD. Here is what I put in every cone and why each one is there.',
    category: 'science',
    tags: ['ingredients', 'organic', 'PPD-free', 'natural'],
    publishedAt: '2025-02-15T08:00:00Z',
    featured: true,
    seoTitle: 'What Is in Organic Henna Cones? Ingredients Explained — Henna by Chippy',
    seoDescription: 'Chippy\'s henna cones contain only 4 ingredients: henna powder, water, essential oil, and sugar. No PPD, no chemicals, no preservatives. Here is why.',
    body: [
      block('I make every cone myself. Four ingredients. That is all I use, and I want to explain exactly why.', 'normal', 'p1'),
      block('1. Henna Powder', 'h2', 'h1'),
      block('This is the base. I use pure lawsonia inermis powder, sourced carefully. The quality of the powder decides the quality of the stain. I do not mix it with anything to extend it or change the color.', 'normal', 'p2'),
      block('2. Water', 'h2', 'h2'),
      block('Clean water to mix the paste to the right consistency. Nothing added to it.', 'normal', 'p3'),
      block('3. Essential Oil', 'h2', 'h3'),
      block('This is the most important addition after the henna itself. Essential oils like eucalyptus or cajeput contain terpenes, which help the lawsone penetrate deeper into the skin. This is what gives you a darker, longer-lasting stain. It is also what gives natural henna that familiar earthy smell.', 'normal', 'p4'),
      block('4. Sugar', 'h2', 'h4'),
      block('Sugar is a natural binder. It helps the paste stick to the skin while drying, so it stays in place and does not crack off too early. It also helps keep the paste moist longer.', 'normal', 'p5'),
      block('What I Do Not Use', 'h2', 'h5'),
      block('No PPD (para-phenylenediamine). This is the chemical in "black henna" that causes skin reactions and sometimes permanent scarring. It is banned in cosmetic use in many countries, but you still see it in low-quality cones. My cones have none of it.', 'normal', 'p6'),
      block('No preservatives, no synthetic fragrance, no metallic salts. Just the four ingredients above.', 'normal', 'p7'),
      block('If you have sensitive skin or have had a reaction to henna before, it was almost certainly the PPD in a cheap cone, not the henna itself. My cones are safe for sensitive skin.', 'normal', 'p8'),
    ],
  },
]

// ── Promotions ────────────────────────────────────────────────────────────────

const promotions = [
  {
    _id: 'promo-welcome',
    _type: 'promotion',
    title: 'Welcome Offer (Template)',
    active: false,
    aiDescription: 'This week, get free delivery on all orders within Malappuram district! No minimum order value.',
    discountType: 'free_delivery',
    applicableTo: ['all'],
    minimumOrderValue: 0,
  },
]

// ── All documents ─────────────────────────────────────────────────────────────

const allDocuments = [
  ...products,
  ...siteSettings,
  ...reviews,
  ...bridalGallery,
  ...posts,
  ...promotions,
]

// ── Run ───────────────────────────────────────────────────────────────────────

async function main() {
  const groups = [
    { name: 'Products', docs: products },
    { name: 'Site Settings', docs: siteSettings },
    { name: 'Reviews', docs: reviews },
    { name: 'Bridal Gallery', docs: bridalGallery },
    { name: 'Blog Posts', docs: posts },
    { name: 'Promotions', docs: promotions },
  ]

  console.log(`\nHenna by Chippy — Full Sanity Seeder`)
  console.log(`Dataset  : ${process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'}`)
  console.log(`Mode     : ${isDryRun ? 'DRY RUN (no writes)' : 'LIVE'}`)
  console.log(`Documents: ${allDocuments.length} total`)
  console.log(`─────────────────────────────────────`)

  for (const group of groups) {
    console.log(`\n${group.name} (${group.docs.length})`)
    for (const doc of group.docs) {
      const label = (doc as { title?: string; name?: string })?.title
        ?? (doc as { name?: string })?.name
        ?? doc._id
      console.log(`  ${isDryRun ? '[dry] ' : ''}${doc._id}`)

      if (!isDryRun) {
        try {
          await client.createOrReplace(doc)
          console.log(`    ✓ ${label}`)
        } catch (err) {
          console.error(`    ✗ Failed: ${doc._id}`, err)
          process.exit(1)
        }
      }
    }
  }

  console.log(`\n${'─'.repeat(37)}`)
  if (isDryRun) {
    console.log(`Dry run complete. No writes made.`)
    console.log(`Run without --dry-run to seed for real.`)
  } else {
    console.log(`All ${allDocuments.length} documents seeded.`)
    console.log(``)
    console.log(`Next steps in Studio (http://localhost:3000/studio):`)
    console.log(`  1. Upload product images to Nail Cone and Skin Cone`)
    console.log(`  2. Upload bridal photos to the 5 Bridal Gallery entries`)
    console.log(`  3. Add featured images to blog posts`)
    console.log(`  4. Toggle a Promotion to "Active" when you run an offer`)
    console.log(`  5. Add your Instagram handle to Site Settings social links`)
  }
  console.log(``)
}

main().catch((err) => { console.error(err); process.exit(1) })
