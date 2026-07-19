// src/app/admin/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Package, Users, AlertTriangle, Briefcase, Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

// ✅ CRITICAL: Prevents Vercel from trying to statically generate this page at build time
export const dynamic = "force-dynamic";

// Helper function to fetch stats safely and in parallel
async function getDashboardStats() {
  try {
    // Run these queries in parallel for maximum performance
    const [totalProducts, totalTalent, totalProjects, lowStock] = await Promise.all([
      // 1. Total Products (Matches 'Product' model)
      prisma.product.count(),
      
      // 2. Registered Talent (Matches 'LabourProfile' model)
      prisma.labourProfile.count(),
      
      // 3. Total Projects (Matches 'Project' model)
      prisma.project.count(),
      
      // 4. Low Stock Alerts (Products with 10 or fewer items)
      prisma.product.count({ where: { stock: { lte: 10 } } }),
    ]);

    return {
      totalProducts,
      totalTalent,
      totalProjects,
      lowStock,
      error: null,
    };
  } catch (error) {
    console.error("❌ Dashboard Stats Fetch Error:", error);
    // Return zeros and an error flag so the UI doesn't completely crash
    return {
      totalProducts: 0,
      totalTalent: 0,
      totalProjects: 0,
      lowStock: 0,
      error: "Failed to load live statistics. Please check your database connection.",
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  // Define the card configuration with icons and colors
  const statCards = [
    { 
      title: "Total Products", 
      value: stats.totalProducts, 
      href: "/admin/products", 
      icon: Package, 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
    { 
      title: "Registered Talent", 
      value: stats.totalTalent, 
      href: "/admin/talent", 
      icon: Users, 
      color: "text-yellow-600", 
      bg: "bg-yellow-50" 
    },
    { 
      title: "Low Stock Alerts", 
      value: stats.lowStock, 
      href: "/admin/stock", 
      icon: AlertTriangle, 
      color: "text-red-600", 
      bg: "bg-red-50" 
    },
    { 
      title: "Total Projects", 
      value: stats.totalProjects, 
      href: "/admin/projects", 
      icon: Briefcase, 
      color: "text-green-600", 
      bg: "bg-green-50" 
    },
  ];

  return (
    <div className="space-y-8 p-2">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-dark">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back. Here's what's happening with Paxuri today.</p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/admin/products/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add New Product
          </Link>
        </Button>
      </div>

      {/* Error Banner (Only shows if DB connection fails) */}
      {stats.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span>{stats.error}</span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link 
              key={stat.title} 
              href={stat.href} 
              className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <span className="text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
                  View Details →
                </span>
              </div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-3xl font-bold text-dark mt-1 group-hover:scale-105 transition-transform origin-left">
                {stat.value.toLocaleString()}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" /> Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" asChild>
            <Link href="/admin/talent/new">Onboard New Fundi</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/admin/projects/new">Create New Project</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/admin/orders">Review Pending Orders</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}