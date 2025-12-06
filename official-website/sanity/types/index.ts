import {PortableTextBlock} from '@portabletext/types'

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

export interface SEO {
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImage
}

export interface HomePage {
  _id: string
  _type: 'homePage'
  title: string
  hero?: {
    heading?: string
    subheading?: string
    backgroundType?: 'image' | 'video'
    image?: SanityImage
    video?: {
      asset: {
        _id: string
        url: string
        mimeType?: string
        size?: number
      }
    }
    ctaText?: string
    ctaLink?: string
  }
  aboutPreview?: {
    title?: string
    content?: PortableTextBlock[]
    image?: SanityImage
  }
  featuredProjects?: Project[]
  upcomingEvents?: Event[]
  featuredBlogPosts?: Blog[]
  galleryPreview?: GalleryImage[]
  testimonials?: Testimonial[]
  partners?: Partner[]
  cta?: {
    title?: string
    description?: string
    buttonText?: string
    buttonLink?: string
  }
  seo?: SEO
}

export interface AboutPage {
  _id: string
  _type: 'aboutPage'
  title: string
  mainImage?: SanityImage
  mission?: {
    title?: string
    content?: PortableTextBlock[]
  }
  vision?: {
    title?: string
    content?: PortableTextBlock[]
  }
  values?: Array<{
    title?: string
    description?: string
    icon?: string
  }>
  leadershipSection?: {
    title?: string
    description?: string
    leaders?: Leadership[]
  }
  timeline?: Array<{
    year?: string
    title?: string
    description?: string
    image?: SanityImage
  }>
  gallery?: GalleryImage[]
  seo?: SEO
}

export interface Project {
  _id: string
  _type: 'project'
  title: string
  slug: {current: string}
  mainImage: SanityImage
  description: PortableTextBlock[]
  timeline?: {
    startDate?: string
    endDate?: string
    status?: 'planning' | 'active' | 'completed'
  }
  donationCTA?: {
    enabled?: boolean
    text?: string
    link?: string
  }
  featured?: boolean
  order?: number
  seo?: SEO
}

export interface Event {
  _id: string
  _type: 'event'
  title: string
  slug: {current: string}
  mainImage: SanityImage
  description: PortableTextBlock[]
  date: string
  location?: {
    name?: string
    address?: string
    city?: string
    coordinates?: {
      lat?: number
      lng?: number
    }
  }
  eventType: 'upcoming' | 'past'
  gallery?: SanityImage[]
  seo?: SEO
}

export interface Blog {
  _id: string
  _type: 'blog'
  title: string
  slug: {current: string}
  mainImage: SanityImage
  content: PortableTextBlock[]
  publishedAt: string
  author?: {
    name?: string
    image?: SanityImage
  }
  excerpt?: string
  featured?: boolean
  seo?: SEO
}

export interface Leadership {
  _id: string
  _type: 'leadership'
  name: string
  role: string
  bio?: PortableTextBlock[]
  image: SanityImage
  email?: string
  socialLinks?: {
    linkedin?: string
    twitter?: string
    instagram?: string
  }
  order?: number
}

export interface Testimonial {
  _id: string
  _type: 'testimonial'
  name: string
  role?: string
  content: PortableTextBlock[]
  image?: SanityImage
  featured?: boolean
  order?: number
}

export interface GalleryImage {
  _id: string
  _type: 'galleryImage'
  title?: string
  image: SanityImage
  category?: 'events' | 'projects' | 'community' | 'general'
  description?: string
  order?: number
}

export interface Partner {
  _id: string
  _type: 'partner'
  name: string
  logo: SanityImage
  website?: string
  category?: 'sponsor' | 'partner' | 'community'
  description?: string
  order?: number
}

export interface Settings {
  _id: string
  _type: 'settings'
  siteTitle: string
  logo?: SanityImage
  favicon?: SanityImage
  defaultSeo?: SEO
  socialLinks?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
    youtube?: string
  }
  contact?: {
    email?: string
    phone?: string
    address?: string
  }
}

