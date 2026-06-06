'use client'

import {SectionContainer} from '@/components/layout/section-container'
import {TestimonialCard} from '@/components/cards/testimonial-card'
import {Testimonial} from '@/sanity/types'
import {motion} from 'framer-motion'
import {staggerContainer} from '@/lib/animations'

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
        <div className="mb-12">
          <span className="block h-1 w-12 bg-cranberry-500 mb-4" />
          <h2 className="text-3xl font-extrabold sm:text-4xl text-charcoal-900">
            What People Say
          </h2>
          <p className="mt-3 text-lg text-charcoal-500 max-w-xl">
            Voices from our community
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial._id} testimonial={testimonial} index={index} />
          ))}
        </div>
      </motion.div>
    </SectionContainer>
  )
}
