import {groq} from 'next-sanity'
import {Blog} from '../types'

export const blogPostsQuery = groq`*[_type == "blog"] | order(publishedAt desc){
  _id,
  _type,
  title,
  slug,
  mainImage,
  publishedAt,
  author,
  excerpt,
  featured,
  seo{
    metaTitle,
    metaDescription,
    ogImage
  }
}`

export const blogPostQuery = groq`*[_type == "blog" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  slug,
  mainImage,
  content,
  publishedAt,
  author,
  excerpt,
  featured,
  seo{
    metaTitle,
    metaDescription,
    ogImage
  }
}`

import {sanityFetch} from '../lib/client'

export async function getBlogPosts(): Promise<Blog[]> {
  return sanityFetch<Blog[]>({
    query: blogPostsQuery,
    tags: ['blog'],
  })
}

export async function getBlogPost(slug: string): Promise<Blog | null> {
  return sanityFetch<Blog>({
    query: blogPostQuery,
    params: {slug},
    tags: ['blog'],
  })
}

