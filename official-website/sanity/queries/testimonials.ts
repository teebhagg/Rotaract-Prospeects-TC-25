import {groq} from 'next-sanity'
import {Testimonial} from '../types'

export const testimonialsQuery = groq`*[_type == "testimonial"] | order(order asc, name asc){
  _id,
  _type,
  name,
  role,
  content,
  image,
  featured,
  order
}`

import {sanityFetch} from '../lib/client'

export async function getTestimonials(): Promise<Testimonial[]> {
  return sanityFetch<Testimonial[]>({
    query: testimonialsQuery,
    tags: ['testimonial'],
  })
}

