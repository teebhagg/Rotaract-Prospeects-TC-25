'use client'

import Link from 'next/link'
import Image from 'next/image'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {urlFor} from '@/sanity/lib/image'
import {Event} from '@/sanity/types'
import {motion} from 'framer-motion'
import {staggerItem} from '@/lib/animations'

interface EventCardProps {
  event: Event
  index?: number
}

export function EventCard({event, index = 0}: EventCardProps) {
  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <motion.div
      variants={staggerItem}
    >
      <Link href={`/events/${event.slug.current}`}>
        <Card className="group h-full overflow-hidden card-hover">
          {event.mainImage && (
            <div className="relative h-48 w-full overflow-hidden rounded-none">
              <Image
                src={urlFor(event.mainImage).width(600).height(400).url()}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-none text-xs font-semibold ${
                  event.eventType === 'upcoming' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-500 text-white'
                }`}>
                  {event.eventType === 'upcoming' ? 'Upcoming' : 'Past'}
                </span>
              </div>
            </div>
          )}
          <CardHeader className="pb-4">
            <CardTitle className="group-hover:text-primary transition-colors duration-300">
              {event.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1">
                📅 {formattedDate}
              </span>
              {event.location?.city && (
                <span className="inline-flex items-center gap-1">
                  📍 {event.location.city}
                </span>
              )}
            </CardDescription>
          </CardHeader>
        </Card>
      </Link>
    </motion.div>
  )
}

