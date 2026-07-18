// src/components/shared/scroll-tracker.tsx
"use client";

import { useEffect, useState } from "react";

export function useScrollTracker() {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      
      // Calculate overall scroll progress (prevent division by zero)
      const progress = documentHeight > 0 ? (scrollPosition / documentHeight) * 100 : 0;
      setScrollProgress(progress);

      // Determine active section based on scroll position
      const sections = [
        { id: "hero", threshold: 0 },
        { id: "services", threshold: windowHeight * 0.8 },
        { id: "catalogue", threshold: windowHeight * 1.6 },
        { id: "about", threshold: windowHeight * 2.4 },
        { id: "portfolio", threshold: windowHeight * 3.2 },
        { id: "labour", threshold: windowHeight * 4.0 },
        { id: "testimonials", threshold: windowHeight * 4.8 },
        { id: "contact", threshold: windowHeight * 5.6 },
      ];

      const currentSection = sections.reduce((acc, section) => {
        if (scrollPosition >= section.threshold) {
          return section.id;
        }
        return acc;
      }, "hero");

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { activeSection, scrollProgress };
}