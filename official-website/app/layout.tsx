import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import './globals.css'
import {Navbar} from '@/components/global/navbar'
import {Footer} from '@/components/global/footer'
import {PageBreadcrumbs} from '@/components/layout/breadcrumbs'
import {getSiteSettings} from '@/sanity/queries/settings'
import {urlFor} from '@/sanity/lib/image'

const inter = Inter({subsets: ['latin']})

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  let ogImageUrl: string | undefined
  if (settings?.defaultSeo?.ogImage) {
    ogImageUrl = urlFor(settings.defaultSeo.ogImage).width(1200).height(630).url()
  }

  return {
    title: settings?.siteTitle || 'Rotaract TC-25',
    description: settings?.defaultSeo?.metaDescription || 'Rotaract TC-25 Official Website',
    openGraph: {
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <PageBreadcrumbs />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

