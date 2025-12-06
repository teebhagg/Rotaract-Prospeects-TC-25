"use client";

import { Button } from "@/components/ui/button";
import { fadeInUp } from "@/lib/animations";
import { urlFor } from "@/sanity/lib/image";
import { HomePage } from "@/sanity/types";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
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
      className={`relative min-h-screen flex items-center justify-center overflow-hidden -mt-[100px] pt-[100px] ${hasBackground ? "" : "bg-gradient-to-br from-background via-background to-background"}`}>
      {/* Subtle background elements */}
      {!hasBackground && (
        <>
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        </>
      )}

      {/* Video Background */}
      {isVideo && videoUrl && (
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover">
            <source src={videoUrl} type={videoMimeType} />
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>
      )}

      {/* Image Background */}
      {isImage && hero.image && (
        <div className="absolute inset-0 z-0">
          <Image
            src={urlFor(hero.image).width(1920).height(1080).url()}
            alt="Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>
      )}

      <div
        className={`container relative z-40 mx-auto px-4 text-center ${hasBackground ? "text-white" : ""}`}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-5xl mx-auto">
          {hero.heading && (
            <h1
              className={`mb-6 text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl leading-tight ${hasBackground ? "text-white" : "text-foreground"}`}>
              <span className="inline-flex items-center gap-3">
                {!hasBackground && (
                  <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                )}
                {hero.heading}
              </span>
            </h1>
          )}
          {hero.subheading && (
            <p
              className={`mb-8 text-lg sm:text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto ${hasBackground ? "text-white/90" : "text-muted-foreground"}`}>
              {hero.subheading}
            </p>
          )}
          {hero.ctaText && hero.ctaLink && (
            <Link href={hero.ctaLink}>
              <Button size="lg" className="group">
                {hero.ctaText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
