import { AboutPreviewSection } from "@/components/sections/about-preview-section";
import { BlogSection } from "@/components/sections/blog-section";
import { CallToActionSection } from "@/components/sections/call-to-action-section";
import { EventsSection } from "@/components/sections/events-section";
import { FeaturedProjectsSection } from "@/components/sections/featured-projects-section";
import { GalleryPreviewSection } from "@/components/sections/gallery-preview-section";
import { HeroSection } from "@/components/sections/hero-section";
import { PartnersSection } from "@/components/sections/partners-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { getHomePage } from "@/sanity/queries/homePage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const homePage = await getHomePage();

  if (!homePage) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Welcome to Rotaract TC-25</h1>
        <p className="mt-4 text-muted-foreground">
          Content is being set up. Please check back soon.
        </p>
      </div>
    );
  }

  return (
    <>
      {homePage.hero && <HeroSection hero={homePage.hero} />}
      {homePage.aboutPreview && (
        <AboutPreviewSection aboutPreview={homePage.aboutPreview} />
      )}
      {homePage.featuredProjects && homePage.featuredProjects.length > 0 && (
        <FeaturedProjectsSection projects={homePage.featuredProjects} />
      )}
      {homePage.upcomingEvents && homePage.upcomingEvents.length > 0 && (
        <EventsSection events={homePage.upcomingEvents} />
      )}
      {homePage.featuredBlogPosts && homePage.featuredBlogPosts.length > 0 && (
        <BlogSection posts={homePage.featuredBlogPosts} />
      )}
      {homePage.galleryPreview && homePage.galleryPreview.length > 0 && (
        <GalleryPreviewSection galleryImages={homePage.galleryPreview} />
      )}
      {homePage.testimonials && homePage.testimonials.length > 0 && (
        <TestimonialsSection testimonials={homePage.testimonials} />
      )}
      {homePage.partners && homePage.partners.length > 0 && (
        <PartnersSection partners={homePage.partners} />
      )}
      {homePage.cta && <CallToActionSection cta={homePage.cta} />}
    </>
  );
}
