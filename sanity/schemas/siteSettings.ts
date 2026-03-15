import { defineType, defineField } from 'sanity'

// Singleton document — only one instance
// Controls global site settings Chippy can edit without touching code

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'storeName',
      title: 'Store Name',
      type: 'string',
      initialValue: 'Henna by Chippy',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      initialValue: 'Pure Organic Henna from the Hills of Karuvarakundu.',
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Number',
      type: 'string',
      description: 'Include country code, no spaces or dashes (e.g., 917561856754)',
      initialValue: '917561856754',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        defineField({ name: 'street', title: 'Street / Area', type: 'string' }),
        defineField({ name: 'town', title: 'Town', type: 'string', initialValue: 'Karuvarakundu' }),
        defineField({ name: 'district', title: 'District', type: 'string', initialValue: 'Malappuram' }),
        defineField({ name: 'state', title: 'State', type: 'string', initialValue: 'Kerala' }),
        defineField({ name: 'pincode', title: 'Pincode', type: 'string' }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
          description: 'Full URL including https://',
        }),
        defineField({
          name: 'instagramHandle',
          title: 'Instagram Handle',
          type: 'string',
          description: 'Without @ symbol (e.g., hennabyChippy)',
        }),
        defineField({
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url',
        }),
      ],
    }),
    defineField({
      name: 'acceptingOrders',
      title: 'Accepting Orders',
      type: 'boolean',
      description: 'Toggle off during holidays or when stock is out completely.',
      initialValue: true,
    }),
    defineField({
      name: 'dispatchDays',
      title: 'Typical Dispatch Time',
      type: 'string',
      description: 'Shown to AI and customers. E.g., "1-2 business days", "Same day for local orders".',
      initialValue: '1-2 business days',
    }),
    defineField({
      name: 'dispatchNote',
      title: 'Special Dispatch Note (Optional)',
      type: 'string',
      description: 'Any temporary note for the AI to mention. E.g., "Away for Eid — resuming orders on 5th April."',
    }),
    defineField({
      name: 'announcementBanner',
      title: 'Announcement Banner',
      type: 'object',
      description: 'Optional banner shown at the top of the site (promotions, holidays, etc.)',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Show Banner',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'message',
          title: 'Banner Message',
          type: 'string',
          description: 'e.g., "Free delivery for Malappuram orders this week! 🌿"',
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'Global SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Default Meta Title',
          type: 'string',
          initialValue: 'Henna by Chippy — Organic Henna Cones, Karuvarakundu Malappuram',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Default Meta Description',
          type: 'text',
          rows: 2,
          initialValue: 'Handmade organic henna cones from Karuvarakundu, Malappuram. No PPD, no preservatives. Nail cones ₹35, Skin cones ₹45. Order via WhatsApp.',
        }),
        defineField({
          name: 'ogImage',
          title: 'OG / Social Share Image',
          type: 'image',
          description: 'Image shown when link is shared on WhatsApp, Instagram, etc. 1200x630px',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
