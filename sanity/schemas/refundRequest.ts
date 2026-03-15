import { defineField, defineType } from 'sanity'

// Refund / Replacement Request
// Customer submits this via /support/refund form on the website.
// Unboxing video is REQUIRED for ALL claims — no exceptions.
// Chippy reviews in Studio and updates status.

export default defineType({
  name: 'refundRequest',
  title: 'Refund or Replacement Requests',
  type: 'document',
  fields: [
    // ── CUSTOMER INFO ─────────────────────────────────────────────────────────

    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Number',
      type: 'string',
      description: 'Include country code, e.g. 919876543210',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'orderDate',
      title: 'Approximate Order Date',
      type: 'date',
    }),

    defineField({
      name: 'productOrdered',
      title: 'Product Ordered',
      type: 'string',
      options: {
        list: [
          { title: 'Nail Cone (10-15g, ₹35)', value: 'nail' },
          { title: 'Skin Cone (25-30g, ₹45)', value: 'skin' },
          { title: 'Both', value: 'both' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),

    // ── ISSUE DETAILS ─────────────────────────────────────────────────────────

    defineField({
      name: 'issueType',
      title: 'Issue Type',
      type: 'string',
      options: {
        list: [
          { title: 'Damaged on arrival', value: 'damaged_arrival' },
          { title: 'Wrong item sent', value: 'wrong_item' },
          { title: 'Missing item', value: 'missing_item' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'issueDescription',
      title: 'Issue Description',
      type: 'text',
      rows: 4,
      description: 'Optional. Max 500 characters.',
      validation: (Rule) => Rule.max(500),
    }),

    // ── MEDIA ─────────────────────────────────────────────────────────────────

    defineField({
      name: 'unboxingVideo',
      title: 'Unboxing Video',
      type: 'file',
      options: { accept: 'video/*' },
      // Required for ALL claims — no video means no replacement or refund.
      // Client-side enforces 100MB max.
      description:
        'Required for all claims. Max 100MB. Customer must record while opening the package. No video = no replacement or refund.',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'additionalPhotos',
      title: 'Additional Photos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: false },
          fields: [
            defineField({
              name: 'alt',
              title: 'Description',
              type: 'string',
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(5),
      description: 'Optional. Up to 5 photos showing the damage.',
    }),

    // ── CHIPPY ADMIN ──────────────────────────────────────────────────────────

    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending review', value: 'pending' },
          { title: 'Approved: Refund', value: 'approved_refund' },
          { title: 'Approved: Replacement', value: 'approved_replacement' },
          { title: 'Resolved', value: 'resolved' },
          { title: 'Rejected', value: 'rejected' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'pending',
    }),

    defineField({
      name: 'adminNotes',
      title: 'Internal Notes',
      type: 'text',
      rows: 3,
      description: 'Chippy only. Not visible to the customer.',
    }),

    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      readOnly: true,
    }),
  ],

  preview: {
    select: {
      name: 'customerName',
      issue: 'issueType',
      status: 'status',
      product: 'productOrdered',
    },
    prepare({ name, issue, status, product }) {
      const issueLabel: Record<string, string> = {
        damaged_arrival: 'Damaged',
        wrong_item: 'Wrong item',
        missing_item: 'Missing',
        other: 'Other',
      }
      const statusEmoji: Record<string, string> = {
        pending: '🟡',
        approved_refund: '✅',
        approved_replacement: '🔄',
        resolved: '✔️',
        rejected: '❌',
      }
      return {
        title: `${statusEmoji[status] ?? '🟡'} ${name ?? 'Unknown'}`,
        subtitle: `${issueLabel[issue] ?? issue} — ${product ?? ''}`,
      }
    },
  },

  orderings: [
    {
      title: 'Newest first',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
    {
      title: 'Pending first',
      name: 'statusPending',
      by: [{ field: 'status', direction: 'asc' }],
    },
  ],
})
