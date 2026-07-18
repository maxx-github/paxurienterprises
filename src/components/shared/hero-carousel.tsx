// src/components/shared/hero-carousel.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Using high-quality Unsplash images so they render immediately without local files
const heroSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=2070", // Construction site
    title: "Premier Construction Materials & Expert Building Solutions",
    subtitle: "From high-quality hardware supplies to skilled labour hire and professional contracting, Paxuri Enterprises delivers excellence in every project.",
    cta: "Request a Quote",
    ctaLink: "/request-quote",
    secondaryCta: "Our Services",
    secondaryLink: "/services"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2070", // Skilled workers
    title: "Skilled Labour & Professional Foremen",
    subtitle: "Access our vetted database of experienced construction professionals ready to bring your vision to life.",
    cta: "Find Talent",
    ctaLink: "/find-talent",
    secondaryCta: "Register as Fundi",
    secondaryLink: "/register-fundi"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070", // Modern building
    title: "End-to-End Contracting Services",
    subtitle: "Complete construction solutions from planning and design to execution and finishing.",
    cta: "View Projects",
    ctaLink: "/portfolio",
    secondaryCta: "Contact Us",
    secondaryLink: "/contact"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=2070", // Hardware materials
    title: "Quality Hardware & Finishing Materials",
    subtitle: "Browse our extensive catalogue of certified construction materials at competitive prices.",
    cta: "Browse Catalogue",
    ctaLink: "/catalogue",
    secondaryCta: "Request Quote",
    secondaryLink: "/request-quote"
  }
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-dark">
      {/* Background Images */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover opacity-40" // Darkened so text pops
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent" />
        </div>
      ))}

      {/* Content Container - ENFORCED MARGINS */}
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`max-w-3xl transition-all duration-1000 ease-out ${
                index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 absolute'
              }`}
            >
              {index === currentSlide && (
                <>
                  <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm text-primary-light px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-primary/30">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    Building Kenya's Future
                  </div>

                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight text-white mb-6">
                    {slide.title}
                  </h1>

                  <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
                    {slide.subtitle}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="primary" size="lg" asChild>
                      <Link href={slide.ctaLink} className="group">
                        {slide.cta}
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="lg" 
                      className="bg-transparent border-white text-white hover:bg-white hover:text-dark"
                      asChild
                    >
                      <Link href={slide.secondaryLink}>{slide.secondaryCta}</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button onClick={prevSlide} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all">
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button onClick={nextSlide} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all">
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-500 ${
              index === currentSlide ? 'w-12 bg-primary' : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}