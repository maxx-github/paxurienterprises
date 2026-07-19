// src/app/(shop)/catalogue/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShoppingCart, FileText, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { AddToCartButton } from "./add-to-cart-button";

interface ProductPageProps {
  params: { slug: string };
}

const mockProduct = {
  id: "1", 
  name: "Bamburi Cement (50kg)", 
  slug: "bamburi-cement-50kg", 
  description: "High-quality Portland cement suitable for all general construction purposes. Meets KEBS standards.",
  price: 750, 
  images: ["/images/cement.jpg"], 
  category: "CONSTRUCTION_MATERIALS", 
  stock: 500,
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: ProductPageProps) {
  const product = mockProduct;
  return {
    title: `${product.name} | Paxuri Catalogue`,
    description: product.description,
  };
}

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  let product;
  try {
    product = await prisma.product.findUnique({ where: { slug: params.slug } });
  } catch {
    product = null;
  }
  
  const finalProduct = product || mockProduct;
  if (!finalProduct) notFound();

  const isLowStock = finalProduct.stock > 0 && finalProduct.stock <= 10;
  const isOutOfStock = finalProduct.stock === 0;

  return (
    <section className="py-12 md:py-16 bg-white min-h-screen">
      <div className="content-wrapper">
        <Link href="/catalogue" className="inline-flex items-center text-primary hover:underline mb-6 text-sm font-medium">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Catalogue
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Image */}
          <div className="space-y-4">
            <div className="relative h-80 md:h-96 bg-grey rounded-xl overflow-hidden border border-grey-dark">
              <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                <ShoppingCart className="h-20 w-20" />
              </div>
              {finalProduct.images?.[0] && (
                <Image src={finalProduct.images[0]} alt={finalProduct.name} fill className="object-cover" priority />
              )}
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              {finalProduct.category === "CONSTRUCTION_MATERIALS" ? "Construction Materials" : "Finishing Materials"}
            </span>
            
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-dark mt-1 mb-3">
              {finalProduct.name}
            </h1>
            
            <p className="text-gray-600 text-sm md:text-base mb-6 leading-relaxed">
              {finalProduct.description}
            </p>

            {/* Pricing & Stock */}
            <div className="mb-6 pb-6 border-b border-grey-dark">
              {finalProduct.price ? (
                <>
                  <span className="text-xs text-gray-500 font-medium uppercase">Price</span>
                  <p className="text-3xl font-bold text-primary">KES {finalProduct.price.toLocaleString()}</p>
                  
                  <div className="mt-2 flex items-center gap-2">
                    {isOutOfStock ? (
                      <span className="text-red-600 text-sm font-semibold flex items-center gap-1">Out of Stock</span>
                    ) : isLowStock ? (
                      <span className="text-orange-600 text-sm font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> Only {finalProduct.stock} left in stock!
                      </span>
                    ) : (
                      <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> In Stock ({finalProduct.stock} units)
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-4 bg-primary-light rounded-lg border border-primary/20">
                  <p className="text-primary text-sm font-semibold">
                    Price available upon request. Please submit a quote request below.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons (Download Specs Removed) */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {finalProduct.price && !isOutOfStock ? (
                <AddToCartButton 
                  id={finalProduct.id} 
                  name={finalProduct.name} 
                  slug={finalProduct.slug} 
                  price={finalProduct.price!} 
                  image={finalProduct.images?.[0] || ""} 
                  stock={finalProduct.stock} 
                />
              ) : finalProduct.price && isOutOfStock ? (
                <Button variant="secondary" size="lg" className="flex-1 whitespace-nowrap" disabled>
                  Out of Stock
                </Button>
              ) : (
                <Button variant="primary" size="lg" className="flex-1 whitespace-nowrap" asChild>
                  <Link href="/request-quote">Request a Quote</Link>
                </Button>
              )}
            </div>

            {/* Specifications Card */}
            <Card>
              <CardContent className="p-5">
                <h3 className="text-base font-bold text-dark mb-3">Product Specifications</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex justify-between border-b border-grey-dark pb-2">
                    <span className="font-medium text-dark">Category:</span>
                    <span>{finalProduct.category === "CONSTRUCTION_MATERIALS" ? "Construction" : "Finishing"}</span>
                  </li>
                  <li className="flex justify-between border-b border-grey-dark pb-2">
                    <span className="font-medium text-dark">Availability:</span>
                    <span className={isOutOfStock ? "text-red-600" : "text-green-600"}>
                      {isOutOfStock ? "Out of Stock" : "In Stock"}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-dark">Delivery:</span>
                    <span>Nationwide (Mombasa CBD & Surrounds)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}