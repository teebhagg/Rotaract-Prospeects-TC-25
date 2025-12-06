import {groq} from 'next-sanity'
import {AboutPage} from '../types'

export const aboutPageQuery = groq`*[_type == "aboutPage" && _id == "aboutPage"][0]{
  _id,
  _type,
  title,
  mainImage,
  mission{
    title,
    content
  },
  vision{
    title,
    content
  },
  values[]{
    title,
    description,
    icon
  },
  leadershipSection{
    title,
    description,
    leaders[]->{
      _id,
      _type,
      name,
      role,
      bio,
      image,
      email,
      socialLinks,
      order
    }
  },
  timeline[]{
    year,
    title,
    description,
    image
  },
  gallery[]->{
    _id,
    _type,
    title,
    image,
    category,
    order
  },
  seo{
    metaTitle,
    metaDescription,
    ogImage
  }
}`

import {sanityFetch} from '../lib/client'

export async function getAboutPage(): Promise<AboutPage | null> {
  return sanityFetch<AboutPage>({
    query: aboutPageQuery,
    tags: ['aboutPage'],
  })
}

