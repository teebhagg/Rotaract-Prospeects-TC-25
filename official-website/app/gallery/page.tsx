import {getGalleryImages} from '@/sanity/queries/gallery'
import {PageHeader} from '@/components/layout/page-header'
import {SectionContainer} from '@/components/layout/section-container'
import {AnimatedDiv} from '@/components/ui/animated-div'
import {staggerContainer} from '@/lib/animations'
import {GalleryItem} from '@/components/gallery/gallery-item'
import {GalleryModal} from '@/components/gallery/gallery-modal'
import {GalleryPageClient} from '@/components/gallery/gallery-page-client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata() {
  return {
    title: 'Gallery | Rotaract TC-25',
    description: 'Browse through our photo gallery',
  }
}

export default async function GalleryPage() {
  const images = await getGalleryImages()

  return (
    <SectionContainer>
      <PageHeader
        title="Gallery"
        description="Browse through our collection of memories"
      />
      {images.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Gallery is being set up. Check back soon!
        </p>
      ) : (
        <GalleryPageClient images={images} />
      )}
    </SectionContainer>
  )
}

