// src/app/(marketing)/services/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Users, UserCheck, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Our Services | Paxuri Enterprises",
  description: "Explore our comprehensive construction services including contracting, professional foremen, house planning, and tender management.",
};

const services = [
  {
    icon: Building2,
    title: "Contracting & Tender Services",
    description: "End-to-end execution of commercial, residential, and government projects. We handle everything from bidding to final handover with strict adherence to quality and timelines.",
    features: ["Commercial Projects", "Residential Projects", "Government Tenders", "Private Tenders"]
  },
  {
    icon: UserCheck,
    title: "Professional Foremen",
    description: "Expert site supervision and workforce coordination to ensure your project runs smoothly, safely, and according to architectural specifications.",
    features: ["Site Supervision", "Project Management", "Workforce Coordination", "Quality Control"]
  },
  {
    icon: Home,
    title: "House Planning & Construction",
    description: "From initial architectural planning and structural design to the final finishing touches, we bring your dream home or commercial space to life.",
    features: ["Architectural Planning", "Structural Design", "Full Construction", "Premium Finishing Works"]
  },
  {
    icon: Users,
    title: "Skilled Labour Hire",
    description: "Access our vetted database of skilled and unskilled construction workers, including masons, carpenters, electricians, and plumbers, ready for deployment.",
    features: ["Skilled & Unskilled Workers", "Vetted Professionals", "Flexible Contract Durations", "Competitive Rates"]
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-grey">
      {/* Hero Section */}
      <section className="bg-dark text-white py-20 md:py-28">
        <div className="content-wrapper text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Our Comprehensive Services</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Delivering excellence in every phase of construction, from initial planning and material supply to expert labour and final finishing.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="content-wrapper">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-primary">
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center mb-4">
                    <service.icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-dark">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary py-16">
        <div className="content-wrapper text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Ready to Start Your Project?</h2>
          <p className="text-primary-light text-lg mb-8 max-w-2xl mx-auto">
            Get in touch with our team today for a free consultation, site visit, or detailed project quotation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="dark" size="lg" asChild>
              <Link href="/request-quote" className="flex items-center gap-2">
                Request a Quote <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-primary" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}