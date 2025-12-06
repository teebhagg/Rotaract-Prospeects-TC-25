"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { urlFor } from "@/sanity/lib/image";
import { GalleryImage } from "@/sanity/types";
import Image from "next/image";

interface GalleryModalProps {
  image: GalleryImage | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GalleryModal({ image, isOpen, onClose }: GalleryModalProps) {
  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        <div className="relative w-full h-[60vh] min-h-[400px] bg-muted flex-shrink-0">
          <Image
            src={urlFor(image.image).width(1200).height(800).url()}
            alt={image.title || "Gallery image"}
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="flex flex-col flex-1 overflow-hidden p-6 min-h-0 bg-background">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-2xl mb-2">
              {image.title || "Gallery Image"}
            </DialogTitle>
          </DialogHeader>
          {image.description && (
            <DialogDescription asChild>
              <div className="mt-2 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {image.description}
                </p>
              </div>
            </DialogDescription>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
