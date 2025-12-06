import {groq} from 'next-sanity'
import {Partner} from '../types'

export const partnersQuery = groq`*[_type == "partner"] | order(order asc, name asc){
  _id,
  _type,
  name,
  logo,
  website,
  category,
  description,
  order
}`

import {sanityFetch} from '../lib/client'

export async function getPartners(): Promise<Partner[]> {
  return sanityFetch<Partner[]>({
    query: partnersQuery,
    tags: ['partner'],
  })
}

