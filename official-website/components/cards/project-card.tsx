'use client'

import Link from 'next/link'
import Image from 'next/image'
import {urlFor} from '@/sanity/lib/image'
import {Project} from '@/sanity/types'
import {motion} from 'framer-motion'
import {staggerItem} from '@/lib/animations'

interface ProjectCardProps {
  project: Project
  index?: number
}

export function ProjectCard({project, index = 0}: ProjectCardProps) {
  return (
    <motion.div variants={staggerItem}>
      <Link href={`/projects/${project.slug.current}`} className="group block">
        <div className="overflow-hidden bg-warm-100 transition-shadow duration-400 hover:shadow-lg hover:shadow-charcoal-900/5">
          {project.mainImage && (
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={urlFor(project.mainImage).width(600).height(400).url()}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}
          <div className="p-5">
            {project.timeline?.status && (
              <span className="inline-block mb-3 px-2.5 py-1 bg-coral-100 text-coral-700 text-xs font-medium capitalize">
                {project.timeline.status}
              </span>
            )}
            <h3 className="text-lg font-bold text-charcoal-900 group-hover:text-coral-600 transition-colors duration-200">
              {project.title}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
