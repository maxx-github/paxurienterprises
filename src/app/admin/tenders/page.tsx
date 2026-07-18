// src/app/admin/tenders/page.tsx
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Calendar, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

export default async function AdminTendersPage() {
  const tenders = await prisma.tender.findMany({
    orderBy: { closingDate: "asc" },
  });

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold text-dark">Tender Management</h1>
          <p className="text-gray-600 mt-1">Manage current, upcoming, and closed tender opportunities.</p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/admin/tenders/new">
            <Plus className="mr-2 h-4 w-4" /> Post New Tender
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {tenders.map((tender) => (
          <Card key={tender.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold text-dark">{tender.title}</h3>
                  <span className="bg-primary-light text-primary text-xs font-bold px-2 py-1 rounded">{tender.category}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tender.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Closing: {new Date(tender.closingDate).toLocaleDateString()}</span>
                  <a href={tender.documentUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">View Document</a>
                </div>
              </div>
              <div className="flex flex-row md:flex-col gap-2 shrink-0">
                <Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}