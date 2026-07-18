// src/components/layout/header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, HardHat, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/features/ecommerce/store/use-cart-store";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/services", label: "Services" },
  { href: "/find-talent", label: "Find Talent" },
  { href: "/register-fundi", label: "Register as Fundi" }, // <-- Added here
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems());

  // Wait for client-side hydration to complete before showing dynamic cart count
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-grey-dark bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-heading text-2xl font-bold text-primary">
          <HardHat className="h-8 w-8" />
          <span>Paxuri Enterprises</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`text-sm font-medium transition-colors ${
                link.href === "/register-fundi" 
                  ? "text-primary font-semibold hover:text-primary-hover" 
                  : "text-dark hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions (Cart + Quote) */}
        <div className="hidden md:flex items-center gap-4">
          {/* Cart Icon with Badge */}
          <Link href="/cart" className="relative p-2 text-dark hover:text-primary transition-colors">
            <ShoppingCart className="h-6 w-6" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white animate-in zoom-in duration-200">
                {totalItems}
              </span>
            )}
          </Link>
          
          <Button variant="primary" size="sm" asChild>
            <Link href="/request-quote">Request Quote</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="xl:hidden p-2 text-dark" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="xl:hidden border-t border-grey-dark bg-white">
          <nav className="w-full max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`text-base font-medium py-2 ${
                  link.href === "/register-fundi" ? "text-primary font-semibold" : "text-dark hover:text-primary"
                }`} 
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-grey-dark">
              <Link href="/cart" className="flex items-center gap-2 text-dark font-medium" onClick={() => setIsOpen(false)}>
                <ShoppingCart className="h-5 w-5" /> Cart ({mounted ? totalItems : 0})
              </Link>
              <Button variant="primary" size="sm" className="w-full" asChild>
                <Link href="/request-quote" onClick={() => setIsOpen(false)}>Request Quote</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}