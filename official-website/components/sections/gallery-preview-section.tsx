'use client'

import Link from 'next/link'
import Image from 'next/image'
import {SectionContainer} from '@/components/layout/section-container'
import {Button} from '@/components/ui/button'
import {urlFor} from '@/sanity/lib/image'
import {GalleryImage} from '@/sanity/types'
import {motion} from 'framer-motion'
import {staggerContainer, staggerItem} from '@/lib/animations'
import {ArrowRight} from 'lucide-react'

interface GalleryPreviewSectionProps {
  galleryImages?: GalleryImage[]
}

export function GalleryPreviewSection({galleryImages}: GalleryPreviewSectionProps) {
  if (!galleryImages || galleryImages.length === 0) return null

  const previewImages = galleryImages.slice(0, 8)

  return (
    <SectionContainer variant="accent">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{once: true, margin: "-50px"}}
        variants={staggerContainer}
      >
        <div className="mb-12">
          <span className="block h-1 w-12 bg-cranberry-500 mb-4" />
          <h2 className="text-3xl font-extrabold sm:text-4xl text-charcoal-900">
            Gallery
          </h2>
          <p className="mt-3 text-lg text-charcoal-500 max-w-xl">
            Moments that matter
          </p>
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {previewImages.map((image, index) => (
            <motion.div
              key={image._id}
              variants={staggerItem}
              className="group relative break-inside-avoid overflow-hidden"
            >
              <Image
                src={urlFor(image.image).width(400).url()}
                alt={image.title || 'Gallery image'}
                width={400}
                height={300}
                className="object-cover w-full transition-transform duration-500 group-hover:scale-105"
              />
              {image.title && (
                <div className="absolute inset-0 bg-cranberry-900/0 group-hover:bg-cranberry-900/40 transition-colors duration-300 flex items-end">
                  <p className="p-4 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {image.title}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex justify-end">
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
