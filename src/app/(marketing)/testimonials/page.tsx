// src/app/(marketing)/testimonials/page.tsx
import { Star, Quote, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "John Kamau",
    role: "Property Developer",
    company: "Apex Estates",
    rating: 5,
    text: "Paxuri provided excellent materials and their foreman kept the project strictly on schedule. The quality of the finishing was outstanding. Highly recommended for any large-scale project!",
  },
  {
    id: 2,
    name: "Sarah Ochieng",
    role: "Homeowner",
    company: "Private Client",
    rating: 5,
    text: "The house planning and construction services were top-notch. The team was professional, transparent with costs, and the final result exceeded our expectations.",
  },
  {
    id: 3,
    name: "David Mwangi",
    role: "Lead Contractor",
    company: "Mwangi & Sons",
    rating: 4,
    text: "Finding skilled labour through their portal saved me weeks of searching. The fundis provided were vetted, highly skilled, and showed up on time every day.",
  },
  {
    id: 4,
    name: "Grace Wanjiru",
    role: "Architect",
    company: "DesignBuild Kenya",
    rating: 5,
    text: "As an architect, I need contractors who respect the drawings. Paxuri's execution of our commercial plaza design was flawless. Great communication throughout.",
  },
];

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-grey py-16 md:py-24">
      <div className="content-wrapper">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-2">Client Testimonials</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Don't just take our word for it. Hear from the developers, contractors, and homeowners who trust Paxuri Enterprises.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <Card key={t.id} className="relative p-6 md:p-8 hover:shadow-lg transition-shadow">
              <Quote className="absolute top-6 right-6 h-10 w-10 text-primary/10" />
              
              <CardContent className="p-0">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-700 italic leading-relaxed mb-6">"{t.text}"</p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-4 border-t border-grey-dark">
                  <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-lg">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-dark">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                    <p className="text-xs text-primary font-semibold flex items-center gap-1">
                      <Building2 className="h-3 w-3" /> {t.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}