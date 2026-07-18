// src/components/layout/footer.tsx
import Link from "next/link";
import { HardHat, Phone, Mail, MapPin, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="content-wrapper py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-heading text-2xl font-bold text-white">
              <span>Paxuri Enterprises</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner in construction materials, contracting, and skilled labour hire.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-heading font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/catalogue" className="hover:text-primary transition-colors">Product Catalogue</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Our Services</Link></li>
              <li><Link href="/portfolio" className="hover:text-primary transition-colors">Project Portfolio</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-heading font-bold mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/find-talent" className="hover:text-primary transition-colors">Labour Hire</Link></li>
              <li><Link href="/register-fundi" className="hover:text-primary transition-colors">Register as Fundi</Link></li>
              <li><Link href="/request-quote" className="hover:text-primary transition-colors">Request a Quote</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-heading font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Mombasa, Kenya</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a href="tel:+254717883488" className="hover:text-primary transition-colors">+254 717 883 488</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a href="mailto:info@paxurienterprises.com" className="hover:text-primary transition-colors">info@paxurienterprises.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Admin Login */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Paxuri Enterprises. All rights reserved.
          </p>
          
          {/* Discreet but clickable Admin Login Link */}
          <Link 
            href="/login?callbackUrl=/admin/products" 
            className="text-xs text-gray-500 hover:text-primary transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-gray-800"
          >
            <Lock className="h-3 w-3" />
            Admin Portal
          </Link>

          <div className="flex gap-4">
            <a href="#" className="text-gray-500 hover:text-primary transition-colors">FB</a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors">X</a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors">IN</a>
          </div>
        </div>
      </div>
    </footer>
  );
}