// src/app/admin/orders/page.tsx
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Assume a simple Badge component exists or use spans

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-dark">Order Management</h1>
        <p className="text-gray-600 mt-1">Track M-Pesa payments and manage hardware dispatch.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-grey text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Phone Number</th>
                  <th className="px-6 py-3">Items</th>
                  <th className="px-6 py-3">Total (KES)</th>
                  <th className="px-6 py-3">M-Pesa Receipt</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-grey/50">
                    <td className="px-6 py-4 font-medium text-dark">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{order.mpesaPhoneNumber}</td>
                    <td className="px-6 py-4">{order.items.length} item(s)</td>
                    <td className="px-6 py-4 font-semibold">{order.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-500">{order.mpesaReceiptNumber || "Pending"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        order.status === "PAID" ? "bg-green-100 text-green-700" : 
                        order.status === "PENDING_PAYMENT" ? "bg-yellow-100 text-yellow-700" : 
                        "bg-red-100 text-red-700"
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}