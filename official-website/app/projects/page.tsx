import {getProjects} from '@/sanity/queries/projects'
import {PageHeader} from '@/components/layout/page-header'
import {SectionContainer} from '@/components/layout/section-container'
import {ProjectCard} from '@/components/cards/project-card'
import {AnimatedDiv} from '@/components/ui/animated-div'
import {staggerContainer} from '@/lib/animations'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata() {
  return {
    title: 'Projects | Rotaract TC-25',
    description: 'Explore our impactful projects and initiatives',
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <SectionContainer>
      <PageHeader
        title="Our Projects"
        description="Discover the impactful initiatives we're working on"
      />
      {projects.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No projects available at the moment. Check back soon!
        </p>
      ) : (
        <AnimatedDiv
          variants={staggerContainer}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project, index) => (
            <ProjectCard key={project._id} project={project} index={index} />
          ))}
        </AnimatedDiv>
      )}
    </SectionContainer>
  )
}

