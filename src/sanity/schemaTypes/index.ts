import { type SchemaTypeDefinition } from 'sanity'

import { product } from '../../../sanity/schemas/product'
import { bridalGallery } from '../../../sanity/schemas/bridalGallery'
import { stainShowcase } from '../../../sanity/schemas/stainShowcase'
import { review } from '../../../sanity/schemas/review'
import { post } from '../../../sanity/schemas/post'
import { siteSettings } from '../../../sanity/schemas/siteSettings'
import refundRequest from '../../../sanity/schemas/refundRequest'
import { chatLog } from '../../../sanity/schemas/chatLog'
import { pincodeLog } from '../../../sanity/schemas/pincodeLog'
import { promotion } from '../../../sanity/schemas/promotion'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const allSchemas: any[] = [
  product, bridalGallery, stainShowcase, review, post,
  siteSettings, refundRequest, chatLog, pincodeLog, promotion,
]

export const schema: { types: SchemaTypeDefinition[] } = {
  types: allSchemas as SchemaTypeDefinition[],
}
