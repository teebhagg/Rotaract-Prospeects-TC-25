"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { SectionContainer } from "@/components/layout/section-container";
import { urlFor } from "@/sanity/lib/image";
import { Partner } from "@/sanity/types";
import { motion, useReducedMotion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

interface PartnersSectionProps {
  partners?: Partner[];
}

function PartnerLogo({ partner }: { partner: Partner }) {
  if (!partner.logo) return null;

  const inner = (
    <div className="flex h-16 w-[140px] shrink-0 items-center justify-center px-3 md:h-20 md:w-[180px] md:px-5">
      <Image
        src={urlFor(partner.logo).width(240).height(120).url()}
        alt={partner.name}
        width={200}
        height={100}
        className="h-10 w-auto max-w-[140px] object-contain opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 md:h-12 md:max-w-[160px]"
      />
    </div>
  );

  if (partner.website) {
    return (
      <a
        href={partner.website}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex shrink-0"
      >
        {inner}
      </a>
    );
  }

  return (
    <div
      className="group inline-flex shrink-0"
      role="img"
      aria-label={partner.name}
    >
      {inner}
    </div>
  );
}

export function PartnersSection({ partners }: PartnersSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  if (!partners || partners.length === 0) return null;

  const loop = [...partners, ...partners, ...partners];
  const durationSec = Math.min(50, Math.max(20, partners.length * 10));

  const marqueeStyle = {
    "--partners-marquee-duration": `${durationSec}s`,
  } as CSSProperties;

  return (
    <SectionContainer>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeInUp}
      >
        <div className="mb-10">
          <span className="block h-1 w-12 bg-cranberry-500 mb-4" />
          <h2 className="text-3xl font-extrabold sm:text-4xl text-charcoal-900">
            Our Partners
          </h2>
          <p className="mt-3 text-lg text-charcoal-500 max-w-xl">
            Organizations we collaborate with
          </p>
        </div>

        {prefersReducedMotion ? (
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 py-10">
            {partners.map((partner) => (
              <PartnerLogo key={partner._id} partner={partner} />
            ))}
          </div>
        ) : (
          <div className="partners-marquee-track relative overflow-hidden">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-warm-50 to-transparent md:w-40"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-warm-50 to-transparent md:w-40"
              aria-hidden
            />

            <div
              className="flex w-max animate-partners-marquee"
              style={marqueeStyle}
            >
              {loop.map((partner, index) => (
                <PartnerLogo
                  key={`${partner._id}-${index}`}
                  partner={partner}
                />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </SectionContainer>
  );
}
