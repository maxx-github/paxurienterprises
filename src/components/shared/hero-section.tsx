// src/components/shared/hero-section.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, HardHat } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative bg-dark text-white overflow-hidden">
      {/* Background Pattern/Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-dark z-0"></div>
      <div className="absolute inset-0 opacity-10 bg-[url('/images/hero-pattern.svg')] bg-center bg-cover z-0"></div>
      
      <div className="content-wrapper py-24 md:py-32 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-light px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <HardHat className="h-4 w-4" />
            Building Kenya's Future
          </div>
          
          <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight mb-6">
            Premier Construction Materials & <span className="text-primary">Expert Building Solutions</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
            From high-quality hardware supplies to skilled labour hire and professional contracting, Paxuri Enterprises delivers excellence in every project.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="primary" size="lg" asChild>
              <Link href="/request-quote">
                Request a Quote <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-dark" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}