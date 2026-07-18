// src/components/shared/quantity-selector.tsx
"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  quantity: number;
  maxStock?: number; // Optional: limit to available stock
  onQuantityChange: (newQuantity: number) => void;
  className?: string;
  size?: "sm" | "md";
}

export function QuantitySelector({ 
  quantity, 
  maxStock, 
  onQuantityChange, 
  className,
  size = "md" 
}: QuantitySelectorProps) {
  
  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (maxStock && quantity >= maxStock) return;
    onQuantityChange(quantity + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) {
      onQuantityChange(1);
    } else if (maxStock && val > maxStock) {
      onQuantityChange(maxStock);
    } else {
      onQuantityChange(val);
    }
  };

  const isMaxedOut = maxStock ? quantity >= maxStock : false;

  return (
    <div className={cn("flex items-center border border-grey-dark rounded-md overflow-hidden w-fit bg-white", className)}>
      <Button 
        type="button"
        variant="ghost" 
        size="sm" 
        className="h-full rounded-none border-r border-grey-dark hover:bg-grey px-2" 
        onClick={handleDecrement}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
      >
        <Minus className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
      </Button>
      
      <Input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        className={cn(
          "w-12 text-center border-none rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-sm font-semibold appearance-none",
          size === "sm" ? "h-8 text-xs" : "h-10"
        )}
        min="1"
        max={maxStock}
        aria-label="Quantity"
      />
      
      <Button 
        type="button"
        variant="ghost" 
        size="sm" 
        className="h-full rounded-none border-l border-grey-dark hover:bg-grey px-2" 
        onClick={handleIncrement}
        disabled={isMaxedOut}
        aria-label="Increase quantity"
      >
        <Plus className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
      </Button>
    </div>
  );
}