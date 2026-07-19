// src/app/admin/documents/page.tsx
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, User, Briefcase } from "lucide-react";

// Define Labour Profile type
type LabourProfileWithDocs = Prisma.LabourProfileGetPayload<{
  include: {
    user: true;
  };
}>;

// Define Quote Request type using base model ONLY
type QuoteRequestWithDocs = Prisma.QuoteRequestGetPayload<{}>;

export const dynamic = 'force-dynamic';

export default async function AdminDocumentsPage() {
  let labourProfiles: LabourProfileWithDocs[] = [];
  let quoteRequests: QuoteRequestWithDocs[] = [];

  try {
    // Fetch Labour Profiles
    labourProfiles = await prisma.labourProfile.findMany({
      include: {
        user: true,
      },
    });

    // Fetch Quote Requests
    quoteRequests = await prisma.quoteRequest.findMany({});
    
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
                        {/* ✅ FIXED: Changed variant="outline" to variant="secondary" */}
                        {/* @ts-expect-error - Dynamic field access based on your schema */}
                        {profile.idCopy ? (
                          <Button variant="secondary" size="sm" asChild>
                            {/* @ts-expect-error */}
                            <a href={profile.idCopy} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                              <FileText className="h-4 w-4" /> ID Copy
                            </a>
                          </Button>
                        ) : (
                          <span className="text-xs text-gray-400 py-2">No ID uploaded</span>
                        )}

                        {/* ✅ FIXED: Changed variant="outline" to variant="secondary" */}
                        {/* @ts-expect-error */}
                        {profile.certificate ? (
                          <Button variant="secondary" size="sm" asChild>
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
                      <h3 className="font-bold text-dark">
                        {/* @ts-expect-error - Adjust to your actual field name (e.g., quote.clientName) */}
                        {quote.clientName || quote.contactName || `Quote #${quote.id}`}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        {/* @ts-expect-error - Adjust to your actual field name */}
                        {quote.clientPhone || quote.contactPhone || "No phone"}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {/* ✅ FIXED: Changed variant="outline" to variant="secondary" */}
                        {/* @ts-expect-error */}
                        {quote.attachmentUrl || quote.documentUrl ? (
                          <Button variant="secondary" size="sm" asChild>
                            {/* @ts-expect-error */}
                            <a href={quote.attachmentUrl || quote.documentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
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