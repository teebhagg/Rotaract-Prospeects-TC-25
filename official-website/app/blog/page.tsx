import { BlogCard } from "@/components/cards/blog-card";
import { PageHeader } from "@/components/layout/page-header";
import { SectionContainer } from "@/components/layout/section-container";
import { AnimatedDiv } from "@/components/ui/animated-div";
import { staggerContainer } from "@/lib/animations";
import { getBlogPosts } from "@/sanity/queries/blog";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  return {
    title: "Blog | Rotaract TC-25",
    description: "Read our latest stories and updates",
  };
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <SectionContainer>
      <PageHeader
        title="Blog"
        description="Stay updated with our latest stories and news"
      />
      {posts.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No blog posts available at the moment. Check back soon!
        </p>
      ) : (
        <AnimatedDiv
          variants={staggerContainer}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <BlogCard key={post._id} blog={post} index={index} />
          ))}
        </AnimatedDiv>
      )}
    </SectionContainer>
  );
}
