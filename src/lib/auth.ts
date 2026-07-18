// src/lib/auth.ts

console.log("🚨🚨🚨 CRITICAL: src/lib/auth.ts IS LOADING 🚨🚨🚨");

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔍 AUTH START: Attempting login for:", credentials?.email);

        // ⚠️ CRITICAL FIX: Verify the exact name of your password field in prisma/schema.prisma.
        // If it is named 'passwordHash' or 'hashedPassword', change 'password' below to match exactly.
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
          select: { 
            id: true, 
            email: true, 
            name: true, 
            role: true, 
            passwordHash: true // <-- CHANGE THIS if your schema uses a different name (e.g., passwordHash: true)
          }
        });

        if (!user) {
          console.log("❌ AUTH FAILED: User not found in database.");
          return null;
        }
        console.log("✅ AUTH STEP 1: User found. Role in DB is:", user.role);

        if (!credentials?.password) {
          console.log("❌ AUTH FAILED: No password provided.");
          return null;
        }

        // ⚠️ ALSO CHANGE 'user.password' HERE if your schema field is named differently (e.g., user.passwordHash)
        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        
        if (!isValidPassword) {
          console.log("❌ AUTH FAILED: Invalid password.");
          return null;
        }
        console.log("✅ AUTH STEP 2: Password is valid!");

        console.log("✅ AUTH SUCCESS: Returning user object with role:", user.role);
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      console.log("🔥 JWT CALLBACK TRIGGERED. Token currently has role:", token.role);

      if (user) {
        token.role = user.role;
        token.id = user.id;
        console.log("🔥 JWT CALLBACK: Initial login. Token role set to:", token.role);
      }

      if (!token.role && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: { role: true }
        });
        
        if (dbUser) {
          token.role = dbUser.role;
          console.log("🔥 JWT CALLBACK: Fetched missing role from DB:", token.role);
        }
      }

      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};