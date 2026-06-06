"use client";

import { Button } from "@/components/ui/button";
import { heroCta, heroHeading, heroImagery, heroSubheading, orchestratedHero } from "@/lib/animations";
import { urlFor } from "@/sanity/lib/image";
import { HomePage } from "@/sanity/types";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HeroSectionProps {
  hero: HomePage["hero"];
}

export function HeroSection({ hero }: HeroSectionProps) {
  if (!hero) return null;

  const hasBackground =
    hero.backgroundType === "video" ? hero.video?.asset?.url : hero.image;
  const isVideo = hero.backgroundType === "video" && hero.video?.asset?.url;
  const isImage = hero.backgroundType === "image" && hero.image;
  const videoUrl = hero.video?.asset?.url;
  const videoMimeType = hero.video?.asset?.mimeType || "video/mp4";

  return (
    <section
      className={`relative min-h-screen flex items-center overflow-hidden ${
        hasBackground ? "" : "bg-warm-50"
      }`}
    >
      {!hasBackground && (
        <>
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-cranberry-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-cranberry-100/40 rounded-full blur-3xl" />
        </>
      )}

      {isVideo && videoUrl && (
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={videoUrl} type={videoMimeType} />
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/80 via-charcoal-900/50 to-transparent" />
        </div>
      )}

      {isImage && hero.image && (
        <div className="absolute inset-0 z-0">
          <Image
            src={urlFor(hero.image).width(1920).height(1080).url()}
            alt="Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/80 via-charcoal-900/50 to-transparent" />
        </div>
      )}

      <div
        className={`container relative z-40 mx-auto px-4 sm:px-6 lg:px-8 ${
          hasBackground ? "text-white" : ""
        }`}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={orchestratedHero}
          className="max-w-3xl"
        >
          {hero.heading && (
            <motion.h1
              variants={heroHeading}
              className={`mb-6 text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-balance ${
                hasBackground ? "text-white" : "text-charcoal-900"
              }`}
            >
              {!hasBackground && (
                <span className="block h-1 w-16 bg-cranberry-500 mb-6" />
              )}
              {hero.heading.includes("Rotaract Tema Community 25") ? (
                <>
                  {hero.heading.split("Rotaract Tema Community 25")[0]}
                  <span
                    className={
                      hasBackground
                        ? "text-cranberry-300"
                        : "text-cranberry-600"
                    }
                  >
                    Rotaract Tema Community 25
                  </span>
                  {hero.heading.split("Rotaract Tema Community 25")[1]}
                </>
              ) : (
                hero.heading
              )}
            </motion.h1>
          )}
          {hero.subheading && (
            <motion.p
              variants={heroSubheading}
              className={`mb-10 text-lg sm:text-xl md:text-2xl leading-relaxed max-w-2xl text-balance ${
                hasBackground ? "text-white/85" : "text-charcoal-500"
              }`}
            >
              {hero.subheading}
            </motion.p>
          )}
          {hero.ctaText && hero.ctaLink && (
            <motion.div
              variants={heroCta}
              className="flex flex-wrap gap-4"
            >
              <Link href={hero.ctaLink}>
                <Button size="lg" className="group">
                  {hero.ctaText}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant={hasBackground ? "outline" : "ghost"}
                  className={
                    hasBackground
                      ? "border-white/40 text-white hover:bg-white hover:text-charcoal-900"
                      : ""
                  }
                >
                  Learn More
                </Button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
