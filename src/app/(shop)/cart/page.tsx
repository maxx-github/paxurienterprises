// src/app/(shop)/cart/page.tsx
"use client";

import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/features/ecommerce/store/use-cart-store";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <section className="py-20 bg-grey min-h-[60vh] flex items-center">
        <div className="content-wrapper text-center">
          <ShoppingBag className="h-20 w-20 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-heading font-bold text-dark mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added any hardware to your cart yet.</p>
          <Button variant="primary" size="lg" asChild><Link href="/catalogue">Browse Catalogue</Link></Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-grey min-h-screen">
      <div className="content-wrapper">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-dark">Shopping Cart</h1>
          <Button variant="ghost" onClick={clearCart} className="text-red-500 hover:bg-red-50">
            <Trash2 className="mr-2 h-4 w-4" /> Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-full sm:w-24 h-24 bg-grey rounded-lg flex items-center justify-center shrink-0">
                    <ShoppingBag className="h-8 w-8 text-gray-400" />
                  </div>
                  
                  <div className="flex-grow text-center sm:text-left">
                    <Link href={`/catalogue/${item.slug}`} className="font-bold text-dark hover:text-primary text-lg">{item.name}</Link>
                    <p className="text-primary font-semibold mt-1">KES {item.price.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center border border-grey-dark rounded-md">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-grey"><Minus className="h-4 w-4" /></button>
                    <span className="w-10 text-center font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-grey"><Plus className="h-4 w-4" /></button>
                  </div>

                  <div className="w-28 text-right font-bold text-dark">KES {(item.price * item.quantity).toLocaleString()}</div>
                  <Button variant="ghost" size="sm" className="text-red-500" onClick={() => removeItem(item.id)}><Trash2 className="h-5 w-5" /></Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-heading font-bold text-dark mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-semibold">KES {totalPrice().toLocaleString()}</span></div>
                  <div className="flex justify-between text-gray-600"><span>Shipping</span><span>Calculated at checkout</span></div>
                  <div className="border-t border-grey-dark pt-4 flex justify-between text-lg font-bold"><span>Total</span><span className="text-primary">KES {totalPrice().toLocaleString()}</span></div>
                </div>
                <Button variant="primary" size="lg" className="w-full" asChild>
                  <Link href="/checkout">Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}