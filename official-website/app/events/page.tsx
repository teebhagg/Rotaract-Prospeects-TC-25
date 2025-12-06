import {getEvents} from '@/sanity/queries/events'
import {PageHeader} from '@/components/layout/page-header'
import {SectionContainer} from '@/components/layout/section-container'
import {EventCard} from '@/components/cards/event-card'
import {AnimatedDiv} from '@/components/ui/animated-div'
import {staggerContainer} from '@/lib/animations'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata() {
  return {
    title: 'Events | Rotaract TC-25',
    description: 'Join us for our upcoming events and see our past gatherings',
  }
}

export default async function EventsPage() {
  const events = await getEvents()
  const upcomingEvents = events.filter((e) => e.eventType === 'upcoming')
  const pastEvents = events.filter((e) => e.eventType === 'past')

  return (
    <SectionContainer>
      <PageHeader
        title="Events"
        description="Join us for our upcoming events and explore our past gatherings"
      />

      {upcomingEvents.length > 0 && (
        <div className="mb-16">
          <h2 className="mb-6 text-2xl font-bold">Upcoming Events</h2>
          <AnimatedDiv
            variants={staggerContainer}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {upcomingEvents.map((event, index) => (
              <EventCard key={event._id} event={event} index={index} />
            ))}
          </AnimatedDiv>
        </div>
      )}

      {pastEvents.length > 0 && (
        <div>
          <h2 className="mb-6 text-2xl font-bold">Past Events</h2>
          <AnimatedDiv
            variants={staggerContainer}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {pastEvents.map((event, index) => (
              <EventCard key={event._id} event={event} index={index} />
            ))}
          </AnimatedDiv>
        </div>
      )}

      {events.length === 0 && (
        <p className="text-center text-muted-foreground">
          No events available at the moment. Check back soon!
        </p>
      )}
    </SectionContainer>
  )
}

