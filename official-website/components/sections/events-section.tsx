'use client'

import Link from 'next/link'
import {SectionContainer} from '@/components/layout/section-container'
import {EventCard} from '@/components/cards/event-card'
import {Button} from '@/components/ui/button'
import {Event} from '@/sanity/types'
import {motion} from 'framer-motion'
import {staggerContainer} from '@/lib/animations'
import {Calendar, ArrowRight} from 'lucide-react'

interface EventsSectionProps {
  events?: Event[]
}

export function EventsSection({events}: EventsSectionProps) {
  if (!events || events.length === 0) return null

  const upcomingEvents = events.filter((e) => e.eventType === 'upcoming').slice(0, 3)

  if (upcomingEvents.length === 0) return null

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
            <Calendar className="w-8 h-8 text-primary" />
            Upcoming Events
          </h2>
          <p className="text-lg text-muted-foreground">
            Join us for our next gathering
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((event, index) => (
            <EventCard key={event._id} event={event} index={index} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/events">
            <Button variant="outline" className="group">
              View All Events
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </SectionContainer>
  )
}

