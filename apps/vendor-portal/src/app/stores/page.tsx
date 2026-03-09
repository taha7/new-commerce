"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, Plus, ExternalLink } from "lucide-react";
import { getAuthToken, setAuthToken } from "@/lib/auth";

interface StoreData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function StoresPage() {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryToken = params.get("token");
    if (queryToken) {
      setAuthToken(queryToken);
      // Clean the token from the URL without reloading
      window.history.replaceState({}, "", "/stores");
    }

    const fetchStores = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        const response = await fetch("http://localhost:3002/vendor/stores", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStores(data);
        } else {
          setError("Failed to load stores");
        }
      } catch (err) {
        console.error("Network error:", err);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-lg">Loading stores...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Stores</h1>
            <p className="text-muted-foreground mt-1">
              Manage your stores and their settings
            </p>
          </div>
          <Link href="/stores/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Store
            </Button>
          </Link>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Stores grid */}
        {stores.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Store className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No stores yet</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Get started by creating your first store
              </p>
              <Link href="/stores/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Store
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <Card
                key={store.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{store.name}</CardTitle>
                      <CardDescription className="mt-1">
                        /{store.slug}
                      </CardDescription>
                    </div>
                    <Badge variant={store.isActive ? "default" : "secondary"}>
                      {store.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {store.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {store.description}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Created {new Date(store.createdAt).toLocaleDateString()}
                  </p>

                  <div className="flex gap-2">
                    <Link
                      href={`/stores/${store.id}/products`}
                      className="flex-1"
                    >
                      <Button variant="default" className="w-full">
                        Manage Products
                      </Button>
                    </Link>
                    <Button variant="outline" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

