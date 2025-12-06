"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 65);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/events", label: "Events" },
    { href: "/blog", label: "Blog" },
    { href: "/leadership", label: "Leadership" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  const isTransparent = isHomePage && !isScrolled;
  const shouldShowBorder = isScrolled;

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isTransparent && !isOpen ? "bg-transparent" : "bg-primary-50/95 backdrop-blur-sm"
      } ${shouldShowBorder ? "border-b border-border/40" : ""}`}>
      <div className="container mx-auto px-4">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? "h-16" : "h-[100px]"}`}>
          <Link
            href="/"
            className={`font-bold hover:text-primary/80 transition-all duration-300 ${
              isScrolled || isOpen
                ? "text-xl text-primary-500"
                : isTransparent
                  ? "text-2xl text-white font-black"
                  : "text-2xl text-primary-500 font-black"
            }`}>
            Rotaract TC 25
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-sm font-medium transition-all duration-300 hover:scale-110 group ${
                  isTransparent
                    ? "text-white/90 hover:text-white"
                    : "text-foreground/70 hover:text-primary-700"
                }`}>
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                    isTransparent ? "bg-white" : "bg-primary-700"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 ${isTransparent && !isOpen ? "text-white" : "text-foreground"}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden overflow-hidden bg-primary-50/98 backdrop-blur-sm border-t border-primary-200/50`}>
            <div className="space-y-1 py-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}>
                  <Link
                    href={item.href}
                    className={`relative block px-4 py-3 text-base font-medium transition-all duration-200 rounded-none group bg-primary-200/50
                    ${pathname === item.href ? "text-primary-700" : "text-foreground/80 bg-primary-200/50"} hover:text-primary-700 hover:bg-primary-200/30
                    }`}
                    onClick={() => setIsOpen(false)}>
                    {item.label}
                    <span
                      className={`absolute bottom-0 left-4 w-0 h-0.5 transition-all duration-300 group-hover:w-[calc(100%-2rem)] bg-primary-700`}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
