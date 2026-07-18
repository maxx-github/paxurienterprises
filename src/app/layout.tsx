// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloat } from "@/components/shared/whatsapp-float";
import { AuthProvider } from "@/components/providers/session-provider"; // <-- THIS IMPORT WAS MISSING

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Paxuri Enterprises | Construction & Building Solutions", template: "%s | Paxuri Enterprises" },
  description: "Paxuri Enterprises specializes in construction materials, contracting, skilled labour hire, and professional foremen services.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-dark font-sans antialiased">
        <AuthProvider>
          <Header />
          
          <main className="flex-grow">
            {children}
          </main>

          <Footer />
          
          {/* Global Floating Elements */}
          <WhatsAppFloat /> 
        </AuthProvider>
      </body>
    </html>
  );
}