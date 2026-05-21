'use client'

import Link from 'next/link'
import Image from 'next/image'
import {urlFor} from '@/sanity/lib/image'
import {Event} from '@/sanity/types'
import {motion} from 'framer-motion'
import {staggerItem} from '@/lib/animations'
import {CalendarDays, MapPin} from 'lucide-react'

interface EventCardProps {
  event: Event
  index?: number
}

export function EventCard({event, index = 0}: EventCardProps) {
  const eventDate = new Date(event.date)
  const day = eventDate.getDate()
  const month = eventDate.toLocaleDateString('en-US', {month: 'short'}).toUpperCase()
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <motion.div variants={staggerItem}>
      <Link href={`/events/${event.slug.current}`} className="group block">
        <div className="relative overflow-hidden bg-warm-100 transition-shadow duration-400 hover:shadow-lg hover:shadow-charcoal-900/5">
          {event.mainImage && (
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={urlFor(event.mainImage).width(600).height(400).url()}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-coral-900/0 group-hover:bg-coral-900/10 transition-colors duration-400" />
            </div>
          )}
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-coral-500 text-white flex flex-col items-center justify-center leading-none">
                <span className="text-xl font-bold">{day}</span>
                <span className="text-[10px] font-medium tracking-wider">{month}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-charcoal-900 group-hover:text-coral-600 transition-colors duration-200">
                  {event.title}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-charcoal-500">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formattedDate}
                  </span>
                  {event.location?.city && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {event.location.city}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
