import {groq} from 'next-sanity'
import {HomePage} from '../types'

// Query for homePage - try to get by specific ID first, then fallback to any
export const homePageQuery = groq`*[_type == "homePage"][0]{
  _id,
  _type,
  title,
  hero{
    heading,
    subheading,
    backgroundType,
    image,
    video{
      asset->{
        _id,
        url,
        mimeType,
        size
      }
    },
    ctaText,
    ctaLink
  },
  aboutPreview{
    title,
    content,
    image
  },
  featuredProjects[]->{
    _id,
    _type,
    title,
    slug,
    mainImage,
    description,
    featured,
    order
  },
  upcomingEvents[]->{
    _id,
    _type,
    title,
    slug,
    mainImage,
    date,
    location,
    eventType
  },
  featuredBlogPosts[]->{
    _id,
    _type,
    title,
    slug,
    mainImage,
    publishedAt,
    excerpt,
    featured
  },
  galleryPreview[]->{
    _id,
    _type,
    title,
    image,
    category,
    order
  },
  testimonials[]->{
    _id,
    _type,
    name,
    role,
    content,
    image,
    featured,
    order
  },
  partners[]->{
    _id,
    _type,
    name,
    logo,
    website,
    category,
    order
  },
  cta{
    title,
    description,
    buttonText,
    buttonLink
  },
  seo{
    metaTitle,
    metaDescription,
    ogImage
  }
}`

import {sanityFetch} from '../lib/client'
import {clientWithDrafts} from '../lib/client'

export async function getHomePage(): Promise<HomePage | null> {
  try {
    const result = await sanityFetch<HomePage>({
      query: homePageQuery,
      tags: ['homePage'],
    })
    
    // If no result, check if document exists as draft (helpful for debugging)
    if (!result) {
      const draftResult = await clientWithDrafts.fetch<HomePage>(homePageQuery, {}, {
        cache: 'no-store',
      })
      
      if (draftResult) {
        console.warn('⚠️ HomePage exists but is NOT PUBLISHED. Please publish it in Sanity Studio.')
      }
    }
    
    return result
  } catch (error) {
    console.error('❌ Error fetching homePage:', error)
    return null
  }
}

