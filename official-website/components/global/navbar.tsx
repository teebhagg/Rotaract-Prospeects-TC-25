"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }

    const updateScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, [isHome]);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/events", label: "Events" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  const navState = !isHome || isScrolled;

  return (
    <>
      <motion.nav
        initial={false}
        animate={{
          backgroundColor: navState
            ? "oklch(0.97 0.008 35 / 0.95)"
            : "transparent",
          backdropFilter: navState ? "blur(12px)" : "blur(0px)",
          borderBottom: navState
            ? "1px solid oklch(0.90 0.015 35)"
            : "1px solid transparent",
        }}
        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
        className={cn(
          "fixed top-0 w-full",
          isOpen ? "z-[80]" : "z-50"
        )}
        style={{ height: 72 }}
      >
        <div className="mx-auto flex h-full items-center justify-between px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <motion.div
              className={cn(
                "flex h-10 w-10 items-center justify-center font-bold transition-colors duration-300",
                navState
                  ? "bg-cranberry-500 text-white"
                  : "bg-white text-cranberry-600"
              )}
            >
              RT
            </motion.div>
            <AnimatePresence mode="wait">
              {!navState && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="hidden font-bold text-white sm:inline-block text-lg tracking-tight"
                >
                  Rotaract TC-25
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <div className="hidden items-center space-x-1 md:flex">
            <div className="flex space-x-8 mr-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative text-sm font-medium transition-colors duration-200 py-2",
                    pathname === item.href
                      ? "text-cranberry-600"
                      : navState
                        ? "text-charcoal-700 hover:text-cranberry-600"
                        : "text-white/90 hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <Button
              variant={navState ? "default" : "outline"}
              className={cn(
                "px-6",
                !navState &&
                  "border-white text-white hover:bg-white hover:text-cranberry-600"
              )}
            >
              Join Us
            </Button>
          </div>

          <button
            className={cn(
              "relative z-[70] flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden",
              isOpen || navState ? "text-cranberry-600" : "text-white"
            )}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={
                  isOpen
                    ? {
                        rotate: i === 0 ? 45 : i === 2 ? -45 : 0,
                        y: i === 0 ? 8 : i === 2 ? -8 : 0,
                        opacity: i === 1 ? 0 : 1,
                      }
                    : { rotate: 0, y: 0, opacity: 1 }
                }
                transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                className="h-0.5 w-6 bg-current"
              />
            ))}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{
              duration: 0.4,
              ease: [0.25, 1, 0.5, 1],
            }}
            className="fixed inset-0 z-[65] flex flex-col bg-warm-50 md:hidden overflow-y-auto"
          >
            <div className="flex flex-col items-center justify-center min-h-screen py-24 px-6 space-y-4">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.06 + 0.15,
                    duration: 0.5,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                  className="w-full text-center"
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "block py-2 text-2xl font-normal transition-colors duration-200",
                      pathname === item.href
                        ? "text-cranberry-600 font-medium"
                        : "text-charcoal-700 hover:text-cranberry-600"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: navItems.length * 0.06 + 0.15,
                  duration: 0.5,
                  ease: [0.25, 1, 0.5, 1],
                }}
                className="w-full pt-8 flex justify-center"
              >
                <Button size="lg" className="w-full max-w-[240px]">
                  Join Us
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
