// src/app/(labour)/jobs/page.tsx
import Link from "next/link";
import { MapPin, Clock, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";

const mockJobs = [
  { id: "1", title: "Senior Mason for Residential Villa", skillRequired: "MASON", location: "Karen, Nairobi", contractDuration: "3 Months", workersNeeded: 4, budgetMin: 1500, budgetMax: 2500, deadline: "2024-12-31", description: "Experienced mason needed for high-end residential finishing." },
  { id: "2", title: "Site Foreman for Commercial Block", skillRequired: "FOREMAN", location: "Westlands, Nairobi", contractDuration: "6 Months", workersNeeded: 1, budgetMin: 80000, budgetMax: 120000, deadline: "2024-12-15", description: "Looking for a certified foreman to manage a 4-story commercial build." },
];

export default async function JobsPage() {
  let jobs = [];
  try {
    const dbJobs = await prisma.jobPost.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } });
    jobs = dbJobs.length > 0 ? dbJobs : mockJobs;
  } catch { jobs = mockJobs; }

  return (
    <section className="py-12 md:py-20 bg-grey min-h-screen">
      <div className="content-wrapper">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-2">Available Work Opportunities</h1>
          <p className="text-gray-600 text-lg">Find your next construction project. Apply directly through our portal.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job: any) => (
            <Card key={job.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl text-dark">{job.title}</CardTitle>
                <p className="text-sm text-primary font-semibold uppercase">{job.skillRequired.replace('_', ' ')}</p>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-gray-600 mb-4 flex-grow">{job.description}</p>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {job.location}</div>
                  <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {job.contractDuration}</div>
                  <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> {job.workersNeeded} Needed</div>
                  <div className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" /> {job.budgetMin}-{job.budgetMax} KES</div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-grey-dark">
                  <span className="text-xs text-gray-400">Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                  <Button variant="primary" size="sm" asChild>
                    <Link href={`/jobs/${job.id}/apply`}>Apply Now</Link>
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