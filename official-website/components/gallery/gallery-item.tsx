'use client'

import Image from 'next/image'
import {motion} from 'framer-motion'
import {staggerItem} from '@/lib/animations'
import {urlFor} from '@/sanity/lib/image'
import {GalleryImage} from '@/sanity/types'

interface GalleryItemProps {
  image: GalleryImage
  index: number
  onClick: () => void
}

export function GalleryItem({image, index, onClick}: GalleryItemProps) {
  // Helper function to get description text
  const getDescriptionText = () => {
    if (!image.description) return ''
    if (typeof image.description === 'string') return image.description
    // For Portable Text, extract plain text (simplified)
    return 'View full description'
  }

  const descriptionText = getDescriptionText()

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{once: true, margin: "-50px"}}
      variants={staggerItem}
      transition={{delay: index * 0.1}}
      className="mb-4 break-inside-avoid cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-none transition-transform duration-300 group-hover:scale-[1.02]">
        <Image
          src={urlFor(image.image).width(600).height(800).url()}
          alt={image.title || 'Gallery image'}
          width={600}
          height={800}
          className="w-full h-auto"
        />
        {(image.title || descriptionText) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4 text-white">
            {image.title && (
              <p className="font-semibold mb-1">{image.title}</p>
            )}
            {descriptionText && (
              <p className="text-sm opacity-90 line-clamp-2">
                {descriptionText}
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

