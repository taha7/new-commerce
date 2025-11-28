import Link from "next/link";
import { ShoppingBag, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-slate-900">Marketplace</span>
            </Link>
            <p className="text-sm text-slate-500 max-w-xs">
              Empowering vendors to reach customers globally. Build your store, grow your business.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="/products" className="text-sm text-slate-600 hover:text-indigo-600">Browse Products</Link></li>
              <li><Link href="/vendors" className="text-sm text-slate-600 hover:text-indigo-600">Find Vendors</Link></li>
              <li><Link href="/pricing" className="text-sm text-slate-600 hover:text-indigo-600">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-slate-600 hover:text-indigo-600">About Us</Link></li>
              <li><Link href="/careers" className="text-sm text-slate-600 hover:text-indigo-600">Careers</Link></li>
              <li><Link href="/blog" className="text-sm text-slate-600 hover:text-indigo-600">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-sm text-slate-600 hover:text-indigo-600">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-slate-600 hover:text-indigo-600">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-sm text-slate-600 hover:text-indigo-600">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Marketplace Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
