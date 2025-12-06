import Link from 'next/link'
import {Button} from '@/components/ui/button'
import {SectionContainer} from '@/components/layout/section-container'

export default function NotFound() {
  return (
    <SectionContainer>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h1 className="mb-4 text-6xl font-bold">404</h1>
        <h2 className="mb-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="mb-8 text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Link href="/">
          <Button size="lg">Go Home</Button>
        </Link>
      </div>
    </SectionContainer>
  )
}

