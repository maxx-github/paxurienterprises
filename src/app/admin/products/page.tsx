// src/app/admin/products/page.tsx
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Package } from "lucide-react";
import Link from "next/link";
import { deleteProduct } from "@/features/catalogue/actions/delete-product";

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="p-6 md:p-8 space-y-6 bg-grey min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold text-dark flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" /> Catalogue Management
          </h1>
          <p className="text-gray-600 mt-1">Add, edit, or remove items from the hardware catalogue.</p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-grey-dark/10 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3">Product Name</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Price (KES)</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: any) => (
                  <tr key={product.id} className="border-b hover:bg-white transition-colors">
                    <td className="px-6 py-4 font-medium text-dark">{product.name}</td>
                    <td className="px-6 py-4">{product.category.replace('_', ' ')}</td>
                    <td className="px-6 py-4">{product.price ? product.price.toLocaleString() : "On Request"}</td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4 text-right">
                      <form action={async (formData) => {
                        "use server";
                        await deleteProduct(product.id);
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
            {products.length === 0 && (
              <div className="text-center py-12 text-gray-500">No products found. Add your first product above.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}