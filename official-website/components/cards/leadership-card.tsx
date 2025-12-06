'use client'

import Image from 'next/image'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {urlFor} from '@/sanity/lib/image'
import {Leadership} from '@/sanity/types'
import {motion} from 'framer-motion'
import {staggerItem} from '@/lib/animations'

interface LeadershipCardProps {
  leader: Leadership
  index?: number
}

export function LeadershipCard({leader, index = 0}: LeadershipCardProps) {
  return (
    <motion.div
      variants={staggerItem}
    >
      <Card className="h-full text-center">
        {leader.image && (
          <div className="relative mx-auto mt-6 h-32 w-32 overflow-hidden rounded-none">
            <Image
              src={urlFor(leader.image).width(200).height(200).url()}
              alt={leader.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-xl">{leader.name}</CardTitle>
          <CardDescription>{leader.role}</CardDescription>
        </CardHeader>
        {leader.email && (
          <CardContent>
            <a
              href={`mailto:${leader.email}`}
              className="text-sm text-primary hover:underline"
            >
              {leader.email}
            </a>
          </CardContent>
        )}
      </Card>
    </motion.div>
  )
}

