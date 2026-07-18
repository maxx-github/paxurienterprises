// src/app/(marketing)/downloads/page.tsx
import { FileDown, FileText, ShieldCheck, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const documents = [
  { title: "Company Profile 2024", type: "PDF", size: "2.4 MB", icon: BookOpen, url: "/documents/company-profile.pdf" },
  { title: "Product Catalogue", type: "PDF", size: "5.1 MB", icon: FileText, url: "/documents/catalogue.pdf" },
  { title: "NCA Registration Certificate", type: "PDF", size: "800 KB", icon: ShieldCheck, url: "/documents/nca-cert.pdf" },
  { title: "Site Safety Guidelines", type: "PDF", size: "1.2 MB", icon: FileText, url: "/documents/safety.pdf" },
];

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-grey py-16 md:py-24">
      <div className="content-wrapper max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-2">Download Centre</h1>
          <p className="text-gray-600 text-lg">Access our official documents, catalogues, and certifications.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((doc, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
                  <doc.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-bold text-dark truncate">{doc.title}</h3>
                  <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                </div>
                <Button variant="secondary" size="sm" asChild>
                  <a href={doc.url} download>
                    <FileDown className="mr-2 h-4 w-4" /> Download
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}