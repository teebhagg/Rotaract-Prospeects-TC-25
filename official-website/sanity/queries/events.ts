import {groq} from 'next-sanity'
import {Event} from '../types'

export const eventsQuery = groq`*[_type == "event"] | order(date desc){
  _id,
  _type,
  title,
  slug,
  mainImage,
  description,
  date,
  location,
  eventType,
  gallery,
  seo{
    metaTitle,
    metaDescription,
    ogImage
  }
}`

export const eventQuery = groq`*[_type == "event" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  slug,
  mainImage,
  description,
  date,
  location,
  eventType,
  gallery,
  seo{
    metaTitle,
    metaDescription,
    ogImage
  }
}`

import {sanityFetch} from '../lib/client'

export async function getEvents(): Promise<Event[]> {
  return sanityFetch<Event[]>({
    query: eventsQuery,
    tags: ['event'],
  })
}

export async function getEvent(slug: string): Promise<Event | null> {
  return sanityFetch<Event>({
    query: eventQuery,
    params: {slug},
    tags: ['event'],
  })
}

