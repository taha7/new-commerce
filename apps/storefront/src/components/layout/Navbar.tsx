"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container-custom flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-slate-900">Marketplace</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          <Link href="/products" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            Products
          </Link>
          <Link href="/vendors" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            Vendors
          </Link>
          <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            About
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/vendors/create">
            <Button size="sm">Become a Vendor</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-6 space-y-4 shadow-lg animate-in slide-in-from-top-5">
          <div className="flex flex-col space-y-4">
            <Link 
              href="/products" 
              className="text-base font-medium text-slate-600 hover:text-indigo-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link 
              href="/vendors" 
              className="text-base font-medium text-slate-600 hover:text-indigo-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Vendors
            </Link>
            <Link 
              href="/about" 
              className="text-base font-medium text-slate-600 hover:text-indigo-600"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </div>
          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3">
            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center">Sign In</Button>
            </Link>
            <Link href="/vendors/create" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full justify-center">Become a Vendor</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
