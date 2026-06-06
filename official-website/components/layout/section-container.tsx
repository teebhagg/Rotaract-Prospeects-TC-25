import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "accent" | "dark";
}

export function SectionContainer({
  children,
  className,
  variant = "default",
}: SectionContainerProps) {
  return (
    <section
      className={cn(
        "px-4 sm:px-6 lg:px-8",
        "py-[clamp(3rem,8vw,6rem)]",
        {
          "bg-warm-50": variant === "default",
          "bg-cranberry-50": variant === "accent",
          "bg-charcoal-900 text-white": variant === "dark",
        },
        className
      )}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}
