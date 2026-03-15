import { defineType, defineField } from 'sanity'

// Active promotions Chippy can manage from Studio.
// The AI chat reads these live and mentions them to customers.

export const promotion = defineType({
  name: 'promotion',
  title: 'Promotions',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Promotion Title',
      type: 'string',
      description: 'Internal label, e.g. "Eid Sale 2025"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Toggle on to make this visible to the AI and customers.',
      initialValue: false,
    }),
    defineField({
      name: 'aiDescription',
      title: 'AI Description',
      type: 'text',
      rows: 3,
      description:
        'What the AI tells customers about this promotion. Write as if Chippy is speaking. E.g., "This week, get free delivery on all orders within Malappuram!"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'discountType',
      title: 'Discount Type',
      type: 'string',
      options: {
        list: [
          { title: 'Free delivery', value: 'free_delivery' },
          { title: 'Percentage off', value: 'percentage' },
          { title: 'Fixed amount off', value: 'fixed' },
          { title: 'Free item / bonus', value: 'bonus' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'radio',
      },
      initialValue: 'free_delivery',
    }),
    defineField({
      name: 'discountValue',
      title: 'Discount Value',
      type: 'string',
      description: 'Optional. E.g., "10%" or "₹20" or "1 free nail cone on orders above ₹200".',
    }),
    defineField({
      name: 'applicableTo',
      title: 'Applicable To',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Nail Cone', value: 'nail' },
          { title: 'Skin Cone', value: 'skin' },
          { title: 'All Products', value: 'all' },
        ],
      },
      initialValue: ['all'],
    }),
    defineField({
      name: 'validFrom',
      title: 'Valid From',
      type: 'datetime',
      description: 'Leave empty to start immediately.',
    }),
    defineField({
      name: 'validUntil',
      title: 'Valid Until',
      type: 'datetime',
      description: 'Leave empty if there is no expiry.',
    }),
    defineField({
      name: 'minimumOrderValue',
      title: 'Minimum Order Value (₹)',
      type: 'number',
      description: 'Optional. Set if the promotion has a minimum spend requirement.',
    }),
  ],
  orderings: [
    {
      title: 'Active first',
      name: 'activeFirst',
      by: [{ field: 'active', direction: 'desc' }, { field: 'validUntil', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      active: 'active',
      validUntil: 'validUntil',
    },
    prepare({ title, active, validUntil }) {
      const status = active ? '🟢 Active' : '⚪ Inactive'
      const expiry = validUntil ? ` · Expires ${new Date(validUntil).toLocaleDateString('en-IN')}` : ''
      return { title, subtitle: `${status}${expiry}` }
    },
  },
})
