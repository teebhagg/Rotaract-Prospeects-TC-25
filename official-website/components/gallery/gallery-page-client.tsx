'use client'

import {useState} from 'react'
import {AnimatedDiv} from '@/components/ui/animated-div'
import {staggerContainer} from '@/lib/animations'
import {GalleryItem} from '@/components/gallery/gallery-item'
import {GalleryModal} from '@/components/gallery/gallery-modal'
import {GalleryImage} from '@/sanity/types'

interface GalleryPageClientProps {
  images: GalleryImage[]
}

export function GalleryPageClient({images}: GalleryPageClientProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  return (
    <>
      <AnimatedDiv
        variants={staggerContainer}
        className="columns-1 gap-4 md:columns-2 lg:columns-3"
      >
        {images.map((image, index) => (
          <GalleryItem
            key={image._id}
            image={image}
            index={index}
            onClick={() => setSelectedImage(image)}
          />
        ))}
      </AnimatedDiv>
      <GalleryModal
        image={selectedImage}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  )
}

