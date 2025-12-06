'use client'

import Link from 'next/link'
import Image from 'next/image'
import {SectionContainer} from '@/components/layout/section-container'
import {Button} from '@/components/ui/button'
import {urlFor} from '@/sanity/lib/image'
import {GalleryImage} from '@/sanity/types'
import {motion} from 'framer-motion'
import {staggerContainer, staggerItem} from '@/lib/animations'
import {ImageIcon, ArrowRight} from 'lucide-react'

interface GalleryPreviewSectionProps {
  galleryImages?: GalleryImage[]
}

export function GalleryPreviewSection({galleryImages}: GalleryPreviewSectionProps) {
  if (!galleryImages || galleryImages.length === 0) return null

  const previewImages = galleryImages.slice(0, 6)

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
            <ImageIcon className="w-8 h-8 text-primary" />
            Gallery
          </h2>
          <p className="text-lg text-muted-foreground">
            Moments from our activities
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {previewImages.map((image, index) => (
            <motion.div
              key={image._id}
              variants={staggerItem}
              className="group relative aspect-square overflow-hidden rounded-none transition-all duration-300"
            >
              <Image
                src={urlFor(image.image).width(400).height(400).url()}
                alt={image.title || 'Gallery image'}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/gallery">
            <Button variant="outline" className="group">
              View Full Gallery
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </SectionContainer>
  )
}

