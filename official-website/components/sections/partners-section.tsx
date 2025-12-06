'use client'

import Image from 'next/image'
import {SectionContainer} from '@/components/layout/section-container'
import {urlFor} from '@/sanity/lib/image'
import {Partner} from '@/sanity/types'
import {motion} from 'framer-motion'
import {staggerContainer, staggerItem} from '@/lib/animations'
import {Handshake} from 'lucide-react'

interface PartnersSectionProps {
  partners?: Partner[]
}

export function PartnersSection({partners}: PartnersSectionProps) {
  if (!partners || partners.length === 0) return null

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
            <Handshake className="w-8 h-8 text-primary" />
            Our Partners
          </h2>
          <p className="text-lg text-muted-foreground">
            Organizations we collaborate with
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
          {partners.map((partner, index) => (
            <motion.a
              key={partner._id}
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              variants={staggerItem}
              className="group flex items-center justify-center p-6 rounded-none bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card transition-all duration-300"
            >
              {partner.logo && (
                <Image
                  src={urlFor(partner.logo).width(200).height(100).url()}
                  alt={partner.name}
                  width={200}
                  height={100}
                  className="h-16 w-auto object-contain opacity-60 transition-all duration-300 group-hover:opacity-100"
                />
              )}
            </motion.a>
          ))}
        </div>
      </motion.div>
    </SectionContainer>
  )
}

