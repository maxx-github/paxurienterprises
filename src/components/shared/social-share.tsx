// src/components/shared/social-share.tsx
"use client";

import { Share2, Facebook, Twitter, Linkedin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialShareProps {
  title: string;
  url?: string; // Defaults to current URL if not provided
}

export function SocialShare({ title, url }: SocialShareProps) {
  const shareUrl = url || typeof window !== "undefined" ? window.location.href : "";
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    { name: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, color: "text-blue-600 hover:bg-blue-50" },
    { name: "Twitter", icon: Twitter, href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, color: "text-sky-500 hover:bg-sky-50" },
    { name: "LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`, color: "text-blue-700 hover:bg-blue-50" },
    { name: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, color: "text-green-600 hover:bg-green-50" },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-dark flex items-center gap-1 mr-2">
        <Share2 className="h-4 w-4" /> Share:
      </span>
      {links.map((link) => (
        <Button
          key={link.name}
          variant="ghost"
          size="sm"
          className={`p-2 rounded-full ${link.color}`}
          asChild
        >
          <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${link.name}`}>
            <link.icon className="h-4 w-4" />
          </a>
        </Button>
      ))}
    </div>
  );
}