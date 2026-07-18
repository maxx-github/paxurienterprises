// src/components/shared/product-card.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/features/ecommerce/store/use-cart-store";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  image: string;
  category: string;
}

export function ProductCard({ id, name, slug, price, image, category }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!price) return;
    addItem({ id, name, slug, price, image });
  };

  return (
    <Card className="overflow-hidden group flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <Link href={`/catalogue/${slug}`} className="relative h-48 bg-grey overflow-hidden block">
        <div className="absolute inset-0 flex items-center justify-center text-gray-300 bg-grey">
          <ShoppingCart className="h-10 w-10" />
        </div>
        {image && (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded z-10 uppercase tracking-wide">
          {category}
        </div>
      </Link>
      
      <CardContent className="p-4 flex flex-col flex-grow">
        <Link href={`/catalogue/${slug}`}>
          <h3 className="text-base font-bold text-dark mb-1 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {name}
          </h3>
        </Link>
        
        <div className="mt-auto pt-3">
          {price ? (
            <p className="text-xl font-bold text-primary mb-3">
              KES {price.toLocaleString()}
            </p>
          ) : (
            <p className="text-sm font-semibold text-gray-500 mb-3">Price on Request</p>
          )}
          
          <div className="flex gap-2">
            {price ? (
              <Button variant="primary" size="sm" className="flex-1 whitespace-nowrap" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            ) : (
              <Button variant="secondary" size="sm" className="flex-1 whitespace-nowrap" asChild>
                <Link href={`/catalogue/${slug}`}>Request Quote</Link>
              </Button>
            )}
            <Button variant="ghost" size="sm" className="px-2" asChild>
              <Link href={`/catalogue/${slug}`} aria-label="View details">
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}