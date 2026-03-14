import { defineType, defineField } from 'sanity'

export const bridalGallery = defineType({
  name: 'bridalGallery',
  title: 'Bridal Gallery',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title / Caption',
      type: 'string',
      description: 'Short description of the design (e.g., "Full bridal — Malappuram wedding")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Henna Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'e.g. "Deep maroon bridal henna on hands, Malappuram"',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Bridal Full', value: 'bridal-full' },
          { title: 'Bridal Half', value: 'bridal-half' },
          { title: 'Feet', value: 'feet' },
          { title: 'Nail Art', value: 'nail-art' },
          { title: 'Custom / Other', value: 'custom' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show in the landing page bridal teaser section',
      initialValue: false,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: ['Traditional', 'Contemporary', 'Arabic', 'Indo-Arabic', 'Rajasthani', 'Minimal'],
      },
    }),
    defineField({
      name: 'location',
      title: 'Location / Occasion',
      type: 'string',
      description: 'e.g., "Malappuram Wedding, 2025" (optional — don\'t include names)',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
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
      name: 'publishedDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      subtitle: 'category',
    },
  },
})
