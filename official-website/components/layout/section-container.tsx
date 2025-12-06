import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
}

export function SectionContainer({
  children,
  className,
}: SectionContainerProps) {
  return (
    <section
      className={cn(
        "container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24",
        className
      )}>
      {children}
    </section>
  );
}
