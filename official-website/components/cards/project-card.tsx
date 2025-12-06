'use client'

import Link from 'next/link'
import Image from 'next/image'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
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
    <motion.div
      variants={staggerItem}
    >
      <Link href={`/projects/${project.slug.current}`}>
        <Card className="group h-full overflow-hidden card-hover">
          {project.mainImage && (
            <div className="relative h-48 w-full overflow-hidden rounded-none">
              <Image
                src={urlFor(project.mainImage).width(600).height(400).url()}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}
          <CardHeader className="pb-4">
            <CardTitle className="group-hover:text-primary transition-colors duration-300">
              {project.title}
            </CardTitle>
            {project.timeline?.status && (
              <CardDescription className="capitalize inline-block px-3 py-1 rounded-none bg-primary/10 text-primary text-xs font-medium">
                {project.timeline.status}
              </CardDescription>
            )}
          </CardHeader>
        </Card>
      </Link>
    </motion.div>
  )
}

