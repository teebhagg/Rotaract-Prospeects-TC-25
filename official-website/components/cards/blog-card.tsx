'use client'

import Link from 'next/link'
import Image from 'next/image'
import {urlFor} from '@/sanity/lib/image'
import {Blog} from '@/sanity/types'
import {motion} from 'framer-motion'
import {staggerItem} from '@/lib/animations'
import {Calendar} from 'lucide-react'

interface BlogCardProps {
  blog: Blog
  index?: number
}

export function BlogCard({blog, index = 0}: BlogCardProps) {
  const publishedDate = new Date(blog.publishedAt)
  const formattedDate = publishedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <motion.div variants={staggerItem}>
      <Link href={`/blog/${blog.slug.current}`} className="group block">
        <div className="overflow-hidden bg-warm-100 transition-shadow duration-400 hover:shadow-lg hover:shadow-charcoal-900/5">
          {blog.mainImage && (
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={urlFor(blog.mainImage).width(600).height(450).url()}
                alt={blog.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-103"
              />
              {blog.featured && (
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 bg-coral-500 text-white text-xs font-semibold">
                    Featured
                  </span>
                </div>
              )}
            </div>
          )}
          <div className="p-5">
            <h3 className="text-lg font-bold text-charcoal-900 group-hover:text-coral-600 transition-colors duration-200 line-clamp-2">
              {blog.title}
            </h3>
            {blog.excerpt && (
              <p className="mt-2 text-sm text-charcoal-500 line-clamp-2 leading-relaxed">
                {blog.excerpt}
              </p>
            )}
            <div className="mt-4 flex items-center gap-3 text-xs text-charcoal-400">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formattedDate}
              </span>
              {blog.author?.name && (
                <>
                  <span className="text-charcoal-300">&middot;</span>
                  <span>{blog.author.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
