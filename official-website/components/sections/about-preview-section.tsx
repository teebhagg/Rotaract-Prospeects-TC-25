"use client";

import { fadeInUp, slideInLeft, slideInRight } from "@/lib/animations";
import { urlFor } from "@/sanity/lib/image";
import { HomePage } from "@/sanity/types";
import { PortableText } from "@portabletext/react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import Image from "next/image";

interface AboutPreviewSectionProps {
  aboutPreview: HomePage["aboutPreview"];
}

export function AboutPreviewSection({
  aboutPreview,
}: AboutPreviewSectionProps) {
  if (!aboutPreview) return null;

  return (
    <div className="w-full bg-primary-500 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 gap-12 ${aboutPreview.image ? "md:grid-cols-2 md:items-center" : "max-w-4xl mx-auto"}`}>
          {aboutPreview.image && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={slideInLeft}
              className="relative h-64 w-full overflow-hidden rounded-none md:h-96">
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
            variants={aboutPreview.image ? slideInRight : fadeInUp}
            className={aboutPreview.image ? "" : "text-center"}>
            {aboutPreview.title && (
              <h2 className="mb-6 text-3xl font-bold sm:text-4xl flex items-center gap-3 text-white">
                <Users className="w-8 h-8 text-white" />
                {aboutPreview.title}
              </h2>
            )}
            {aboutPreview.content && (
              <div className="prose prose-lg max-w-none text-white/90 leading-relaxed">
                <PortableText value={aboutPreview.content} />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
