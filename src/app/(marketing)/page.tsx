// src/app/(marketing)/page.tsx
import type { Metadata } from "next";
import { HeroCarousel } from "@/components/shared/hero-carousel";
import { ServicesOverview } from "@/components/shared/services-overview";
import { FeaturedProducts } from "@/components/shared/featured-products";
import { WhyChooseUs, Testimonials, ContactSummary } from "@/components/shared/home-sections";

export const metadata: Metadata = {
  title: "Home | Paxuri Enterprises - Construction & Building Solutions",
  description: "Paxuri Enterprises offers premium construction materials, expert contracting, skilled labour hire, and professional foremen services in Kenya.",
};

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section (Full width background handled inside the component) */}
      <HeroCarousel activeSection="hero" />
      
      {/* 2. Services Overview */}
      <section className="bg-grey py-20">
        <div className="content-wrapper">
          <ServicesOverview />
        </div>
      </section>
      
      {/* 3. Featured Products */}
      <section className="bg-white py-20">
        <div className="content-wrapper">
          <FeaturedProducts />
        </div>
      </section>
      
      {/* 4. Why Choose Us */}
      <section className="bg-grey py-20">
        <div className="content-wrapper">
          <WhyChooseUs />
        </div>
      </section>
      
      {/* 5. Client Testimonials */}
      <section className="bg-white py-20">
        <div className="content-wrapper">
          <Testimonials />
        </div>
      </section>
      
      {/* 6. Contact Summary */}
      <section className="bg-primary py-16">
        <div className="content-wrapper">
          <ContactSummary />
        </div>
      </section>
    </>
  );
}