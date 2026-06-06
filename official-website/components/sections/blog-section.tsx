'use client'

import Link from 'next/link'
import Image from 'next/image'
import {SectionContainer} from '@/components/layout/section-container'
import {BlogCard} from '@/components/cards/blog-card'
import {Button} from '@/components/ui/button'
import {urlFor} from '@/sanity/lib/image'
import {Blog} from '@/sanity/types'
import {motion} from 'framer-motion'
import {staggerContainer, staggerItem} from '@/lib/animations'
import {ArrowRight, Calendar} from 'lucide-react'

interface BlogSectionProps {
  posts?: Blog[]
}

export function BlogSection({posts}: BlogSectionProps) {
  if (!posts || posts.length === 0) return null

  const featured = posts[0]
  const remaining = posts.slice(1, 3)

  return (
    <SectionContainer>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{once: true, margin: "-50px"}}
        variants={staggerContainer}
      >
        <div className="mb-12">
          <span className="block h-1 w-12 bg-cranberry-500 mb-4" />
          <h2 className="text-3xl font-extrabold sm:text-4xl text-charcoal-900">
            Latest Stories
          </h2>
          <p className="mt-3 text-lg text-charcoal-500 max-w-xl">
            Stories from our community
          </p>
        </div>

        {featured && (
          <motion.div variants={staggerItem} className="mb-10">
            <Link href={`/blog/${featured.slug.current}`} className="group block">
              <div className="grid md:grid-cols-2 gap-0 overflow-hidden bg-warm-100 transition-shadow duration-400 hover:shadow-lg hover:shadow-charcoal-900/5">
                {featured.mainImage && (
                  <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
                    <Image
                      src={urlFor(featured.mainImage).width(800).height(600).url()}
                      alt={featured.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  {featured.featured && (
                    <span className="inline-block mb-3 w-fit px-2.5 py-1 bg-cranberry-100 text-cranberry-700 text-xs font-semibold">
                      Featured
                    </span>
                  )}
                  <h3 className="text-2xl font-bold text-charcoal-900 group-hover:text-cranberry-600 transition-colors duration-200">
                    {featured.title}
                  </h3>
                  {featured.excerpt && (
                    <p className="mt-3 text-charcoal-500 leading-relaxed line-clamp-3">
                      {featured.excerpt}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-3 text-sm text-charcoal-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {new Date(featured.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    {featured.author?.name && (
                      <>
                        <span className="text-charcoal-300">&middot;</span>
                        <span>{featured.author.name}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {remaining.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {remaining.map((post, index) => (
              <BlogCard key={post._id} blog={post} index={index} />
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-end">
          <Link href="/blog">
            <Button variant="outline" className="group">
              View All Posts
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </SectionContainer>
  )
}
