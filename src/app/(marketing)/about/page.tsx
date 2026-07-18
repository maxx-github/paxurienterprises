// src/app/(marketing)/about/page.tsx
import type { Metadata } from "next";
import { Award, Target, Eye, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Paxuri Enterprises",
  description: "Learn about Paxuri Enterprises' vision, mission, core values, and our experienced team dedicated to building Kenya's future.",
};

export default function AboutPage() {
  const values = [
    { icon: ShieldCheck, title: "Integrity", desc: "We uphold the highest standards of honesty and transparency in every project." },
    { icon: Award, title: "Excellence", desc: "We are committed to delivering superior quality in materials and workmanship." },
    { icon: Users, title: "Collaboration", desc: "We work closely with our clients, partners, and skilled workforce to achieve shared goals." },
    { icon: Target, title: "Innovation", desc: "We continuously adopt modern construction techniques and sustainable practices." },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-dark text-white py-20 md:py-28">
        <div className="content-wrapper text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">About Paxuri Enterprises</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Building Kenya's future with integrity, quality, and unmatched expertise since our inception.
          </p>
        </div>
      </section>

      {/* Background & Vision/Mission */}
      <section className="py-16 md:py-24 bg-grey">
        <div className="content-wrapper">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Column: Our Story */}
            <div>
              <h2 className="text-3xl font-heading font-bold text-dark mb-4">Our Story</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Paxuri Enterprises was founded with a singular vision: to bridge the gap between quality construction materials, skilled labour, and professional project management in Kenya. 
              </p>
              <p className="text-gray-600 leading-relaxed">
                Over the years, we have grown from a local hardware supplier to a comprehensive construction solutions provider, handling everything from residential house planning to large-scale commercial tenders.
              </p>
            </div>
            
            {/* Right Column: Vision & Mission */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <Eye className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-xl font-bold text-dark mb-2">Our Vision</h3>
                  <p className="text-gray-600 text-sm">To be the most trusted and innovative construction solutions provider in East Africa.</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <Target className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-xl font-bold text-dark mb-2">Our Mission</h3>
                  <p className="text-gray-600 text-sm">To deliver high-quality building materials, expert labour, and professional contracting services that exceed client expectations.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Core Values */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-dark mb-4">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, idx) => (
              <Card key={idx} className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
                  <val.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-dark mb-2">{val.title}</h3>
                <p className="text-gray-600 text-sm">{val.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & CTA */}
      <section className="py-16 bg-primary text-white text-center">
        <div className="content-wrapper">
          <h2 className="text-3xl font-heading font-bold mb-4">Fully Licensed & Certified</h2>
          <p className="text-primary-light mb-8 max-w-2xl mx-auto">
            We are registered with the National Construction Authority (NCA), fully tax compliant, and adhere to all Kenyan building codes and safety standards.
          </p>
          <Button variant="dark" size="lg" asChild>
            <Link href="/request-quote">Request a Consultation</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}