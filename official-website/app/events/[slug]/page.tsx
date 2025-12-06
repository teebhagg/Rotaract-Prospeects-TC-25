import {notFound} from 'next/navigation'
import {getEvent, getEvents} from '@/sanity/queries/events'
import {SectionContainer} from '@/components/layout/section-container'
import Image from 'next/image'
import {urlFor} from '@/sanity/lib/image'
import {PortableText} from '@portabletext/react'
import {AnimatedDiv} from '@/components/ui/animated-div'
import {fadeInUp} from '@/lib/animations'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateStaticParams() {
  const events = await getEvents()
  return events.map((event) => ({
    slug: event.slug.current,
  }))
}

export async function generateMetadata({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const event = await getEvent(slug)

  if (!event) {
    return {
      title: 'Event Not Found',
    }
  }

  return {
    title: event.seo?.metaTitle || event.title,
    description: event.seo?.metaDescription || `Join us for ${event.title}`,
  }
}

export default async function EventPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const event = await getEvent(slug)

  if (!event) {
    notFound()
  }

  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <SectionContainer>
      <AnimatedDiv
        variants={fadeInUp}
        className="max-w-4xl mx-auto"
      >
        <h1 className="mb-4 text-4xl font-bold">{event.title}</h1>
        <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="rounded-none bg-primary/10 px-3 py-1 capitalize">
            {event.eventType}
          </span>
          <span>{formattedDate}</span>
          {event.location?.name && <span>📍 {event.location.name}</span>}
          {event.location?.city && <span>{event.location.city}</span>}
        </div>
        {event.mainImage && (
          <div className="relative mb-8 h-96 w-full overflow-hidden rounded-none">
            <Image
              src={urlFor(event.mainImage).width(1200).height(600).url()}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="prose prose-lg max-w-none mb-8">
          <PortableText value={event.description} />
        </div>
        {event.gallery && event.gallery.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">Event Gallery</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {event.gallery.map((image, index) => (
                <div
                  key={index}
                  className="relative h-64 w-full overflow-hidden rounded-none"
                >
                  <Image
                    src={urlFor(image).width(400).height(400).url()}
                    alt={`${event.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </AnimatedDiv>
    </SectionContainer>
  )
}

