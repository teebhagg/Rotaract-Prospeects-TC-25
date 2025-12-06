import {groq} from 'next-sanity'
import {GalleryImage} from '../types'

export const galleryImagesQuery = groq`*[_type == "galleryImage"] | order(order asc){
  _id,
  _type,
  title,
  image,
  category,
  description,
  order
}`

import {sanityFetch} from '../lib/client'

export async function getGalleryImages(): Promise<GalleryImage[]> {
  return sanityFetch<GalleryImage[]>({
    query: galleryImagesQuery,
    tags: ['galleryImage'],
  })
}

