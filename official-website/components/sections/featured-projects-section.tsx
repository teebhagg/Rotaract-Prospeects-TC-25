'use client'

import Link from 'next/link'
import Image from 'next/image'
import {SectionContainer} from '@/components/layout/section-container'
import {ProjectCard} from '@/components/cards/project-card'
import {Button} from '@/components/ui/button'
import {urlFor} from '@/sanity/lib/image'
import {Project} from '@/sanity/types'
import {motion} from 'framer-motion'
import {staggerContainer, staggerItem} from '@/lib/animations'
import {ArrowRight} from 'lucide-react'

interface FeaturedProjectsSectionProps {
  projects?: Project[]
}

export function FeaturedProjectsSection({projects}: FeaturedProjectsSectionProps) {
  if (!projects || projects.length === 0) return null

  const featured = projects[0]
  const remaining = projects.slice(1, 4)

  return (
    <SectionContainer>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{once: true, margin: "-50px"}}
        variants={staggerContainer}
      >
        <div className="mb-12">
          <span className="block h-1 w-12 bg-cranberry-500 mb-4" />
          <h2 className="text-3xl font-extrabold sm:text-4xl text-charcoal-900">
            Featured Projects
          </h2>
          <p className="mt-3 text-lg text-charcoal-500 max-w-xl">
            Projects creating real change in our community
          </p>
        </div>

        {featured && (
          <motion.div variants={staggerItem} className="mb-8">
            <Link href={`/projects/${featured.slug.current}`} className="group block">
              <div className="overflow-hidden bg-warm-100 transition-shadow duration-400 hover:shadow-lg hover:shadow-charcoal-900/5">
                {featured.mainImage && (
                  <div className="relative aspect-[21/9] w-full overflow-hidden">
                    <Image
                      src={urlFor(featured.mainImage).width(1200).height(514).url()}
                      alt={featured.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6 md:p-8">
                  {featured.timeline?.status && (
                    <span className="inline-block mb-3 px-2.5 py-1 bg-cranberry-100 text-cranberry-700 text-xs font-medium capitalize">
                      {featured.timeline.status}
                    </span>
                  )}
                  <h3 className="text-2xl font-bold text-charcoal-900 group-hover:text-cranberry-600 transition-colors duration-200">
                    {featured.title}
                  </h3>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {remaining.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {remaining.map((project, index) => (
              <ProjectCard key={project._id} project={project} index={index} />
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-end">
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
