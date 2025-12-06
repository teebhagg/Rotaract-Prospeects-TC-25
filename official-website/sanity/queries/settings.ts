import {groq} from 'next-sanity'
import {Settings} from '../types'

export const settingsQuery = groq`*[_type == "settings"][0]{
  _id,
  _type,
  siteTitle,
  logo,
  favicon,
  defaultSeo{
    metaTitle,
    metaDescription,
    ogImage
  },
  socialLinks{
    facebook,
    twitter,
    instagram,
    linkedin,
    youtube
  },
  contact{
    email,
    phone,
    address
  }
}`

import {sanityFetch} from '../lib/client'

export async function getSiteSettings(): Promise<Settings | null> {
  return sanityFetch<Settings>({
    query: settingsQuery,
    tags: ['settings'],
  })
}

