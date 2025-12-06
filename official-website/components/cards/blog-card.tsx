'use client'

import Link from 'next/link'
import Image from 'next/image'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {urlFor} from '@/sanity/lib/image'
import {Blog} from '@/sanity/types'
import {motion} from 'framer-motion'
import {staggerItem} from '@/lib/animations'

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
    <motion.div
      variants={staggerItem}
    >
      <Link href={`/blog/${blog.slug.current}`}>
        <Card className="group h-full overflow-hidden card-hover">
          {blog.mainImage && (
            <div className="relative h-48 w-full overflow-hidden rounded-none">
              <Image
                src={urlFor(blog.mainImage).width(600).height(400).url()}
                alt={blog.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {blog.featured && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-none bg-primary text-white text-xs font-semibold">
                    Featured
                  </span>
                </div>
              )}
            </div>
          )}
          <CardHeader className="pb-4">
            <CardTitle className="group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {blog.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm">
              <span>📅 {formattedDate}</span>
              {blog.author?.name && <span>• ✍️ {blog.author.name}</span>}
            </CardDescription>
          </CardHeader>
          {blog.excerpt && (
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {blog.excerpt}
              </p>
            </CardContent>
          )}
        </Card>
      </Link>
    </motion.div>
  )
}

