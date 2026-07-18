// src/components/blog/blog-card-image.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

interface BlogCardImageProps {
  src: string;
  alt: string;
}

export function BlogCardImage({ src, alt }: BlogCardImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return null;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      onError={() => setHasError(true)}
    />
  );
}