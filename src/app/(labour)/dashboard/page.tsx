// src/app/(labour)/dashboard/page.tsx
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Briefcase, DollarSign, MapPin } from "lucide-react";
import { updateFundiRates } from "@/features/labour/actions/update-profile";

// Define the exact shape of the data returned by your Prisma query
type LabourProfileWithDetails = Prisma.LabourProfileGetPayload<{
  include: {
    user: true;
    applications: {
      include: { job: true };
    };
  };
}>;

export const dynamic = 'force-dynamic';
export default async function LabourDashboardPage() {
  // Apply the strict type (Fixes the implicit 'any' error)
  let profile: LabourProfileWithDetails | null = null;

  try {
    profile = await prisma.labourProfile.findFirst({ 
      include: { 
        user: true, 
        applications: { include: { job: true } } 
      } 
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
  }

  // Early return if no profile
  if (!profile) {
    return (
      <div className="min-h-screen bg-grey flex items-center justify-center p-4">
        <Card className="max-w-md text-center p-8">
          <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-dark mb-2">No Profile Found</h2>
          <p className="text-gray-600 mb-6">Please register as a Fundi to access your dashboard.</p>
          <Button variant="primary" asChild><a href="/register-fundi">Register Now</a></Button>
        </Card>
      </div>
    );
  }

  // Extract applications safely. No `any` needed!
  const applications = profile.applications;

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      HIRED: "bg-green-100 text-green-700",
      REJECTED: "bg-red-100 text-red-700",
      PENDING: "bg-yellow-100 text-yellow-700",
      SHORTLISTED: "bg-blue-100 text-blue-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-grey py-12">
      <div className="content-wrapper max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-heading font-bold text-dark mb-8">My Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile & Rate Update */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-2xl mx-auto mb-4">
                  {profile.user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <h2 className="text-xl font-bold text-dark">{profile.user?.name || "Unknown User"}</h2>
                <p className="text-primary font-semibold">
                  {profile.skill ? profile.skill.replace(/_/g, " ") : "Skill not specified"}
                </p>
                <div className="mt-4 space-y-2 text-sm text-gray-600 text-left">
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {profile.county || "N/A"}</div>
                  <div className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> {profile.yearsExperience || 0} Years Exp.</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary" /> Update Rates</CardTitle>
              </CardHeader>
              <CardContent>
                {/* ✅ FIXED: Wrapped in async function to satisfy Promise<void> type requirement */}
                <form 
                  action={async (formData: FormData) => {
                    await updateFundiRates(formData);
                  }} 
                  className="space-y-4"
                >
                  <input type="hidden" name="profileId" value={profile.id} />
                  <div>
                    <label className="text-xs font-medium text-gray-500">Daily Rate (KES)</label>
                    <Input name="dailyRate" type="number" defaultValue={profile.dailyRate?.toString() || ""} required />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Monthly Rate (KES)</label>
                    <Input name="monthlyRate" type="number" defaultValue={profile.monthlyRate?.toString() || ""} />
                  </div>
                  <Button type="submit" variant="primary" size="sm" className="w-full">Save Rates</Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Applications History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">My Job Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-grey-dark rounded-lg hover:bg-grey/50 transition-colors">
                        <div>
                          <h3 className="font-bold text-dark">{app.job?.title || "Unknown Job"}</h3>
                          <p className="text-sm text-gray-500">
                            {app.job?.location || "Unknown Location"} • Applied{" "}
                            {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Recently"}
                          </p>
                          <p className="text-sm text-primary font-semibold mt-1">
                            Expected: KES {app.expectedRate || "N/A"}/day
                          </p>
                        </div>
                        <span className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(app.status)}`}>
                          {app.status.replace(/_/g, " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <Briefcase className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                    <p>You haven't applied to any jobs yet.</p>
                    <Button variant="secondary" size="sm" className="mt-4" asChild><a href="/jobs">Browse Jobs</a></Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}