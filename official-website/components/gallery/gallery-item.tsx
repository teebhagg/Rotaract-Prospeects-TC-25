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
  const getDescriptionText = () => {
    if (!image.description) return ''
    if (typeof image.description === 'string') return image.description
    return 'View full description'
  }

  const descriptionText = getDescriptionText()

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{once: true, margin: "-50px"}}
      variants={staggerItem}
      transition={{delay: index * 0.05}}
      className="cursor-pointer group overflow-hidden aspect-[4/3]"
      onClick={onClick}
    >
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={urlFor(image.image).width(600).height(450).url()}
          alt={image.title || 'Gallery image'}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {(image.title || descriptionText) && (
          <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/50 transition-colors duration-300 flex items-end">
            <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {image.title && (
                <p className="font-semibold mb-1">{image.title}</p>
              )}
              {descriptionText && (
                <p className="text-sm text-white/70 line-clamp-2">
                  {descriptionText}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
