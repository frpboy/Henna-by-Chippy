import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

import { product } from './schemas/product'
import { bridalGallery } from './schemas/bridalGallery'
import { stainShowcase } from './schemas/stainShowcase'
import { review } from './schemas/review'
import { post } from './schemas/post'
import { siteSettings } from './schemas/siteSettings'
import refundRequest from './schemas/refundRequest'
import { chatLog } from './schemas/chatLog'
import { pincodeLog } from './schemas/pincodeLog'

export default defineConfig({
  name: 'henna-by-chippy',
  title: 'Henna by Chippy',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Henna by Chippy')
          .items([
            S.listItem()
              .title('🛒 Products')
              .child(S.documentTypeList('product').title('Henna Cones')),
            S.listItem()
              .title('💅 Stain Showcase')
              .child(S.documentTypeList('stainShowcase').title('Stain Photos')),
            S.listItem()
              .title('💍 Bridal Gallery')
              .child(S.documentTypeList('bridalGallery').title('Bridal Work')),
            S.listItem()
              .title('⭐ Customer Reviews')
              .child(S.documentTypeList('review').title('Reviews')),
            S.listItem()
              .title('📖 Chippy\'s Stories')
              .child(S.documentTypeList('post').title('Blog Posts')),
            S.listItem()
              .title('🔄 Refund Requests')
              .child(S.documentTypeList('refundRequest').title('Refund & Replacement Requests')),
            S.listItem()
              .title('💬 AI Chat Logs')
              .child(S.documentTypeList('chatLog').title('Chat Sessions')),
            S.listItem()
              .title('📍 Pincode Lookups')
              .child(S.documentTypeList('pincodeLog').title('Delivery Freshness Checks')),
            S.divider(),
            S.listItem()
              .title('⚙️ Site Settings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Site Settings')
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: [product, bridalGallery, stainShowcase, review, post, siteSettings, refundRequest, chatLog, pincodeLog],
  },
})
