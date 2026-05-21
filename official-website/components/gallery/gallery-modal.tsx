"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { urlFor } from "@/sanity/lib/image";
import { GalleryImage } from "@/sanity/types";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface GalleryModalProps {
  image: GalleryImage | null;
  isOpen: boolean;
  onClose: () => void;
  allImages?: GalleryImage[];
}

export function GalleryModal({
  image,
  isOpen,
  onClose,
  allImages = [],
}: GalleryModalProps) {
  const [localIndex, setLocalIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      wasOpen.current = false;
      return;
    }
    if (!wasOpen.current && image) {
      const idx = allImages.findIndex((img) => img._id === image._id);
      setLocalIndex(idx >= 0 ? idx : 0);
      setDirection(0);
      wasOpen.current = true;
    }
  }, [isOpen, image, allImages]);

  const navigate = useCallback(
    (dir: number) => {
      if (allImages.length <= 1) return;
      const next = (localIndex + dir + allImages.length) % allImages.length;
      setDirection(dir);
      setLocalIndex(next);
    },
    [localIndex, allImages.length]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, navigate, onClose]);

  const displayImage = allImages[localIndex] || image;
  if (!displayImage) return null;

  const hasNavigation = allImages.length > 1;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      transition: { duration: 0.25, ease: [0.25, 1, 0.5, 1] },
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-charcoal-900/95 backdrop-blur-sm" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-[110] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {hasNavigation && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(-1);
                }}
                className="absolute left-4 z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(1);
                }}
                className="absolute right-4 z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            className="relative z-[105] w-full max-w-5xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={displayImage._id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col items-center"
              >
                <div className="relative w-full max-h-[75vh] overflow-hidden flex items-center justify-center">
                  <Image
                    src={urlFor(displayImage.image).width(1400).height(900).url()}
                    alt={displayImage.title || "Gallery image"}
                    width={1400}
                    height={900}
                    className="w-auto h-auto max-w-full max-h-[75vh] object-contain"
                    priority
                  />
                </div>

                {(displayImage.title || displayImage.description) && (
                  <div className="mt-6 text-center max-w-2xl">
                    {displayImage.title && (
                      <h3 className="text-xl font-bold text-white mb-2">
                        {displayImage.title}
                      </h3>
                    )}
                    {displayImage.description && typeof displayImage.description === "string" && (
                      <p className="text-sm text-white/60 leading-relaxed">
                        {displayImage.description}
                      </p>
                    )}
                  </div>
                )}

                {hasNavigation && (
                  <div className="mt-4 flex items-center gap-2 text-white/40 text-sm">
                    <span className="text-white/70 font-medium">
                      {localIndex + 1}
                    </span>
                    <span>/</span>
                    <span>{allImages.length}</span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
