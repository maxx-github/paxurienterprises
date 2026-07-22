// src/components/shared/featured-products.tsx
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Eye } from "lucide-react";

// Mock data (Will be replaced by Prisma DB query later)
/*const featuredProducts = [
  { id: "1", name: "Basco Emulsion White Soft & White Cream (4L)", price: 450, image: "/images/products/4l-basco-emulsion-white-soft-white-cream-450.jpg", category: "Construction" },
  { id: "2", name: "12mm Steel Bars (Bundle)", price: 8500, image: "/images/products/steel.jpg", category: "Construction" },
  { id: "3", name: "Premium Ceramic Tiles (sqm)", price: 1200, image: "/images/products/tiles.jpg", category: "Finishing" },
];
*/


/*export function FeaturedProducts() {*/
/*  return (
    <section className="py-20 bg-white">
      <div className="content-wrapper">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-2">Featured Hardware</h2>
            <p className="text-gray-600 text-lg">Top-quality construction and finishing materials ready for delivery.</p>
          </div>
          <Button variant="secondary" asChild>
            <Link href="/catalogue">View Full Catalogue</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden group">
              <div className="relative h-56 bg-grey overflow-hidden">
                {/* Placeholder for actual image */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <ShoppingCart className="h-16 w-16" />
                </div>
                <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                  {product.category}
                </div>
              </div>
              <CardContent className="p-5">
                <h3 className="text-lg font-bold text-dark mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-2xl font-bold text-primary mb-4">
                  KES {product.price.toLocaleString()}
                </p>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" className="flex-1">
                    Add to Cart
                  </Button>
                  <Button variant="ghost" size="sm" className="px-3">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
