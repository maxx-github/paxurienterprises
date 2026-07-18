// src/components/shared/home-sections.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, ShieldCheck, BadgeDollarSign, Headphones, Phone, Mail, MapPin, Star, Quote } from "lucide-react";

// --- WHY CHOOSE US ---
export function WhyChooseUs() {
  const reasons = [
    { icon: Award, title: "Experienced Team", desc: "Decades of combined expertise in the Kenyan construction sector." },
    { icon: ShieldCheck, title: "Quality Materials", desc: "We source only certified, high-grade building materials." },
    { icon: BadgeDollarSign, title: "Competitive Pricing", desc: "Fair, transparent pricing with no hidden costs." },
    { icon: Headphones, title: "Professional Service", desc: "Dedicated support from inquiry to project completion." },
  ];

  return (
    <section className="py-20 bg-grey">
      <div className="content-wrapper">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-4">Why Choose Paxuri?</h2>
          <p className="text-gray-600 text-lg">We are committed to delivering excellence, safety, and value in every project we undertake.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason) => (
            <div key={reason.title} className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-14 h-14 mx-auto rounded-full bg-primary-light flex items-center justify-center mb-4">
                <reason.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-dark mb-2">{reason.title}</h3>
              <p className="text-gray-600 text-sm">{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- TESTIMONIALS ---
export function Testimonials() {
  const testimonials = [
    { name: "John Kamau", role: "Property Developer", text: "Paxuri provided excellent materials and their foreman kept the project strictly on schedule. Highly recommended!" },
    { name: "Sarah Ochieng", role: "Homeowner", text: "The house planning and finishing services were top-notch. The team was professional and the quality is outstanding." },
    { name: "David Mwangi", role: "Contractor", text: "Finding skilled labour through their portal saved me weeks of searching. The fundis were vetted and highly skilled." },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="content-wrapper">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-4">What Our Clients Say</h2>
          <p className="text-gray-600 text-lg">Trusted by developers, contractors, and homeowners across Kenya.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <Card key={t.name} className="p-6 relative">
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-gray-700 italic mb-6">"{t.text}"</p>
              <div>
                <p className="font-bold text-dark">{t.name}</p>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- CONTACT SUMMARY ---
export function ContactSummary() {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="content-wrapper">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-heading font-bold mb-2">Ready to Start Your Project?</h2>
            <p className="text-primary-light text-lg">Get in touch with our team today for a free consultation and quote.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="dark" size="lg" asChild>
              <Link href="/contact" className="flex items-center gap-2">
                <Phone className="h-5 w-5" /> Call Us Now
              </Link>
            </Button>
            <Button variant="secondary" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-primary" asChild>
              <Link href="/contact" className="flex items-center gap-2">
                <Mail className="h-5 w-5" /> Send a Message
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}