'use client'

import Link from 'next/link'
import {SectionContainer} from '@/components/layout/section-container'
import {Button} from '@/components/ui/button'
import {motion} from 'framer-motion'
import {fadeInUp} from '@/lib/animations'
import {ArrowRight} from 'lucide-react'

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
    <section className="relative overflow-hidden bg-gradient-to-br from-coral-500 to-coral-600 py-[clamp(4rem,10vw,8rem)]">
      <div className="absolute top-0 right-0 w-96 h-96 bg-coral-400/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-coral-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{once: true, margin: "-50px"}}
          variants={fadeInUp}
          className="max-w-2xl"
        >
          {cta.title && (
            <h2 className="mb-6 text-3xl font-extrabold sm:text-4xl md:text-5xl text-white text-balance">
              {cta.title}
            </h2>
          )}
          {cta.description && (
            <p className="mb-8 text-lg text-white/85 leading-relaxed text-balance">
              {cta.description}
            </p>
          )}
          {cta.buttonText && cta.buttonLink && (
            <Link href={cta.buttonLink}>
              <Button size="lg" className="bg-white text-coral-600 hover:bg-charcoal-900 hover:text-white group">
                {cta.buttonText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  )
}
