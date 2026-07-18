// src/app/admin/analytics/page.tsx
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ShoppingCart, FileText, Users, Briefcase, MessageSquare } from "lucide-react";

export default async function AdminAnalyticsPage() {
  // Fetch real-time counts
  const [orderCount, quoteCount, fundiCount, jobCount, messageCount] = await Promise.all([
    prisma.order.count({ where: { status: "PAID" } }),
    prisma.quoteRequest.count(),
    prisma.labourProfile.count(),
    prisma.jobPost.count(),
    prisma.contactMessage.count(),
  ]);

  // Mock data for monthly trends (In production, aggregate by date using Prisma)
  const monthlyOrders = [
    { month: "Jan", value: 12 }, { month: "Feb", value: 19 }, { month: "Mar", value: 15 },
    { month: "Apr", value: 25 }, { month: "May", value: 32 }, { month: "Jun", value: 45 },
  ];
  const maxOrderValue = Math.max(...monthlyOrders.map(m => m.value));

  const stats = [
    { title: "Completed Orders", value: orderCount, icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-100", trend: "+12%" },
    { title: "Quote Requests", value: quoteCount, icon: FileText, color: "text-green-600", bg: "bg-green-100", trend: "+8%" },
    { title: "Registered Fundis", value: fundiCount, icon: Users, color: "text-purple-600", bg: "bg-purple-100", trend: "+24%" },
    { title: "Contact Messages", value: messageCount, icon: MessageSquare, color: "text-orange-600", bg: "bg-orange-100", trend: "+5%" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-dark">Analytics & Reporting</h1>
        <p className="text-gray-600 mt-1">Track your business performance, leads, and user engagement.</p>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> {stat.trend}
                </span>
              </div>
              <p className="text-3xl font-bold text-dark">{stat.value.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Monthly Hardware Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-48 gap-4 pt-4">
              {monthlyOrders.map((item) => (
                <div key={item.month} className="flex flex-col items-center flex-1 gap-2">
                  <div className="w-full bg-grey rounded-t-md relative group cursor-pointer">
                    <div 
                      className="w-full bg-primary rounded-t-md transition-all duration-500 hover:bg-primary-hover" 
                      style={{ height: `${(item.value / maxOrderValue) * 160}px` }}
                    ></div>
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.value}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{item.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Services / Lead Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Most Requested Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { name: "Residential Construction", value: 45, color: "bg-primary" },
                { name: "Skilled Labour Hire", value: 30, color: "bg-blue-500" },
                { name: "Hardware Supply", value: 15, color: "bg-green-500" },
                { name: "Commercial Tenders", value: 10, color: "bg-purple-500" },
              ].map((service) => (
                <div key={service.name}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-dark">{service.name}</span>
                    <span className="text-gray-500">{service.value}%</span>
                  </div>
                  <div className="w-full bg-grey rounded-full h-2.5">
                    <div className={`${service.color} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${service.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}