import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
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
        .title("📖 Chippy's Stories")
        .child(S.documentTypeList('post').title('Blog Posts')),
      S.listItem()
        .title('🎉 Promotions')
        .child(S.documentTypeList('promotion').title('Active Promotions')),
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
            .title('Site Settings'),
        ),
    ])
