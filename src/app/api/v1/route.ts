// src/app/api/v1/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q") || "";

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    // Search across multiple models concurrently
    const [products, jobs, projects] = await Promise.all([
      prisma.product.findMany({
        where: { OR: [{ name: { contains: query, mode: "insensitive" } }, { description: { contains: query, mode: "insensitive" } }] },
        take: 5,
        select: { id: true, name: true, slug: true, category: true }
      }),
      prisma.jobPost.findMany({
        where: { OR: [{ title: { contains: query, mode: "insensitive" } }, { description: { contains: query, mode: "insensitive" } }] },
        take: 5,
        select: { id: true, title: true, skillRequired: true }
      }),
      prisma.project.findMany({
        where: { OR: [{ name: { contains: query, mode: "insensitive" } }, { description: { contains: query, mode: "insensitive" } }] },
        take: 5,
        select: { id: true, name: true, category: true }
      }),
    ]);

    return NextResponse.json({
      products,
      jobs,
      projects,
    });
  } catch (error) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}