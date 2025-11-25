import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-indigo-600">Vendor Portal</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Start your online business journey with our powerful e-commerce platform. 
            Manage your stores, products, and customers all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-indigo-600 font-bold">🏪</span>
                </div>
                Multi-Store Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create and manage multiple stores under one vendor account. 
                Each store can have its own branding and product catalog.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">📊</span>
                </div>
                Analytics Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track your sales, monitor customer behavior, and get insights 
                to grow your business with our comprehensive analytics.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold">🔒</span>
                </div>
                Secure & Reliable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your data is protected with enterprise-grade security. 
                Focus on your business while we handle the infrastructure.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to start selling?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of vendors who are already growing their business with our platform. 
            It takes less than 5 minutes to get started.
          </p>
          <Link href="/register">
            <Button size="lg" className="px-8">
              Create Your Vendor Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
