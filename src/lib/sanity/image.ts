import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from './client'
import type { SanityImage } from '@/types'

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImage) {
  return builder.image(source)
}

/** Product/card image — 800x800 WebP, quality 80 */
export function productImageUrl(source: SanityImage): string {
  return urlFor(source).width(800).height(800).quality(80).format('webp').fit('crop').url()
}

/** Thumbnail — 400x400 WebP, quality 75 */
export function thumbnailUrl(source: SanityImage): string {
  return urlFor(source).width(400).height(400).quality(75).format('webp').fit('crop').url()
}

/** LQIP blur placeholder — 20px wide, blurred */
export function lqipUrl(source: SanityImage): string {
  return urlFor(source).width(20).quality(30).format('webp').blur(50).url()
}

/** Gallery image — 1200 wide max */
export function galleryImageUrl(source: SanityImage): string {
  return urlFor(source).width(1200).quality(80).format('webp').url()
}
