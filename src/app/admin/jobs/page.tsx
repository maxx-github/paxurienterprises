// src/app/admin/jobs/page.tsx
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Calendar } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminJobsPage() {
  const jobs = await prisma.jobPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold text-dark">Job Management</h1>
          <p className="text-gray-600 mt-1">Post new work opportunities and manage applications.</p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/admin/jobs/new">
            <Plus className="mr-2 h-4 w-4" /> Post New Job
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {jobs.map((job: any) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-dark">{job.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${job.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {job.isActive ? 'Active' : 'Closed'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {job.workersNeeded} Workers Needed</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                    <span className="font-semibold text-primary">{job.skillRequired.replace('_', ' ')}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Button variant="secondary" size="sm" asChild>
                    <Link href={`/admin/jobs/${job.id}/applications`}>View Applications</Link>
                  </Button>
                  <Button variant="ghost" size="sm">Edit Job</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}