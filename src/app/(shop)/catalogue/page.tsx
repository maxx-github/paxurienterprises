import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shared/product-card";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Product Catalogue | Paxuri Enterprises",
  description: "Browse high-quality construction and finishing materials.",
};

interface CataloguePageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function CataloguePage({ searchParams }: CataloguePageProps) {
  // Await searchParams for Next.js 15+ compatibility
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams.category || "";
  const search = resolvedSearchParams.search || "";

  // Fetch directly from the database. 
  // Note: Prisma automatically fetches String[] arrays, no 'include' needed.
  const products = await prisma.product.findMany({
    where: {
      isAvailable: true,
      ...(category && { category: category as any }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="py-12 md:py-20 bg-grey min-h-screen">
      <div className="content-wrapper">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-2">Product Catalogue</h1>
          <p className="text-gray-600 text-lg">High-quality materials for your project.</p>
        </div>

        {/* Category Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className={`p-6 rounded-lg border-l-4 transition-all ${category === "CONSTRUCTION_MATERIALS" ? "bg-white border-primary shadow-md" : "bg-white/50 border-gray-300"}`}>
            <h3 className="text-lg font-bold text-dark mb-1">Construction Materials</h3>
            <p className="text-sm text-gray-600">Essential structural components including cement, steel, timber, and aggregates for building strong, durable foundations.</p>
          </div>
          <div className={`p-6 rounded-lg border-l-4 transition-all ${category === "FINISHING_MATERIALS" ? "bg-white border-primary shadow-md" : "bg-white/50 border-gray-300"}`}>
            <h3 className="text-lg font-bold text-dark mb-1">Finishing Materials</h3>
            <p className="text-sm text-gray-600">Premium aesthetic and functional elements such as tiles, paints, fixtures, and fittings for the final, polished touches.</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row gap-4">
          <form className="flex-grow relative flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input name="search" defaultValue={search} placeholder="Search products..." className="pl-10 pr-10" />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary-light rounded-md" aria-label="Search">
              <Search className="h-4 w-4" />
            </button>
          </form>
          <div className="flex gap-2 flex-wrap">
            <Link href="/catalogue">
              <Button variant={category === "" ? "primary" : "secondary"} size="sm">All</Button>
            </Link>
            <Link href="/catalogue?category=CONSTRUCTION_MATERIALS">
              <Button variant={category === "CONSTRUCTION_MATERIALS" ? "primary" : "secondary"} size="sm">Construction</Button>
            </Link>
            <Link href="/catalogue?category=FINISHING_MATERIALS">
              <Button variant={category === "FINISHING_MATERIALS" ? "primary" : "secondary"} size="sm">Finishing</Button>
            </Link>
          </div>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id} 
                name={product.name} 
                slug={product.slug} 
                price={product.price || 0} 
                // Grab the first URL from the String array, fallback to a placeholder
                image={product.images?.[0] || "/images/placeholder.jpg"} 
                category={product.category === "CONSTRUCTION_MATERIALS" ? "Construction" : "Finishing"} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg border border-grey-dark">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">No products found in the database.</p>
            <Button variant="primary" asChild>
              <Link href="/catalogue">Clear Filters</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}