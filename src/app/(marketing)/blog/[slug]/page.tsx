// src/app/(marketing)/blog/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Mock data (In production, fetch from DB/CMS based on slug)
const articles = {
  "top-5-tips-for-building-in-kenya": {
    title: "Top 5 Tips for Building Your Dream Home in Kenya",
    excerpt: "Navigating the construction process in Kenya can be daunting. Here are five essential tips to ensure your project runs smoothly...",
    content: `<p>Building a home in Kenya is a significant milestone...</p><p>1. Secure a proper title deed... 2. Hire a registered architect... 3. Get NCA approval... 4. Budget for contingencies... 5. Hire a professional foreman.</p>`,
    author: "Eng. David Mwangi",
    date: "2024-05-15",
    category: "Construction Tips",
    image: "/images/blog/tips.jpg"
  }
};

interface BlogPostPageProps {
  params: { slug: string };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const article = articles[params.slug as keyof typeof articles];

  if (!article) notFound();

  return (
    <article className="min-h-screen bg-white py-16 md:py-24">
      <div className="content-wrapper max-w-4xl">
        <Link href="/blog" className="inline-flex items-center text-primary hover:underline mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to News & Insights
        </Link>

        <div className="mb-8">
          <span className="text-sm font-semibold text-primary uppercase tracking-wide">{article.category}</span>
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-dark mt-2 mb-4 leading-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-6 border-b border-grey-dark">
            <span className="flex items-center gap-1"><User className="h-4 w-4" /> {article.author}</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(article.date).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-64 md:h-96 w-full rounded-xl overflow-hidden mb-10 bg-grey">
          <Image src={article.image} alt={article.title} fill className="object-cover" />
        </div>

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-12"
          dangerouslySetInnerHTML={{ __html: article.content }} 
        />

        {/* Share Buttons */}
        <div className="flex items-center gap-4 pt-6 border-t border-grey-dark">
          <span className="text-sm font-semibold text-dark flex items-center gap-2">
            <Share2 className="h-4 w-4" /> Share this article:
          </span>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
            <Facebook className="h-4 w-4 mr-1" /> Facebook
          </Button>
          <Button variant="ghost" size="sm" className="text-sky-500 hover:bg-sky-50">
            <Twitter className="h-4 w-4 mr-1" /> Twitter
          </Button>
        </div>
      </div>
    </article>
  );
}