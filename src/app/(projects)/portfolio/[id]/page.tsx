// src/app/(projects)/portfolio/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, Building2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db";

interface ProjectDetailsPageProps {
  params: { id: string };
}

export const dynamic = 'force-dynamic';
export default async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  let project;
  try {
    project = await prisma.project.findUnique({ where: { id: params.id } });
  } catch {
    project = null;
  }

  // Fallback mock data if DB is empty
  const mockProject = {
    id: params.id,
    name: "Karen Luxury Villa",
    client: "Private Client",
    location: "Karen, Nairobi",
    category: "Residential",
    description: "A 5-bedroom luxury villa featuring modern architectural design, premium interior finishing, and smart home integration. The project was completed within 14 months.",
    images: ["/images/portfolio/villa1.jpg", "/images/portfolio/villa2.jpg"],
    completionDate: new Date("2023-11-01"),
  };

  const finalProject = project || mockProject;
  if (!finalProject) notFound();

  const servicesProvided = ["Architectural Design", "Structural Engineering", "Masonry", "Premium Finishing", "Landscaping"];

  return (
    <div className="min-h-screen bg-white py-16 md:py-24">
      <div className="content-wrapper max-w-6xl">
        <Link href="/portfolio" className="inline-flex items-center text-primary hover:underline mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <span className="text-sm font-semibold text-primary uppercase tracking-wide">{finalProject.category}</span>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-dark mt-2 mb-6">{finalProject.name}</h1>
            
            {/* Image Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {finalProject.images.map((img, i) => (
                <div key={i} className="relative h-64 bg-grey rounded-lg overflow-hidden">
                  <Image src={img} alt={`${finalProject.name} ${i+1}`} fill className="object-cover" />
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-dark mb-4">Project Overview</h2>
            <p className="text-gray-600 leading-relaxed mb-8">{finalProject.description}</p>

            <h2 className="text-2xl font-bold text-dark mb-4">Services Provided</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {servicesProvided.map((service) => (
                <li key={service} className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sidebar Details */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-xl font-bold text-dark border-b border-grey-dark pb-3">Project Details</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Client</p>
                      <p className="font-semibold text-dark">{finalProject.client || "Confidential"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Location</p>
                      <p className="font-semibold text-dark">{finalProject.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Completion Date</p>
                      <p className="font-semibold text-dark">
                        {finalProject.completionDate ? new Date(finalProject.completionDate).toLocaleDateString('en-KE', { year: 'numeric', month: 'long' }) : "Ongoing"}
                      </p>
                    </div>
                  </div>
                </div>

                <Button variant="primary" className="w-full" asChild>
                  <Link href="/request-quote">Start Your Project</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}