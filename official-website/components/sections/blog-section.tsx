'use client'

import Link from 'next/link'
import {SectionContainer} from '@/components/layout/section-container'
import {BlogCard} from '@/components/cards/blog-card'
import {Button} from '@/components/ui/button'
import {Blog} from '@/sanity/types'
import {motion} from 'framer-motion'
import {staggerContainer} from '@/lib/animations'
import {BookOpen, ArrowRight} from 'lucide-react'

interface BlogSectionProps {
  posts?: Blog[]
}

export function BlogSection({posts}: BlogSectionProps) {
  if (!posts || posts.length === 0) return null

  return (
    <SectionContainer>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{once: true, margin: "-50px"}}
        variants={staggerContainer}
      >
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl flex items-center justify-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            Latest Blog Posts
          </h2>
          <p className="text-lg text-muted-foreground">
            Stay updated with our stories
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post, index) => (
            <BlogCard key={post._id} blog={post} index={index} />
          ))}
        </div>
        <div className="mt-8 text-center">
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

