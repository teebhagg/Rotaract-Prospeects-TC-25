import {notFound} from 'next/navigation'
import {getProject, getProjects} from '@/sanity/queries/projects'
import {SectionContainer} from '@/components/layout/section-container'
import Image from 'next/image'
import {urlFor} from '@/sanity/lib/image'
import {PortableText} from '@portabletext/react'
import {Button} from '@/components/ui/button'
import {AnimatedDiv} from '@/components/ui/animated-div'
import {fadeInUp} from '@/lib/animations'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((project) => ({
    slug: project.slug.current,
  }))
}

export async function generateMetadata({params}: {params: {slug: string}}) {
  const project = await getProject(params.slug)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: project.seo?.metaTitle || project.title,
    description: project.seo?.metaDescription || `Learn about ${project.title}`,
  }
}

export default async function ProjectPage({params}: {params: {slug: string}}) {
  const project = await getProject(params.slug)

  if (!project) {
    notFound()
  }

  const eventDate = project.timeline?.startDate
    ? new Date(project.timeline.startDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <SectionContainer>
      <AnimatedDiv
        variants={fadeInUp}
        className="max-w-4xl mx-auto"
      >
        <h1 className="mb-4 text-4xl font-bold">{project.title}</h1>
        {project.timeline && (
          <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            {project.timeline.status && (
              <span className="rounded-none bg-primary/10 px-3 py-1 capitalize">
                {project.timeline.status}
              </span>
            )}
            {eventDate && <span>Started: {eventDate}</span>}
          </div>
        )}
        {project.mainImage && (
          <div className="relative mb-8 h-96 w-full overflow-hidden rounded-none">
            <Image
              src={urlFor(project.mainImage).width(1200).height(600).url()}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="prose prose-lg max-w-none mb-8">
          <PortableText value={project.description} />
        </div>
        {project.donationCTA?.enabled && project.donationCTA.link && (
          <div className="rounded-none border bg-muted/50 p-6 text-center">
            <h3 className="mb-2 text-xl font-semibold">Support This Project</h3>
            <p className="mb-4 text-muted-foreground">
              {project.donationCTA.text || 'Help us make a difference'}
            </p>
            <a href={project.donationCTA.link} target="_blank" rel="noopener noreferrer">
              <Button size="lg">Donate Now</Button>
            </a>
          </div>
        )}
      </AnimatedDiv>
    </SectionContainer>
  )
}

