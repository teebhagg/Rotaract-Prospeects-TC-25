'use client'

import Image from 'next/image'
import {urlFor} from '@/sanity/lib/image'
import {Testimonial} from '@/sanity/types'
import {PortableText} from '@portabletext/react'
import {motion} from 'framer-motion'
import {staggerItem} from '@/lib/animations'

interface TestimonialCardProps {
  testimonial: Testimonial
  index?: number
}

export function TestimonialCard({testimonial, index = 0}: TestimonialCardProps) {
  return (
    <motion.div variants={staggerItem}>
      <div className="relative py-6">
        <div className="absolute -top-2 left-0 text-6xl font-serif text-cranberry-300/40 leading-none select-none">
          &ldquo;
        </div>
        <div className="relative pt-6">
          {testimonial.content && (
            <div className="mb-5 text-charcoal-700 leading-relaxed text-base">
              <PortableText value={testimonial.content} />
            </div>
          )}
          <div className="flex items-center gap-3">
            {testimonial.image && (
              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden ring-2 ring-cranberry-300/50">
                <Image
                  src={urlFor(testimonial.image).width(80).height(80).url()}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="font-semibold text-charcoal-900 text-sm">
                {testimonial.name}
              </p>
              {testimonial.role && (
                <p className="text-xs text-charcoal-500">{testimonial.role}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
