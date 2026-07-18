// src/app/admin/documents/page.tsx
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client"; // ✅ 1. ADD THIS IMPORT
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, User, Briefcase } from "lucide-react";

// ✅ 2. Define the exact shape of the Labour Profile data
// ⚠️ ADJUST: Add or remove fields in the 'include' to match your actual schema
type LabourProfileWithDocs = Prisma.LabourProfileGetPayload<{
  include: {
    user: {
      select: {
        name: true;
        email: true;
        phone: true;
      };
    };
  };
}>;

// ✅ 3. Define the exact shape of the Quote Request data
// ⚠️ ADJUST: Change 'QuoteRequest' to your actual model name (e.g., 'Quote', 'ContractorQuote')
type QuoteRequestWithDocs = Prisma.QuoteRequestGetPayload<{
  include: {
    user: {
      select: {
        name: true;
        email: true;
        phone: true;
      };
    };
  };
}>;

export default async function AdminDocumentsPage() {
  // ✅ 4. Explicitly type the arrays (This completely fixes the implicit 'any[]' error)
  let labourProfiles: LabourProfileWithDocs[] = [];
  let quoteRequests: QuoteRequestWithDocs[] = [];

  try {
    // Fetch Labour Profiles
    labourProfiles = await prisma.labourProfile.findMany({
      include: {
        user: {
          select: { name: true, email: true, phone: true },
        },
      },
      // Optional: Only fetch profiles that actually have a document
      // where: { idCopy: { not: null } } 
    });

    // Fetch Quote Requests
    // ⚠️ ADJUST: Change 'quoteRequest' to your actual Prisma model name (e.g., prisma.quote.findMany)
    quoteRequests = await prisma.quoteRequest.findMany({
      include: {
        user: {
          select: { name: true, email: true, phone: true },
        },
      },
    });
  } catch (error) {
    console.error("Admin documents fetch error:", error);
  }

  return (
    <div className="min-h-screen bg-grey py-12">
      <div className="content-wrapper max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-heading font-bold text-dark mb-8">Admin: Document Management</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Labour Documents Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Labour Profile Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {labourProfiles.length > 0 ? (
                <div className="space-y-4">
                  {labourProfiles.map((profile) => (
                    <div key={profile.id} className="p-4 border border-grey-dark rounded-lg hover:bg-grey/50 transition-colors">
                      <h3 className="font-bold text-dark">{profile.user?.name || "Unknown User"}</h3>
                      <p className="text-sm text-gray-500 mb-3">{profile.user?.phone || "No phone"}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {/* ⚠️ ADJUST: Change 'idCopy' to your actual document field name in schema.prisma */}
                        {/* @ts-expect-error - Dynamic field access based on your schema */}
                        {profile.idCopy ? (
                          <Button variant="outline" size="sm" asChild>
                            {/* @ts-expect-error */}
                            <a href={profile.idCopy} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                              <FileText className="h-4 w-4" /> ID Copy
                            </a>
                          </Button>
                        ) : (
                          <span className="text-xs text-gray-400 py-2">No ID uploaded</span>
                        )}

                        {/* ⚠️ ADJUST: Change 'certificate' to your actual document field name */}
                        {/* @ts-expect-error */}
                        {profile.certificate ? (
                          <Button variant="outline" size="sm" asChild>
                            {/* @ts-expect-error */}
                            <a href={profile.certificate} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                              <FileText className="h-4 w-4" /> Certificate
                            </a>
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No labour profiles found.</p>
              )}
            </CardContent>
          </Card>

          {/* Quote Request Documents Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" /> Quote Request Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quoteRequests.length > 0 ? (
                <div className="space-y-4">
                  {quoteRequests.map((quote) => (
                    <div key={quote.id} className="p-4 border border-grey-dark rounded-lg hover:bg-grey/50 transition-colors">
                      <h3 className="font-bold text-dark">{quote.user?.name || "Unknown User"}</h3>
                      <p className="text-sm text-gray-500 mb-3">{quote.user?.phone || "No phone"}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {/* ⚠️ ADJUST: Change 'attachmentUrl' to your actual document field name */}
                        {/* @ts-expect-error */}
                        {quote.attachmentUrl ? (
                          <Button variant="outline" size="sm" asChild>
                            {/* @ts-expect-error */}
                            <a href={quote.attachmentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                              <Download className="h-4 w-4" /> View Attachment
                            </a>
                          </Button>
                        ) : (
                          <span className="text-xs text-gray-400 py-2">No attachment</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No quote requests found.</p>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}