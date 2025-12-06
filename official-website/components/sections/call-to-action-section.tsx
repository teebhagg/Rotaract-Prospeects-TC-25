'use client'

import Link from 'next/link'
import {SectionContainer} from '@/components/layout/section-container'
import {Button} from '@/components/ui/button'
import {motion} from 'framer-motion'
import {fadeInUp} from '@/lib/animations'
import {Heart, ArrowRight} from 'lucide-react'

interface CallToActionSectionProps {
  cta?: {
    title?: string
    description?: string
    buttonText?: string
    buttonLink?: string
  }
}

export function CallToActionSection({cta}: CallToActionSectionProps) {
  if (!cta) return null

  return (
    <div className="w-full bg-primary-500 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{once: true, margin: "-50px"}}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto"
        >
          {cta.title && (
            <h2 className="mb-6 text-3xl font-bold sm:text-4xl flex items-center justify-center gap-3 text-white">
              <Heart className="w-8 h-8 text-white" />
              {cta.title}
            </h2>
          )}
          {cta.description && (
            <p className="mb-8 text-lg text-white/90 leading-relaxed">
              {cta.description}
            </p>
          )}
          {cta.buttonText && cta.buttonLink && (
            <Link href={cta.buttonLink}>
              <Button size="lg" className="group bg-white text-primary-500 hover:bg-white/90">
                {cta.buttonText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  )
}

