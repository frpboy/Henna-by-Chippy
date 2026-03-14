import { defineType, defineField } from 'sanity'

// Stain Showcase — photos of henna stains shown below the hero on the landing page
//
// SOURCE TYPES:
// - 'chippy': Chippy uploads directly (her own work photos)
// - 'customer_review': Promoted from a customer review (photo upload, promoteToShowcase: true)
// - 'social_post': Customer's Instagram or Facebook post (promotePostToShowcase: true)
//   Rendered as an embed (Instagram oEmbed / Facebook embed) in the showcase section.
//   No image upload needed — the embed renders the original post directly.
//
// IMAGE COMPRESSION:
// All images are served via Sanity CDN. Use @sanity/image-url builder with:
//   .width(800).height(800).quality(80).format('webp').fit('crop')
// This keeps file sizes small for 4G users without a separate CDN service.

export const stainShowcase = defineType({
  name: 'stainShowcase',
  title: 'Stain Showcase',
  type: 'document',
  description: 'Photos of henna stains shown in the showcase section below the hero',
  fields: [
    defineField({
      name: 'image',
      title: 'Stain Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'e.g. "Deep maroon henna stain on palm after 10 hours, Malappuram"',
        }),
      ],
      // Not required for social_post source — the embed renders the image from Instagram/Facebook
      description: 'Required for chippy and customer_review sources. Not needed for social post embeds.',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const sourceType = (context.document as { sourceType?: string })?.sourceType
          if (sourceType === 'social_post') return true
          return value ? true : 'A photo is required for this source type.'
        }),
    }),
    defineField({
      name: 'stainType',
      title: 'Stain Type',
      type: 'string',
      options: {
        list: [
          { title: 'Hand Stain', value: 'hand' },
          { title: 'Nail Stain', value: 'nail' },
          { title: 'Arm / Full Design', value: 'arm' },
          { title: 'Feet Stain', value: 'feet' },
          { title: 'Bridal Stain', value: 'bridal' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coneUsed',
      title: 'Cone Used',
      type: 'string',
      options: {
        list: [
          { title: 'Nail Cone', value: 'nail' },
          { title: 'Skin Cone', value: 'skin' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'hoursKept',
      title: 'Hours Kept On',
      type: 'number',
      description: 'How many hours was the henna left on?',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Short caption shown under the photo (optional)',
    }),

    // ── SOURCE ────────────────────────────────────────────────────────────────

    defineField({
      name: 'sourceType',
      title: 'Photo Source',
      type: 'string',
      options: {
        list: [
          { title: "Chippy's own photo", value: 'chippy' },
          { title: 'Promoted from customer review (photo upload)', value: 'customer_review' },
          { title: "Customer's Instagram or Facebook post", value: 'social_post' },
        ],
        layout: 'radio',
      },
      initialValue: 'chippy',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fromReview',
      title: 'Source Review',
      type: 'reference',
      to: [{ type: 'review' }],
      description: 'Link to the customer review this photo came from (when source is customer review)',
      hidden: ({ document }) => document?.sourceType !== 'customer_review',
    }),
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      description: 'Shown as "Photo by [name]" or "Posted by [name]" in the showcase',
      hidden: ({ document }) =>
        document?.sourceType !== 'customer_review' && document?.sourceType !== 'social_post',
    }),

    defineField({
      name: 'socialPostUrl',
      title: 'Instagram or Facebook Post URL',
      type: 'url',
      description: 'Copy the chosen post URL from the review\'s socialPostLinks array. Must be instagram.com or facebook.com / fb.com. The frontend uses the Instagram oEmbed API or Facebook embed script to render it.',
      hidden: ({ document }) => document?.sourceType !== 'social_post',
      validation: (Rule) =>
        Rule.custom((url, context) => {
          if ((context.document as { sourceType?: string })?.sourceType !== 'social_post') return true
          if (!url) return 'Post URL is required for social post source type.'
          const allowed = ['instagram.com', 'fb.com', 'facebook.com']
          return allowed.some((d) => url.includes(d))
            ? true
            : 'Only Instagram or Facebook post URLs are accepted.'
        }),
    }),

    // ── DISPLAY ───────────────────────────────────────────────────────────────

    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show prominently in the landing page showcase',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first in the showcase',
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Newest First',
      name: 'newestFirst',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'stainType',
      media: 'image',
      subtitle: 'caption',
      sourceType: 'sourceType',
      customerName: 'customerName',
    },
    prepare({ title, media, subtitle, sourceType, customerName }) {
      const typeLabels: Record<string, string> = {
        hand: '🤚 Hand Stain',
        nail: '💅 Nail Stain',
        arm: '💪 Arm Design',
        feet: '🦶 Feet Stain',
        bridal: '💍 Bridal Stain',
      }
      const sourceLabel =
        sourceType === 'customer_review' ? `👤 ${customerName || 'Customer'}` :
        sourceType === 'social_post' ? `📱 ${customerName || 'Social post'}` :
        '📷 Chippy'
      return {
        title: typeLabels[title] || title || '(Social post)',
        media,
        subtitle: subtitle || sourceLabel,
      }
    },
  },
})
