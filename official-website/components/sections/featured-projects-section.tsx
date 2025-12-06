'use client'

import Link from 'next/link'
import {SectionContainer} from '@/components/layout/section-container'
import {ProjectCard} from '@/components/cards/project-card'
import {Button} from '@/components/ui/button'
import {Project} from '@/sanity/types'
import {motion} from 'framer-motion'
import {staggerContainer} from '@/lib/animations'
import {FolderKanban, ArrowRight} from 'lucide-react'

interface FeaturedProjectsSectionProps {
  projects?: Project[]
}

export function FeaturedProjectsSection({projects}: FeaturedProjectsSectionProps) {
  if (!projects || projects.length === 0) return null

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
            <FolderKanban className="w-8 h-8 text-primary" />
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover our impactful initiatives
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project._id} project={project} index={index} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/projects">
            <Button variant="outline" className="group">
              View All Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </SectionContainer>
  )
}

