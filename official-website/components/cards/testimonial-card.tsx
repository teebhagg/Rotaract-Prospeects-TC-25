'use client'

import Image from 'next/image'
import {Card, CardContent} from '@/components/ui/card'
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
    <motion.div
      variants={staggerItem}
    >
      <Card className="h-full card-hover">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {testimonial.image && (
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-none">
                <Image
                  src={urlFor(testimonial.image).width(100).height(100).url()}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              {testimonial.content && (
                <div className="mb-4 text-sm leading-relaxed text-muted-foreground italic relative pl-4 border-l-2 border-primary/30">
                  <PortableText value={testimonial.content} />
                </div>
              )}
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                {testimonial.role && (
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

