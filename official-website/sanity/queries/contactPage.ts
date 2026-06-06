import {groq} from 'next-sanity'
import {ContactPage} from '../types'

export const contactPageQuery = groq`*[_type == "contactPage"][0]{
  _id,
  _type,
  title,
  heading,
  description,
  formHeading,
  seo{
    metaTitle,
    metaDescription,
    ogImage
  }
}`

import {sanityFetch} from '../lib/client'

export async function getContactPage(): Promise<ContactPage | null> {
  return sanityFetch<ContactPage>({
    query: contactPageQuery,
    tags: ['contactPage'],
  })
}
