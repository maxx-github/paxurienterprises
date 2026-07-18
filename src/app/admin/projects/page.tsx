// src/app/admin/projects/page.tsx
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Building2 } from "lucide-react";
import Link from "next/link";
import { deleteProject } from "@/features/projects/actions/delete-project";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="p-6 md:p-8 space-y-6 bg-grey min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold text-dark flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" /> Project Portfolio
          </h1>
          <p className="text-gray-600 mt-1">Manage completed and ongoing projects displayed on the website.</p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Project
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-grey-dark/10 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3">Project Name</th>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project: any) => (
                  <tr key={project.id} className="border-b hover:bg-white transition-colors">
                    <td className="px-6 py-4 font-medium text-dark">{project.name}</td>
                    <td className="px-6 py-4">{project.client || "Confidential"}</td>
                    <td className="px-6 py-4">{project.location}</td>
                    <td className="px-6 py-4">{project.category}</td>
                    <td className="px-6 py-4 text-right">
                      <form action={async (formData) => {
                        "use server";
                        await deleteProject(project.id);
                      }}>
                        <Button type="submit" variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {projects.length === 0 && (
              <div className="text-center py-12 text-gray-500">No projects found. Add your first project above.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}