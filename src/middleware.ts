// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_local_dev" 
    });

    if (!token || token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};