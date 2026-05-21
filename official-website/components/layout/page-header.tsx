"use client";

import { fadeInUp } from "@/lib/animations";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      className="mb-12 text-center"
    >
      <span className="block h-1 w-12 bg-coral-500 mx-auto mb-6" />
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-charcoal-900">
        {title}
      </h1>
      {description && (
        <p className="mt-4 text-lg text-charcoal-500 max-w-2xl mx-auto">
          {description}
        </p>
      )}
      {children}
    </motion.div>
  );
}
