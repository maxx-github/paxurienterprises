// src/app/admin/page.tsx
import Link from "next/link";

export default function AdminDashboard() {
  const stats = [
    { title: "Total Products", value: "0", href: "/admin/products", color: "bg-blue-500" },
    { title: "Pending Talent", value: "0", href: "/admin/talent", color: "bg-yellow-500" },
    { title: "Low Stock Alerts", value: "0", href: "/admin/stock", color: "bg-red-500" },
    { title: "Active Projects", value: "0", href: "/admin/projects", color: "bg-green-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <Link href="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
          + Add New Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}