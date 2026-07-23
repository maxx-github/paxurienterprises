// src/components/shared/featured-products.tsx
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/shared/product-card";

export async function FeaturedProducts() {
  // Fetch directly from the database (no mock data)
  const featuredProducts = await prisma.product.findMany({
    where: {
      isAvailable: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4, // Show the 4 latest products as "featured"
  });

  // Don't render the section if there are no products yet
  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-20 bg-grey">
      <div className="content-wrapper">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-8 text-center">
          Featured Products
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price || 0}
              image={product.images?.[0] || "/images/placeholder.jpg"}
              category={product.category === "CONSTRUCTION_MATERIALS" ? "Construction" : "Finishing"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}