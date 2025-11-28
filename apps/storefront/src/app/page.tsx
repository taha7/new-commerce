import Link from "next/link";
import { ArrowRight, ShoppingBag, Store, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2089&q=80"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/50"></div>
        </div>
        <div className="container-custom relative py-20 md:py-32 lg:py-40">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Discover Unique Products from <span className="text-indigo-400">Global Vendors</span>
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-8 leading-relaxed">
              Your one-stop destination for quality goods. Connect directly with independent sellers and find exactly what you're looking for.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto text-base">
                  Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/vendors/create">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base">
                  Sell on Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Our Marketplace?</h2>
            <p className="text-lg text-slate-600">
              We provide the best platform for both buyers and sellers to connect and trade securely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-2xl p-8 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Curated Selection</h3>
              <p className="text-slate-600 leading-relaxed">
                Browse through thousands of high-quality products from verified vendors across the globe.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                <Store className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Empowering Vendors</h3>
              <p className="text-slate-600 leading-relaxed">
                We give small businesses the tools they need to reach a wider audience and grow.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Transactions</h3>
              <p className="text-slate-600 leading-relaxed">
                Shop with confidence knowing that every transaction is protected and secure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-50">
        <div className="container-custom">
          <div className="bg-white rounded-3xl p-8 md:p-16 shadow-xl text-center md:text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-indigo-100 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-indigo-100 rounded-full opacity-50 blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Ready to Start Your Business?
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  Join thousands of successful vendors who are growing their business on our platform. It takes less than 5 minutes to get started.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/vendors/create">
                    <Button size="lg">Create Vendor Account</Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="outline" size="lg">Learn More</Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                {/* Abstract illustration or image could go here */}
                <div className="w-64 h-64 bg-indigo-600/5 rounded-full flex items-center justify-center">
                  <Store className="h-32 w-32 text-indigo-600/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
