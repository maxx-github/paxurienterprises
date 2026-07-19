// src/app/(projects)/tenders/page.tsx
import { FileDown, Calendar, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";

const mockTenders = [
  { id: "1", title: "Construction of 10-Classroom Block", category: "Government", closingDate: "2024-12-20", description: "Tender for the construction of a modern classroom block in Kiambu County.", eligibility: "Registered NCA Contractor, Grade NCA 3 or above." },
  { id: "2", title: "Supply and Delivery of Hardware Materials", category: "Private", closingDate: "2024-11-30", description: "Supply of cement, steel, and roofing materials for a residential estate.", eligibility: "Registered supplier with valid tax compliance." },
];

export const dynamic = 'force-dynamic';
export default async function TendersPage() {
  let tenders = [];
  try {
    const dbTenders = await prisma.tender.findMany({ orderBy: { closingDate: "asc" } });
    tenders = dbTenders.length > 0 ? dbTenders : mockTenders;
  } catch { tenders = mockTenders; }

  return (
    <section className="py-12 md:py-20 bg-grey min-h-screen">
      <div className="content-wrapper">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-2">Tender Centre</h1>
          <p className="text-gray-600 text-lg">View and download current tender opportunities managed by Paxuri Enterprises.</p>
        </div>

        <div className="space-y-6">
          {tenders.map((tender: any) => (
            <Card key={tender.id}>
              <CardContent className="p-6 flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-dark">{tender.title}</h2>
                    <span className="bg-primary-light text-primary text-xs font-bold px-2 py-1 rounded">{tender.category}</span>
                  </div>
                  <p className="text-gray-600 mb-3">{tender.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1"><Calendar className="h-4 w-4 text-primary" /> Closing: {new Date(tender.closingDate).toLocaleDateString()}</div>
                    <div className="flex items-center gap-1"><AlertTriangle className="h-4 w-4 text-primary" /> {tender.eligibility}</div>
                  </div>
                </div>
                <div className="shrink-0 flex items-center">
                  <Button variant="secondary" asChild>
                    <a href={tender.documentUrl || "#"} download>
                      <FileDown className="mr-2 h-4 w-4" /> Download Docs
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}