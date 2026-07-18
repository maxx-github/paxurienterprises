// src/app/admin/documents/page.tsx
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Search, Filter } from "lucide-react";

export default async function AdminDocumentsPage() {
  // Fetch documents from Labour Profiles and Quote Requests
  let labourDocs = [];
  let quoteDocs = [];

  try {
    labourDocs = await prisma.labourProfile.findMany({
      select: {
        id: true,
        cvUrl: true,
        certUrls: true,
        user: { select: { name: true, email: true } }
      },
      take: 50, // Limit for performance
    });

    quoteDocs = await prisma.quoteRequest.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        attachments: true,
        createdAt: true
      },
      take: 50,
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("Document fetch error:", error);
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-dark">Document Management</h1>
        <p className="text-gray-600 mt-1">Manage and download uploaded CVs, IDs, BOQs, and drawings.</p>
      </div>

      {/* Labour Documents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> Fundi Documents
          </CardTitle>
          <span className="text-sm text-gray-500">{labourDocs.length} records</span>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-grey text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3">Fundi Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">CV</th>
                  <th className="px-6 py-3">Certificates</th>
                </tr>
              </thead>
              <tbody>
                {labourDocs.map((doc: any) => (
                  <tr key={doc.id} className="border-b hover:bg-grey/50">
                    <td className="px-6 py-4 font-medium text-dark">{doc.user.name}</td>
                    <td className="px-6 py-4 text-gray-500">{doc.user.email}</td>
                    <td className="px-6 py-4">
                      {doc.cvUrl ? (
                        <a href={doc.cvUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                          <Download className="h-4 w-4" /> Download CV
                        </a>
                      ) : <span className="text-gray-400">N/A</span>}
                    </td>
                    <td className="px-6 py-4">
                      {doc.certUrls && doc.certUrls.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {doc.certUrls.map((url: string, i: number) => (
                            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 text-xs">
                              <Download className="h-3 w-3" /> Cert {i + 1}
                            </a>
                          ))}
                        </div>
                      ) : <span className="text-gray-400">N/A</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quote Request Documents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> Quotation Attachments (BOQs/Drawings)
          </CardTitle>
          <span className="text-sm text-gray-500">{quoteDocs.length} records</span>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-grey text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3">Client Name</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Attachments</th>
                </tr>
              </thead>
              <tbody>
                {quoteDocs.map((doc: any) => (
                  <tr key={doc.id} className="border-b hover:bg-grey/50">
                    <td className="px-6 py-4 font-medium text-dark">{doc.fullName}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(doc.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {doc.attachments && doc.attachments.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {doc.attachments.map((url: string, i: number) => (
                            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 text-xs">
                              <Download className="h-3 w-3" /> Document {i + 1}
                            </a>
                          ))}
                        </div>
                      ) : <span className="text-gray-400">No attachments</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}