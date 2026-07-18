// src/app/(auth)/client-dashboard/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, FileText, Package, CheckCircle2, Clock, Truck } from "lucide-react";
import Link from "next/link";

// Mock data (In production, fetch using getServerSession() and Prisma)
const mockOrders = [
  { id: "ORD-8839", date: "2024-06-15", total: 15400, status: "DELIVERED", items: 4 },
  { id: "ORD-9921", date: "2024-07-02", total: 8500, status: "SHIPPED", items: 2 },
];

const mockQuotes = [
  { id: "Q-102", date: "2024-07-10", project: "Residential Villa - Karen", status: "QUOTED" },
  { id: "Q-105", date: "2024-07-22", project: "Commercial Block - Westlands", status: "IN_PROGRESS" },
];

export default function ClientDashboardPage() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DELIVERED": case "QUOTED": return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "SHIPPED": case "IN_PROGRESS": return <Truck className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED": case "QUOTED": return "bg-green-100 text-green-700";
      case "SHIPPED": case "IN_PROGRESS": return "bg-blue-100 text-blue-700";
      default: return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="min-h-screen bg-grey py-12">
      <div className="content-wrapper max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-dark">My Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your orders and quotation requests.</p>
          </div>
          <Button variant="primary" asChild>
            <Link href="/catalogue">Browse Catalogue</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" /> Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockOrders.length > 0 ? (
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="flex justify-between items-center p-4 border border-grey-dark rounded-lg hover:bg-grey/50">
                      <div>
                        <p className="font-bold text-dark">{order.id}</p>
                        <p className="text-xs text-gray-500">{order.date} • {order.items} items</p>
                        <p className="text-sm font-semibold text-primary mt-1">KES {order.total.toLocaleString()}</p>
                      </div>
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)} {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                  <p>No orders yet.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quote History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Quotation Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockQuotes.length > 0 ? (
                <div className="space-y-4">
                  {mockQuotes.map((quote) => (
                    <div key={quote.id} className="flex justify-between items-center p-4 border border-grey-dark rounded-lg hover:bg-grey/50">
                      <div>
                        <p className="font-bold text-dark">{quote.id}</p>
                        <p className="text-xs text-gray-500">{quote.date}</p>
                        <p className="text-sm font-semibold text-dark mt-1">{quote.project}</p>
                      </div>
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(quote.status)}`}>
                        {getStatusIcon(quote.status)} {quote.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                  <p>No quote requests yet.</p>
                  <Button variant="secondary" size="sm" className="mt-4" asChild>
                    <Link href="/request-quote">Request a Quote</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}