'use client'

import {SectionContainer} from '@/components/layout/section-container'
import {TestimonialCard} from '@/components/cards/testimonial-card'
import {Testimonial} from '@/sanity/types'
import {motion} from 'framer-motion'
import {staggerContainer} from '@/lib/animations'
import {MessageCircle} from 'lucide-react'

interface TestimonialsSectionProps {
  testimonials?: Testimonial[]
}

export function TestimonialsSection({testimonials}: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null

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
            <MessageCircle className="w-8 h-8 text-primary" />
            What People Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Testimonials from our community
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial._id} testimonial={testimonial} index={index} />
          ))}
        </div>
      </motion.div>
    </SectionContainer>
  )
}

