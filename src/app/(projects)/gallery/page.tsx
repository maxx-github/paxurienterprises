// src/app/(projects)/gallery/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, ZoomIn } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const categories = ["All", "Foundation", "Masonry", "Roofing", "Interior Finishing", "Exterior", "Landscaping"];

const galleryItems = [
  { id: 1, category: "Foundation", title: "Reinforced Concrete Foundation", image: "/images/gallery/foundation.jpg" },
  { id: 2, category: "Masonry", title: "Precision Block Work", image: "/images/gallery/masonry.jpg" },
  { id: 3, category: "Roofing", title: "Modern Timber Truss Roofing", image: "/images/gallery/roofing.jpg" },
  { id: 4, category: "Interior Finishing", title: "Premium Gypsum Ceiling", image: "/images/gallery/interior.jpg" },
  { id: 5, category: "Exterior", title: "Exterior Weather-proofing", image: "/images/gallery/exterior.jpg" },
  { id: 6, category: "Landscaping", title: "Driveway & Garden Paving", image: "/images/gallery/landscape.jpg" },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems = activeCategory === "All" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-white py-16 md:py-24">
      <div className="content-wrapper">
        <div className="text-center mb-12">
          <Camera className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-2">Project Gallery</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Explore high-quality images of our construction phases, finishing works, and completed projects.</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "primary" : "secondary"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="group relative overflow-hidden h-64 bg-grey cursor-pointer">
              {/* Placeholder for actual image */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                <Camera className="h-16 w-16" />
              </div>
              {item.image && (
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4">
                <ZoomIn className="h-8 w-8 mb-2" />
                <h3 className="text-lg font-bold text-center">{item.title}</h3>
                <p className="text-sm text-primary-light">{item.category}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}