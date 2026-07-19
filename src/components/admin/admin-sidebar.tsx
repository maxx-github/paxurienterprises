// src/components/admin/admin-sidebar.tsx
"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

const navLinks = [
  { name: "Dashboard", href: "/admin", icon: "📊" },
  { name: "Manage Catalogue", href: "/admin/products", icon: "📦" },
  { name: "Manage Talent", href: "/admin/talent", icon: "👥" },
  { name: "Post Projects", href: "/admin/projects", icon: "📝" },
  { name: "Stock Summaries", href: "/admin/stock", icon: "📈" },
];

export function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold tracking-wider">ADMIN PANEL</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            <span>{link.icon}</span>
            {link.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 rounded-md hover:bg-red-900/20 transition-colors"
        >
          <span>🚪</span> Log Out
        </button>
      </div>
    </aside>
  );
}
