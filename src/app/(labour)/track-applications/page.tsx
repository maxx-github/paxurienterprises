// src/app/(labour)/track-applications/page.tsx
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client"; // ✅ 1. ADD THIS IMPORT
import { Search, FileText, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TrackPageProps {
  searchParams: { phone?: string };
}

// ✅ 2. Define the exact shape of the data returned by your Prisma query
type LabourProfileWithApplications = Prisma.LabourProfileGetPayload<{
  include: {
    user: true;
    applications: {
      include: { job: true };
    };
  };
}>;

export const dynamic = 'force-dynamic';
export default async function TrackApplicationsPage({ searchParams }: TrackPageProps) {
  const phone = searchParams.phone || "";
  
  // ✅ 3. Explicitly type the variables (This fixes the implicit 'any[]' error)
  let applications: NonNullable<LabourProfileWithApplications>["applications"] = [];
  let fundiName = "";

  if (phone) {
    try {
      // Find the fundi profile by phone (via User relation)
      const profile = await prisma.labourProfile.findFirst({
        where: { user: { phone: phone } },
        include: { user: true, applications: { include: { job: true } } }
      });

      if (profile) {
        fundiName = profile.user.name;
        applications = profile.applications;
      }
    } catch (error) {
      console.error("Tracking error:", error);
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "HIRED": return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "REJECTED": return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-grey py-16 md:py-24">
      <div className="content-wrapper max-w-4xl">
        <div className="text-center mb-10">
          <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-2">Track Your Applications</h1>
          <p className="text-gray-600 text-lg">Enter your registered phone number to view the status of your job applications.</p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <form className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow relative">
                <Input 
                  name="phone" 
                  defaultValue={phone}
                  placeholder="e.g., 0712345678" 
                  className="pl-4" 
                  required 
                />
              </div>
              <Button type="submit" variant="primary">
                <Search className="mr-2 h-4 w-4" /> Track Status
              </Button>
            </form>
          </CardContent>
        </Card>

        {phone && (
          <div>
            {fundiName ? (
              <>
                <h2 className="text-xl font-bold text-dark mb-4">Hello {fundiName}, here are your applications:</h2>
                {applications.length > 0 ? (
                  <div className="space-y-4">
                    {/* ✅ 4. Removed ': any' so TypeScript uses the correct inferred type */}
                    {applications.map((app) => (
                      <Card key={app.id}>
                        <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            {/* Added optional chaining (?.) and fallbacks (||) for safety */}
                            <h3 className="text-lg font-bold text-dark">{app.job?.title || "Unknown Job"}</h3>
                            <p className="text-sm text-gray-500">
                              {app.job?.location || "Unknown Location"} • Applied on {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Recently"}
                            </p>
                          </div>
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${
                            app.status === "HIRED" ? "bg-green-100 text-green-700" : 
                            app.status === "REJECTED" ? "bg-red-100 text-red-700" : 
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {getStatusIcon(app.status)}
                            {app.status.replace('_', ' ')}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center text-gray-500">
                      No applications found for this phone number.
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-red-500">
                  No registered Fundi profile found for this phone number. Please <a href="/register-fundi" className="text-primary underline">register here</a>.
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}