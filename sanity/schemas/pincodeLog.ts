import { defineField, defineType } from 'sanity'

export const pincodeLog = defineType({
  name: 'pincodeLog',
  title: 'Pincode Lookups',
  type: 'document',
  fields: [
    defineField({ name: 'pincode', type: 'string', title: 'Pincode' }),
    defineField({ name: 'district', type: 'string', title: 'District' }),
    defineField({ name: 'state', type: 'string', title: 'State' }),
    defineField({
      name: 'zone',
      type: 'string',
      title: 'Delivery Zone',
      options: { list: ['safe', 'caution', 'risky', 'warn', 'unavailable'] },
    }),
    defineField({
      name: 'method',
      type: 'string',
      title: 'How user checked',
      options: { list: ['typed', 'gps'] },
    }),
    defineField({ name: 'checkedAt', type: 'datetime', title: 'Checked At' }),
  ],
  preview: {
    select: { title: 'pincode', subtitle: 'district' },
    prepare({ title, subtitle }: { title: string; subtitle: string }) {
      return { title: title ?? '—', subtitle: subtitle ?? '' }
    },
  },
})
