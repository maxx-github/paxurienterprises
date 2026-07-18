// src/components/shared/add-to-quote-button.tsx
"use client";

import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuoteListStore } from "@/features/ecommerce/store/use-quote-list-store";

interface AddToQuoteButtonProps {
  id: string;
  name: string;
  slug: string;
}

export function AddToQuoteButton({ id, name, slug }: AddToQuoteButtonProps) {
  const addItem = useQuoteListStore((state) => state.addItem);

  return (
    <Button 
      variant="secondary" 
      size="sm" 
      className="w-full mt-2"
      onClick={() => addItem({ id, name, slug })}
    >
      <FileText className="mr-2 h-4 w-4" /> Add to Quote List
    </Button>
  );
}