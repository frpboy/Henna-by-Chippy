import { defineField, defineType } from 'sanity'

// AI chat session logs — stored for Chippy to review common questions
// and improve the knowledge base. Never stores raw IP.

export const chatLog = defineType({
  name: 'chatLog',
  title: 'AI Chat Logs',
  type: 'document',
  fields: [
    defineField({
      name: 'sessionId',
      title: 'Session ID',
      type: 'string',
      description: 'Random UUID per browser session. Not tied to any user account.',
      readOnly: true,
    }),
    defineField({
      name: 'messages',
      title: 'Messages',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'role', title: 'Role', type: 'string' }),
            defineField({ name: 'text', title: 'Text', type: 'text' }),
            defineField({ name: 'timestamp', title: 'Timestamp', type: 'datetime' }),
          ],
        },
      ],
      readOnly: true,
    }),
    defineField({
      name: 'userLanguage',
      title: 'Detected Language',
      type: 'string',
      options: {
        list: [
          { title: 'English', value: 'en' },
          { title: 'Malayalam', value: 'ml' },
          { title: 'Manglish', value: 'manglish' },
        ],
      },
    }),
    defineField({
      name: 'startedAt',
      title: 'Started At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'ipRegion',
      title: 'Region (coarse)',
      type: 'string',
      description: 'e.g. KL, TN, MH. Never raw IP.',
      readOnly: true,
    }),
    defineField({
      name: 'flagged',
      title: 'Flagged for Review',
      type: 'boolean',
      initialValue: false,
      description: 'Mark if this session needs attention.',
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      rows: 2,
      description: "Chippy's notes about this session.",
    }),
  ],
  preview: {
    select: { sessionId: 'sessionId', startedAt: 'startedAt', region: 'ipRegion' },
    prepare({ sessionId, startedAt, region }) {
      const date = startedAt ? new Date(startedAt as string).toLocaleDateString('en-IN') : 'Unknown date'
      return {
        title: `Session ${(sessionId as string)?.slice(0, 8) ?? 'unknown'}`,
        subtitle: `${date} — ${region ?? 'unknown region'}`,
      }
    },
  },

  orderings: [
    {
      title: 'Newest first',
      name: 'startedAtDesc',
      by: [{ field: 'startedAt', direction: 'desc' }],
    },
  ],
})
