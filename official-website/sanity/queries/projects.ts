import {groq} from 'next-sanity'
import {Project} from '../types'

export const projectsQuery = groq`*[_type == "project"] | order(order asc, title asc){
  _id,
  _type,
  title,
  slug,
  mainImage,
  description,
  timeline,
  donationCTA,
  featured,
  order,
  seo{
    metaTitle,
    metaDescription,
    ogImage
  }
}`

export const projectQuery = groq`*[_type == "project" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  slug,
  mainImage,
  description,
  timeline,
  donationCTA,
  featured,
  order,
  seo{
    metaTitle,
    metaDescription,
    ogImage
  }
}`

import {sanityFetch} from '../lib/client'

export async function getProjects(): Promise<Project[]> {
  return sanityFetch<Project[]>({
    query: projectsQuery,
    tags: ['project'],
  })
}

export async function getProject(slug: string): Promise<Project | null> {
  return sanityFetch<Project>({
    query: projectQuery,
    params: {slug},
    tags: ['project'],
  })
}

