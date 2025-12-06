import {notFound} from 'next/navigation'
import {getBlogPost, getBlogPosts} from '@/sanity/queries/blog'
import {SectionContainer} from '@/components/layout/section-container'
import Image from 'next/image'
import {urlFor} from '@/sanity/lib/image'
import {PortableText} from '@portabletext/react'
import {AnimatedDiv} from '@/components/ui/animated-div'
import {fadeInUp} from '@/lib/animations'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug.current,
  }))
}

export async function generateMetadata({params}: {params: {slug: string}}) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt || `Read ${post.title}`,
  }
}

export default async function BlogPostPage({params}: {params: {slug: string}}) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  const publishedDate = new Date(post.publishedAt)
  const formattedDate = publishedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <SectionContainer>
      <AnimatedDiv
        variants={fadeInUp}
        className="max-w-4xl mx-auto"
      >
        <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>
        <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>{formattedDate}</span>
          {post.author?.name && <span>By {post.author.name}</span>}
        </div>
        {post.mainImage && (
          <div className="relative mb-8 h-96 w-full overflow-hidden rounded-none">
            <Image
              src={urlFor(post.mainImage).width(1200).height(600).url()}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="prose prose-lg max-w-none">
          <PortableText value={post.content} />
        </div>
      </AnimatedDiv>
    </SectionContainer>
  )
}

