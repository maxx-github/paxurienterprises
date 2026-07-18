// src/components/shared/services-overview.tsx
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Package, HardHat, Users, UserCheck, Home, Building2 } from "lucide-react";

const services = [
  { icon: Package, title: "Construction Materials", desc: "High-quality cement, steel, timber, and finishing materials.", href: "/catalogue" },
  { icon: HardHat, title: "Contracting Services", desc: "End-to-end commercial and residential project execution.", href: "/services" },
  { icon: Users, title: "Labour Hire", desc: "Skilled and unskilled manpower for your construction site.", href: "/find-talent" },
  { icon: UserCheck, title: "Professional Foremen", desc: "Expert site supervision and workforce coordination.", href: "/services" },
  { icon: Home, title: "House Planning", desc: "Architectural design and structural planning services.", href: "/services" },
  { icon: Building2, title: "Construction & Finishing", desc: "Complete building execution and premium interior finishing.", href: "/services" },
];

export function ServicesOverview() {
  return (
    <section className="py-20 bg-grey">
      <div className="content-wrapper">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-4">Our Core Services</h2>
          <p className="text-gray-600 text-lg">Comprehensive building solutions tailored to meet the diverse needs of the Kenyan construction industry.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link href={service.href} key={service.title} className="group">
              <Card className="h-full hover:border-primary transition-colors duration-300">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                    <service.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <CardTitle className="text-xl text-dark">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{service.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}