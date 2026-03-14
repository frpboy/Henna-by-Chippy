import { defineType, defineField } from 'sanity'

// Post-purchase review schema
// Reviews are collected via a form link sent to customers after delivery
// Chippy moderates in Sanity Studio before they appear publicly
//
// MEDIA LIMITS (enforced client-side in the review form, noted here for reference):
//   Photos  : up to 10, total 200MB across all photos
//   Videos  : up to 2 direct uploads, total 50MB across both
//   Social  : up to 5 Instagram or Facebook post links
//
// REVIEW TEXT:
//   No minimum, max 2000 characters. Emojis allowed (non-NSFW, non-flagged).
//   No custom emoji picker in the form — customers type or paste naturally.
//
// MEDIA FLOW:
// 1. Customer submits review with photos/videos/links via the website form
// 2. Photos and videos stored in Sanity Assets (CDN with WebP/compression)
// 3. Chippy reviews in Studio → sets approved: true → review goes public
// 4. If promoteToShowcase: true → Chippy creates a stainShowcase entry referencing this review
// 5. If promotePostToShowcase: true → Chippy picks one of the social links for the showcase embed
// 6. On publish, Sanity webhook triggers /api/webhooks/sync-review → Pinecone upsert

export const review = defineType({
  name: 'review',
  title: 'Customer Reviews',
  type: 'document',
  fields: [
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      description: 'First name + last initial (e.g., "Priya K.")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'City/district only (e.g., "Kozhikode", "Thrissur")',
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      options: {
        list: [
          { title: '⭐ 1 — Poor', value: 1 },
          { title: '⭐⭐ 2 — Below Average', value: 2 },
          { title: '⭐⭐⭐ 3 — Average', value: 3 },
          { title: '⭐⭐⭐⭐ 4 — Good', value: 4 },
          { title: '⭐⭐⭐⭐⭐ 5 — Excellent', value: 5 },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'reviewText',
      title: 'Review Text',
      type: 'text',
      rows: 4,
      // No minimum. Max 2000 characters. Emojis are fine — Chippy moderates before approving.
      description: 'Optional. Max 2000 characters. Emojis welcome.',
      validation: (Rule) => Rule.max(2000),
    }),

    // ── PHOTOS ────────────────────────────────────────────────────────────────

    defineField({
      name: 'stainPhotos',
      title: 'Stain Photos (Customer)',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'e.g. "Maroon nail stain after 10 hours with Nail Cone"',
            }),
            defineField({
              name: 'stainType',
              title: 'Stain Type in This Photo',
              type: 'string',
              options: {
                list: [
                  { title: 'Hand Stain', value: 'hand' },
                  { title: 'Nail Stain', value: 'nail' },
                  { title: 'Arm / Full Design', value: 'arm' },
                  { title: 'Feet Stain', value: 'feet' },
                  { title: 'Bridal Stain', value: 'bridal' },
                ],
                layout: 'dropdown',
              },
            }),
          ],
        },
      ],
      options: { layout: 'grid' },
      // Max 10 photos. Total size across all photos must be under 200MB (enforced client-side).
      // Served as WebP via Sanity CDN with ?w=800&q=80&fm=webp for display.
      validation: (Rule) => Rule.max(10),
      description: 'Up to 10 photos. Total size across all must be under 200MB (client-side check). Served as compressed WebP via Sanity CDN.',
    }),

    // ── VIDEOS ────────────────────────────────────────────────────────────────

    defineField({
      name: 'stainVideos',
      title: 'Stain Videos (Customer Upload)',
      type: 'array',
      of: [
        {
          type: 'file',
          options: { accept: 'video/*' },
          fields: [
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Short description of what this video shows',
            }),
          ],
        },
      ],
      // Max 2 videos. Total size across both must be under 50MB (enforced client-side).
      // Sanity stores the raw file — no transcoding. For playback, use <video> with Sanity file URL.
      validation: (Rule) => Rule.max(2),
      description: 'Up to 2 video uploads. Total size across both must be under 50MB (client-side check). Formats: mp4, mov, webm.',
    }),

    defineField({
      name: 'videoLink',
      title: 'External Video Link (Optional)',
      type: 'url',
      description: 'Link to an Instagram Reel, YouTube Short, or TikTok showing the result. Use this instead of uploading if the video is already posted online.',
    }),

    // ── SOCIAL POST LINKS ─────────────────────────────────────────────────────

    defineField({
      name: 'socialPostLinks',
      title: 'Instagram or Facebook Post Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'url',
              title: 'Post URL',
              type: 'url',
              validation: (Rule) =>
                Rule.uri({ allowRelative: false }).custom((url) => {
                  if (!url) return 'URL is required.'
                  const allowed = ['instagram.com', 'fb.com', 'facebook.com']
                  return allowed.some((d) => url.includes(d))
                    ? true
                    : 'Only Instagram (instagram.com) or Facebook (facebook.com / fb.com) links are accepted.'
                }),
            }),
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Facebook', value: 'facebook' },
                ],
                layout: 'radio',
              },
            }),
          ],
          preview: {
            select: { url: 'url', platform: 'platform' },
            prepare({ url, platform }) {
              const icon = platform === 'instagram' ? '📸' : '👤'
              return { title: `${icon} ${url || 'No URL'}` }
            },
          },
        },
      ],
      // Max 5 links. Strictly Instagram or Facebook only (validated per item above).
      validation: (Rule) => Rule.max(5),
      description: 'Up to 5 Instagram or Facebook post links about this henna. Other platforms are not accepted. Chippy can promote any of these to the Stain Showcase as an embed.',
    }),

    defineField({
      name: 'coneUsed',
      title: 'Cone Used',
      type: 'string',
      options: {
        list: [
          { title: 'Nail Cone', value: 'nail' },
          { title: 'Skin Cone', value: 'skin' },
          { title: 'Both', value: 'both' },
        ],
        layout: 'radio',
      },
      // Required for Pinecone metadata — AI uses this to answer "show me nail stain examples"
      description: 'Which cone the customer used. Sent to Pinecone as metadata for AI photo retrieval.',
    }),

    defineField({
      name: 'hoursKept',
      title: 'Hours Henna Was Kept On',
      type: 'number',
      description: 'How long the customer kept the henna on. Used to contextualize the stain result.',
      validation: (Rule) => Rule.min(1).max(24),
    }),

    // ── SHOWCASE PROMOTION ────────────────────────────────────────────────────

    defineField({
      name: 'promoteToShowcase',
      title: 'Promote Photo(s) to Stain Showcase',
      type: 'boolean',
      description: 'When approved, Chippy can promote customer photos to the showcase section. Create a stainShowcase entry referencing this review.',
      initialValue: false,
    }),

    defineField({
      name: 'promotePostToShowcase',
      title: 'Promote a Social Post to Showcase',
      type: 'boolean',
      description: 'If the customer has shared an Instagram or Facebook post link, Chippy can embed it in the Stain Showcase. Create a stainShowcase entry with sourceType: social_post and paste the chosen link URL.',
      initialValue: false,
    }),

    defineField({
      name: 'allowAiUsage',
      title: 'Allow AI to Share This Photo',
      type: 'boolean',
      description: 'If true, the AI assistant can show this photo to users asking for real stain examples. Customer must consent at submission.',
      initialValue: false,
    }),

    // ── ORDER CONTEXT ─────────────────────────────────────────────────────────

    defineField({
      name: 'productPurchased',
      title: 'Product Purchased',
      type: 'string',
      options: {
        list: [
          { title: 'Nail Cone', value: 'nail' },
          { title: 'Skin Cone', value: 'skin' },
          { title: 'Both', value: 'both' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'usageContext',
      title: 'Usage Context',
      type: 'string',
      options: {
        list: [
          { title: 'Personal Use', value: 'personal' },
          { title: 'Wedding / Bridal', value: 'bridal' },
          { title: 'Festival / Celebration', value: 'festival' },
          { title: 'Gift', value: 'gift' },
        ],
        layout: 'dropdown',
      },
    }),

    // ── MODERATION ────────────────────────────────────────────────────────────

    defineField({
      name: 'approved',
      title: 'Approved to Publish',
      type: 'boolean',
      description: 'Only approved reviews appear on the public website. Approving also triggers Pinecone sync via webhook.',
      initialValue: false,
    }),
    defineField({
      name: 'featured',
      title: 'Featured Review',
      type: 'boolean',
      description: 'Show in the hero testimonials on the landing page',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Review Date',
      type: 'datetime',
    }),
    defineField({
      name: 'internalNotes',
      title: 'Internal Notes (Chippy only)',
      type: 'text',
      rows: 2,
      description: 'Private notes, never shown publicly',
    }),
  ],
  preview: {
    select: {
      title: 'customerName',
      subtitle: 'reviewText',
      media: 'stainPhotos.0',
      approved: 'approved',
      rating: 'rating',
      photos: 'stainPhotos',
      videos: 'stainVideos',
      links: 'socialPostLinks',
    },
    prepare({ title, subtitle, media, approved, rating, photos, videos, links }) {
      const stars = '⭐'.repeat(rating || 0)
      const counts = [
        (photos?.length ?? 0) > 0 ? `📷×${photos.length}` : '',
        (videos?.length ?? 0) > 0 ? `🎥×${videos.length}` : '',
        (links?.length ?? 0) > 0 ? `📱×${links.length}` : '',
      ].filter(Boolean).join(' ')
      return {
        title: `${approved ? '✅' : '⏳'} ${title || 'Anonymous'} ${stars}${counts ? ' ' + counts : ''}`,
        subtitle: subtitle ? subtitle.substring(0, 80) + (subtitle.length > 80 ? '...' : '') : 'No review text',
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Newest First',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Highest Rating',
      name: 'ratingDesc',
      by: [{ field: 'rating', direction: 'desc' }],
    },
  ],
})
