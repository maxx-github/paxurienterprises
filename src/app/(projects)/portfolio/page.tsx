// src/app/(projects)/portfolio/page.tsx
import Image from "next/image";
import { Building2, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db";

const mockProjects = [
  { id: "1", name: "Karen Luxury Villa", client: "Private Client", location: "Karen, Nairobi", category: "Residential", images: ["/images/portfolio/villa.jpg"] },
  { id: "2", name: "Westlands Commercial Plaza", client: "Apex Developers", location: "Westlands, Nairobi", category: "Commercial", images: ["/images/portfolio/plaza.jpg"] },
  { id: "3", name: "Mombasa Road Warehouse", client: "LogiTech Kenya", location: "Nairobi South", category: "Industrial", images: ["/images/portfolio/warehouse.jpg"] },
];

export const dynamic = 'force-dynamic';
export default async function PortfolioPage() {
  let projects = [];
  try {
    const dbProjects = await prisma.project.findMany({ orderBy: { completionDate: "desc" } });
    projects = dbProjects.length > 0 ? dbProjects : mockProjects;
  } catch { projects = mockProjects; }

  return (
    <section className="py-12 md:py-20 bg-white min-h-screen">
      <div className="content-wrapper">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-2">Project Portfolio</h1>
          <p className="text-gray-600 text-lg">Explore our track record of successfully delivered construction projects across Kenya.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project: any) => (
            <Card key={project.id} className="overflow-hidden group">
              <div className="relative h-64 bg-grey overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                  <Building2 className="h-16 w-16" />
                </div>
                {project.images?.[0] && (
                  <Image src={project.images[0]} alt={project.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                )}
                <div className="absolute top-3 left-3 bg-dark/80 text-white text-xs font-bold px-2 py-1 rounded">
                  {project.category}
                </div>
              </div>
              <CardContent className="p-5">
                <h3 className="text-xl font-bold text-dark mb-2">{project.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{project.description || "A flagship project demonstrating our commitment to quality and timely delivery."}</p>
                <div className="flex justify-between text-sm text-gray-500 pt-3 border-t border-grey-dark">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {project.location}</span>
                  <span>{project.client || "Confidential"}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}