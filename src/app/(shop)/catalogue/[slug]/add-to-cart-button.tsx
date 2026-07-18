// src/app/(shop)/catalogue/[slug]/add-to-cart-button.tsx
"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/ecommerce/store/use-cart-store";
import { QuantitySelector } from "@/components/shared/quantity-selector";

interface AddToCartButtonProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  stock?: number;
}

export function AddToCartButton({ id, name, slug, price, image, stock }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({ id, name, slug, price, image });
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Qty:</span>
        <QuantitySelector 
          quantity={quantity} 
          maxStock={stock} 
          onQuantityChange={setQuantity} 
          size="sm"
        />
      </div>
      
      <Button 
        variant="primary" 
        size="lg" 
        className="flex-1 w-full sm:w-auto whitespace-nowrap" 
        onClick={handleAddToCart}
        disabled={isAdded}
      >
        <ShoppingCart className="mr-2 h-5 w-5" /> 
        {isAdded ? "Added to Cart!" : "Add to Cart"}
      </Button>
    </div>
  );
}