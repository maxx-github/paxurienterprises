// src/app/admin/fundis/page.tsx
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Users } from "lucide-react";
import { verifyFundi, rejectFundi } from "@/features/labour/actions/manage-fundi";

export default async function AdminFundisPage() {
  const fundis = await prisma.labourProfile.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 md:p-8 space-y-6 bg-grey min-h-screen">
      <div>
        <h1 className="text-3xl font-heading font-bold text-dark flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" /> Labour Verification
        </h1>
        <p className="text-gray-600 mt-1">Review, verify, or reject new Fundi registrations.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-grey-dark/10 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Skill</th>
                  <th className="px-6 py-3">County</th>
                  <th className="px-6 py-3">Daily Rate</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fundis.map((fundi: any) => (
                  <tr key={fundi.id} className="border-b hover:bg-white transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-dark">{fundi.user.name}</div>
                      <div className="text-xs text-gray-500">{fundi.user.email}</div>
                    </td>
                    <td className="px-6 py-4">{fundi.skill.replace('_', ' ')}</td>
                    <td className="px-6 py-4">{fundi.county}</td>
                    <td className="px-6 py-4">KES {fundi.dailyRate.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${fundi.isAvailable ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {fundi.isAvailable ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      {!fundi.isAvailable && (
                        <form action={async () => { "use server"; await verifyFundi(fundi.id); }}>
                          <Button type="submit" variant="ghost" size="sm" className="text-green-600 hover:bg-green-50" title="Verify & Publish">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </form>
                      )}
                      <form action={async () => { "use server"; await rejectFundi(fundi.id); }}>
                        <Button type="submit" variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" title="Reject & Delete">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {fundis.length === 0 && (
              <div className="text-center py-12 text-gray-500">No fundi registrations found.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}