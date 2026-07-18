// src/app/admin/dashboard/page.tsx
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, FileText, Users, Briefcase, TrendingUp } from "lucide-react";

export default async function AdminDashboardPage() {
  // Fetch real-time counts from the database
  const [orderCount, quoteCount, fundiCount, jobCount] = await Promise.all([
    prisma.order.count(),
    prisma.quoteRequest.count(),
    prisma.labourProfile.count(),
    prisma.jobPost.count({ where: { isActive: true } }),
  ]);

  const stats = [
    { title: "Total Orders", value: orderCount, icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Quote Requests", value: quoteCount, icon: FileText, color: "text-green-600", bg: "bg-green-100" },
    { title: "Registered Fundis", value: fundiCount, icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Active Jobs", value: jobCount, icon: Briefcase, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-dark">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back. Here is an overview of your business operations.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-3xl font-bold text-dark mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity / Quick Actions Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Recent Quote Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-sm">Navigate to the <a href="/admin/leads" className="text-primary font-semibold hover:underline">Leads Management</a> tab to view and process recent inquiries.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" /> Recent M-Pesa Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-sm">Navigate to the <a href="/admin/orders" className="text-primary font-semibold hover:underline">Order Management</a> tab to track payments and dispatch hardware.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}