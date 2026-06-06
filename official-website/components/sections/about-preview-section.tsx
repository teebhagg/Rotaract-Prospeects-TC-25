"use client";

import { slideInLeft, slideInRight } from "@/lib/animations";
import { urlFor } from "@/sanity/lib/image";
import { HomePage } from "@/sanity/types";
import { PortableText } from "@portabletext/react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AboutPreviewSectionProps {
  aboutPreview: HomePage["aboutPreview"];
}

export function AboutPreviewSection({
  aboutPreview,
}: AboutPreviewSectionProps) {
  if (!aboutPreview) return null;

  return (
    <section className="bg-warm-50 px-4 sm:px-6 lg:px-8 py-[clamp(3rem,8vw,6rem)]">
      <div className="mx-auto max-w-7xl">
        <div
          className={`grid gap-12 lg:gap-16 ${
            aboutPreview.image
              ? "md:grid-cols-2 md:items-center"
              : "max-w-4xl mx-auto"
          }`}
        >
          {aboutPreview.image && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={slideInLeft}
              className="relative aspect-[4/3] w-full overflow-hidden"
            >
              <Image
                src={urlFor(aboutPreview.image).width(800).height(600).url()}
                alt={aboutPreview.title || "About us"}
                fill
                className="object-cover"
              />
            </motion.div>
          )}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={aboutPreview.image ? slideInRight : slideInLeft}
            className={aboutPreview.image ? "" : "text-center"}
          >
            <span className="block h-1 w-12 bg-cranberry-500 mb-6" />
            {aboutPreview.title && (
              <h2 className="mb-6 text-3xl font-extrabold sm:text-4xl text-charcoal-900">
                {aboutPreview.title}
              </h2>
            )}
            {aboutPreview.content && (
              <div className="prose prose-lg max-w-none text-charcoal-600 leading-relaxed prose-p:mb-4 prose-a:text-cranberry-600 prose-a:no-underline hover:prose-a:underline">
                <PortableText value={aboutPreview.content} />
              </div>
            )}
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 text-cranberry-600 font-medium hover:text-cranberry-700 transition-colors duration-200"
            >
              Read our full story
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
