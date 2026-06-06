import { cn } from "@/lib/utils";
import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-none font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cranberry-500 cursor-pointer disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-cranberry-500 text-white hover:bg-cranberry-600 hover:scale-[1.02]":
              variant === "default",
            "border-2 border-cranberry-500 bg-transparent text-cranberry-600 hover:bg-cranberry-500 hover:text-white hover:scale-[1.02]":
              variant === "outline",
            "text-charcoal-700 hover:bg-cranberry-50 hover:text-cranberry-600":
              variant === "ghost",
            "h-10 px-5 py-2": size === "default",
            "h-9 px-4": size === "sm",
            "h-12 px-8 text-lg": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
