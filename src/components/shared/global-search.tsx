// src/components/shared/global-search.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        const combined = [
          ...(data.products || []).map((p: any) => ({ ...p, type: "Product", link: `/catalogue/${p.slug}` })),
          ...(data.jobs || []).map((j: any) => ({ ...j, type: "Job", link: `/jobs` }))
        ];
        setResults(combined);
      } catch {
        setResults([]);
      }
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-2 text-dark hover:text-primary transition-colors"
        aria-label="Toggle search"
      >
        <Search className="h-5 w-5" />
      </button>
      
      {isOpen && (
        <Card className="absolute right-0 top-12 w-80 p-4 shadow-xl z-50 border border-grey-dark">
          <div className="relative mb-3">
            <Input 
              placeholder="Search products, jobs..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              autoFocus 
              className="pr-10"
            />
            {isLoading && <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-gray-400" />}
          </div>
          
          <div className="max-h-60 overflow-y-auto space-y-1">
            {results.length > 0 ? (
              results.map((item, i) => (
                <Link 
                  key={i} 
                  href={item.link} 
                  className="flex justify-between items-center p-2 hover:bg-grey rounded text-sm transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="font-medium text-dark truncate">{item.name || item.title}</span>
                  <span className="text-xs text-primary shrink-0 ml-2">{item.type}</span>
                </Link>
              ))
            ) : query.length >= 2 && !isLoading ? (
              <p className="text-sm text-gray-500 text-center py-4">No results found.</p>
            ) : null}
          </div>
        </Card>
      )}
    </div>
  );
}