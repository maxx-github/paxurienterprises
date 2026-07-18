// src/app/admin/leads/page.tsx
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Mail } from "lucide-react";

export default async function AdminLeadsPage() {
  const quotes = await prisma.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-dark">Quotation & Lead Management</h1>
        <p className="text-gray-600 mt-1">Review project inquiries, download BOQs, and assign statuses.</p>
      </div>

      <div className="space-y-4">
        {quotes.map((quote) => (
          <Card key={quote.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-dark">{quote.fullName}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      quote.status === "NEW" ? "bg-blue-100 text-blue-700" : 
                      quote.status === "QUOTED" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {quote.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1"><strong>Project:</strong> {quote.projectType} in {quote.location}</p>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{quote.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {quote.email}</span>
                    <span>📞 {quote.phone}</span>
                    <span>💰 Budget: {quote.budget || "Not specified"}</span>
                    <span>📎 {quote.attachments.length} attachment(s)</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 shrink-0">
                  {quote.attachments.length > 0 && (
                    <Button variant="secondary" size="sm" asChild>
                      <a href={quote.attachments[0]} target="_blank" rel="noopener noreferrer">
                        <FileDown className="mr-2 h-4 w-4" /> View Docs
                      </a>
                    </Button>
                  )}
                  <Button variant="primary" size="sm">
                    Update Status
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}