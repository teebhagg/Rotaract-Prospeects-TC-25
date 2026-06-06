'use client'

import Image from 'next/image'
import {urlFor} from '@/sanity/lib/image'
import {Leadership} from '@/sanity/types'
import {motion} from 'framer-motion'
import {staggerItem} from '@/lib/animations'
import {Mail} from 'lucide-react'

interface LeadershipCardProps {
  leader: Leadership
  index?: number
}

export function LeadershipCard({leader, index = 0}: LeadershipCardProps) {
  return (
    <motion.div variants={staggerItem}>
      <div className="group text-center">
        {leader.image && (
          <div className="relative mx-auto w-40 h-52 overflow-hidden">
            <Image
              src={urlFor(leader.image).width(320).height(416).url()}
              alt={leader.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <div className="mt-4 h-0.5 w-12 mx-auto bg-cranberry-400 group-hover:w-16 group-hover:bg-cranberry-500 transition-all duration-300" />
        <div className="mt-4">
          <h3 className="text-lg font-bold text-charcoal-900">
            {leader.name}
          </h3>
          {leader.role && (
            <p className="mt-1 text-sm text-cranberry-600 font-medium">
              {leader.role}
            </p>
          )}
        </div>
        {leader.email && (
          <a
            href={`mailto:${leader.email}`}
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-charcoal-400 hover:text-cranberry-600 transition-colors duration-200"
          >
            <Mail className="h-3.5 w-3.5" />
            Contact
          </a>
        )}
      </div>
    </motion.div>
  )
}
