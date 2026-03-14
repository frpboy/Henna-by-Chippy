import { defineType, defineField } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Henna Cones',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Cone Type',
      type: 'string',
      options: {
        list: [
          { title: 'Nail Cone', value: 'nail' },
          { title: 'Skin Cone', value: 'skin' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (₹)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'weight',
      title: 'Weight',
      type: 'string',
      description: 'e.g. "10-15g" or "25-30g"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'stockCount',
      title: 'Stock Count',
      type: 'number',
      description: 'Set to 0 when out of stock',
      initialValue: 0,
    }),
    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the image for accessibility',
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Additional Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 2,
      description: 'Used on product cards. Keep under 100 characters.',
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'ingredients',
      title: 'Ingredients',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: ['Henna Powder', 'Water', 'Essential Oil', 'Sugar'],
      description: 'These should never change — this is our core promise.',
    }),
    defineField({
      name: 'howToUse',
      title: 'How to Use Steps',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'storageNote',
      title: 'Storage Note',
      type: 'string',
      initialValue: 'Store in freezer immediately. Shelf life: 3-4 months frozen.',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      description: 'Show on landing page hero section',
      initialValue: false,
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
      group: 'seo',
    }),
  ],
  groups: [
    { name: 'seo', title: 'SEO' },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      subtitle: 'price',
    },
    prepare({ title, media, subtitle }) {
      return {
        title,
        media,
        subtitle: subtitle ? `₹${subtitle}` : 'No price set',
      }
    },
  },
})
