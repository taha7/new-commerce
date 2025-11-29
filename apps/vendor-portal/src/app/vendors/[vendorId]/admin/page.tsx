"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";

interface VendorProfile {
  id: string;
  businessName: string;
  businessType: string;
  description: string;
  contactPhone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function VendorAdminPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const vendorId = params.vendorId as string;
  
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      let token = searchParams.get("token");
      
      // If token in URL, save to localStorage and remove from URL
      if (token) {
        localStorage.setItem("vendor_token", token);
        // Remove token from URL without refreshing
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      } else {
        // Try to get token from localStorage
        token = localStorage.getItem("vendor_token");
      }

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:3002/vendor/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          // Verify this user owns this vendor account
          if (data.id !== vendorId) {
            setError("Unauthorized: You don't own this vendor account");
            return;
          }
          
          setProfile(data);
        } else if (response.status === 401) {
          localStorage.removeItem("vendor_token");
          router.push("/login");
        } else {
          setError("Failed to load profile");
        }
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [searchParams, vendorId, router]);

  const handleLogout = () => {
    localStorage.removeItem("vendor_token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold">Vendor Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome, {profile?.businessName}!
          </h2>
          <p className="text-gray-600">Manage your store and products from here</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Business Profile Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Business Profile</h3>
            {profile ? (
              <div className="space-y-2 text-sm">
                <p><strong>Business:</strong> {profile.businessName}</p>
                <p><strong>Type:</strong> {profile.businessType}</p>
                <p><strong>Location:</strong> {profile.city}, {profile.state}</p>
                <p><strong>Phone:</strong> {profile.contactPhone || "N/A"}</p>
              </div>
            ) : (
              <p className="text-gray-500">No profile information available</p>
            )}
          </div>

          {/* Stores Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Your Stores</h3>
            <p className="text-gray-500 text-sm mb-4">
              Create and manage your online stores
            </p>
            <a
              href="/stores"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              Manage Stores
            </a>
          </div>

          {/* Products Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            <p className="text-gray-500 text-sm">
              Product management coming soon...
            </p>
          </div>
        </div>

        {/* Additional Info */}
        {profile && (
          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Business Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Description:</p>
                <p className="mt-1">{profile.description || "No description provided"}</p>
              </div>
              <div>
                <p className="text-gray-600">Address:</p>
                <p className="mt-1">
                  {profile.address}<br />
                  {profile.city}, {profile.state} {profile.zipCode}<br />
                  {profile.country}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
