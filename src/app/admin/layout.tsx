// src/app/admin/layout.tsx
import { AdminSidebar } from "@/components/admin/admin-sidebar";

// Everything under /admin reads live data via Prisma and is gated by
// auth in middleware.ts — none of it should be statically generated
// at build time. This cascades to every nested route under /admin.
export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
