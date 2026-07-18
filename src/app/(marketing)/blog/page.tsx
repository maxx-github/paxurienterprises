// src/app/(marketing)/blog/page.tsx
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BlogCardImage } from "@/components/blog/blog-card-image";

const mockArticles = [
  {
    slug: "top-5-tips-for-building-in-kenya",
    title: "Top 5 Tips for Building Your Dream Home in Kenya",
    excerpt: "Navigating the construction process in Kenya can be daunting. Here are five essential tips to ensure your project runs smoothly...",
    author: "Paxuri Team",
    date: "2024-05-15",
    category: "Construction Tips",
    image: "/images/blog/tips.jpg"
  },
  {
    slug: "understanding-nca-regulations",
    title: "Understanding NCA Regulations for Contractors",
    excerpt: "A comprehensive guide to the National Construction Authority requirements and how to ensure your project is fully compliant...",
    author: "Paxuri Team",
    date: "2024-04-20",
    category: "Building Regulations",
    image: "/images/blog/nca.jpg"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white py-16 md:py-24">
      <div className="content-wrapper">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-2">News & Insights</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Stay updated with the latest construction trends, regulations, and Paxuri company news.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockArticles.map((article) => (
            <Card key={article.slug} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-grey overflow-hidden">
                <BlogCardImage src={article.image} alt={article.title} />
                <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded z-10">
                  {article.category}
                </div>
              </div>
              <CardContent className="p-5 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-dark mb-2 line-clamp-2">{article.title}</h2>
                <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{article.excerpt}</p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pt-4 border-t border-grey-dark">
                  <span className="flex items-center gap-1"><User className="h-3 w-3" /> {article.author}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(article.date).toLocaleDateString()}</span>
                </div>
                <Button variant="ghost" size="sm" className="self-start px-0 text-primary hover:text-primary-hover" asChild>
                  <Link href={`/blog/${article.slug}`}>
                    Read More <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}