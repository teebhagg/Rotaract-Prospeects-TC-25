import { ValueIcon } from "@/components/about/value-icon";
import { LeadershipCard } from "@/components/cards/leadership-card";
import { PageHeader } from "@/components/layout/page-header";
import { SectionContainer } from "@/components/layout/section-container";
import { AnimatedDiv } from "@/components/ui/animated-div";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { urlFor } from "@/sanity/lib/image";
import { getAboutPage } from "@/sanity/queries/aboutPage";
import { PortableText } from "@portabletext/react";
import Image from "next/image";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const aboutPage = await getAboutPage();

  return {
    title: aboutPage?.seo?.metaTitle || aboutPage?.title || "About Us",
    description:
      aboutPage?.seo?.metaDescription || "Learn about Rotaract TC-25",
  };
}

export default async function AboutPage() {
  const aboutPage = await getAboutPage();

  if (!aboutPage) {
    return (
      <SectionContainer>
        <PageHeader title="About Us" />
        <p className="text-center text-charcoal-500">
          Content is being set up. Please check back soon.
        </p>
      </SectionContainer>
    );
  }

  return (
    <>
      <SectionContainer>
        <PageHeader title={aboutPage.title} />
        {aboutPage.mainImage && (
          <div className="relative mb-12 h-64 w-full overflow-hidden rounded-none md:h-96">
            <Image
              src={urlFor(aboutPage.mainImage).width(1200).height(600).url()}
              alt={aboutPage.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {aboutPage.mission && (
          <AnimatedDiv variants={fadeInUp} className="mb-12">
            <h2 className="mb-4 text-3xl font-extrabold text-charcoal-900">
              {aboutPage.mission.title || "Our Mission"}
            </h2>
            {aboutPage.mission.content && (
              <div className="prose prose-lg max-w-none">
                <PortableText value={aboutPage.mission.content} />
              </div>
            )}
          </AnimatedDiv>
        )}

        {aboutPage.vision && (
          <AnimatedDiv variants={fadeInUp} className="mb-12">
            <h2 className="mb-4 text-3xl font-extrabold text-charcoal-900">
              {aboutPage.vision.title || "Our Vision"}
            </h2>
            {aboutPage.vision.content && (
              <div className="prose prose-lg max-w-none">
                <PortableText value={aboutPage.vision.content} />
              </div>
            )}
          </AnimatedDiv>
        )}

        {aboutPage.values && aboutPage.values.length > 0 && (
          <AnimatedDiv variants={staggerContainer} className="mb-12">
            <div className="mb-8 text-center">
              <span className="block h-1 w-12 bg-cranberry-500 mx-auto mb-4" />
              <h2 className="text-3xl font-extrabold text-charcoal-900">Our Values</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {aboutPage.values.map((value, index) => (
                <AnimatedDiv
                  key={index}
                  variants={fadeInUp}
                  className="border border-charcoal-200 p-6 text-center bg-warm-100">
                  {value.icon && (
                    <div className="mb-4 flex justify-center">
                      <ValueIcon
                        name={value.icon}
                        className="h-10 w-10 text-cranberry-600"
                      />
                    </div>
                  )}
                  <h3 className="mb-2 text-xl font-semibold text-charcoal-900">{value.title}</h3>
                  <p className="text-charcoal-500">{value.description}</p>
                </AnimatedDiv>
              ))}
            </div>
          </AnimatedDiv>
        )}

        {aboutPage.timeline && aboutPage.timeline.length > 0 && (
          <AnimatedDiv variants={staggerContainer} className="mb-12">
            <div className="mb-8 text-center">
              <span className="block h-1 w-12 bg-cranberry-500 mx-auto mb-4" />
              <h2 className="text-3xl font-extrabold text-charcoal-900">
                Our Timeline
              </h2>
            </div>
            <div className="space-y-8">
              {aboutPage.timeline.map((item, index) => (
                <AnimatedDiv
                  key={index}
                  variants={fadeInUp}
                  className="flex flex-col gap-4 md:flex-row">
                  <div className="md:w-1/4">
                    <div className="text-2xl font-bold text-cranberry-600">
                      {item.year}
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="mb-2 text-xl font-semibold text-charcoal-900">{item.title}</h3>
                    <p className="text-charcoal-500">{item.description}</p>
                    {item.image && (
                      <div className="relative mt-4 h-48 w-full overflow-hidden rounded-none">
                        <Image
                          src={urlFor(item.image).width(600).height(300).url()}
                          alt={item.title || ""}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </AnimatedDiv>
              ))}
            </div>
          </AnimatedDiv>
        )}
      </SectionContainer>

      {aboutPage.leadershipSection &&
        aboutPage.leadershipSection.leaders &&
        aboutPage.leadershipSection.leaders.length > 0 && (
          <SectionContainer className="bg-cranberry-50">
            <div className="mb-8 text-center">
              <span className="block h-1 w-12 bg-cranberry-500 mx-auto mb-4" />
              <h2 className="text-3xl font-extrabold text-charcoal-900">
                {aboutPage.leadershipSection.title || "Our Leadership"}
              </h2>
              {aboutPage.leadershipSection.description && (
                <p className="mt-2 text-charcoal-500">
                  {aboutPage.leadershipSection.description}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {aboutPage.leadershipSection.leaders.map((leader, index) => (
                <LeadershipCard
                  key={leader._id}
                  leader={leader}
                  index={index}
                />
              ))}
            </div>
          </SectionContainer>
        )}
    </>
  );
}
