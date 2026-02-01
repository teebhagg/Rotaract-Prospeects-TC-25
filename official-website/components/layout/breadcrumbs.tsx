"use client";

import React from "react";
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function PageBreadcrumbs() {
  const pathname = usePathname();

  // Don't show breadcrumbs on home page
  if (pathname === "/") {
    return null;
  }

  // Generate breadcrumb items from pathname
  const pathSegments = pathname.split("/").filter((segment) => segment);

  const breadcrumbs = [
    { label: "Home", href: "/", isActive: false },
    ...pathSegments.map((segment, index) => ({
      label: segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      href: "/" + pathSegments.slice(0, index + 1).join("/"),
      isActive: index === pathSegments.length - 1,
    })),
  ];

  return (
    <div className="container mx-auto px-6 py-3">
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2">
        <Breadcrumb>
          <BreadcrumbList className="flex items-center space-x-1">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={item.href}>
                <BreadcrumbItem className="flex items-center">
                  {index === 0 ? (
                    <BreadcrumbLink
                      href={item.href}
                      className="flex items-center space-x-1 hover:text-primary transition-colors"
                      aria-label="Go to Home"
                    >
                      <Home className="h-4 w-4" />
                      <span className="sr-only">Home</span>
                    </BreadcrumbLink>
                  ) : item.isActive ? (
                    <BreadcrumbPage className="font-semibold text-primary">
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href={item.href}
                      className="hover:text-primary transition-colors"
                    >
                      {item.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator className="text-muted-foreground/50" />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </nav>
    </div>
  );
}
