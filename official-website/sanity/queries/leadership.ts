import {groq} from 'next-sanity'
import {Leadership} from '../types'

export const leadershipQuery = groq`*[_type == "leadership"] | order(order asc, name asc){
  _id,
  _type,
  name,
  role,
  bio,
  image,
  email,
  socialLinks,
  order
}`

import {sanityFetch} from '../lib/client'

export async function getLeadership(): Promise<Leadership[]> {
  return sanityFetch<Leadership[]>({
    query: leadershipQuery,
    tags: ['leadership'],
  })
}

