// src/lib/auth-guards.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type SessionUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  role: string;
};

/**
 * Returns the current session user or null if unauthenticated.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.role) {
    return null;
  }
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
  };
}

/**
 * Requires an authenticated session. Throws if missing.
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

/**
 * Requires ADMIN role. Throws if missing or wrong role.
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return user;
}

/**
 * Safe result helpers for server actions (no stack traces to clients).
 */
export function unauthorizedResult() {
  return { success: false as const, message: "You must be signed in to perform this action." };
}

export function forbiddenResult() {
  return { success: false as const, message: "You do not have permission to perform this action." };
}
