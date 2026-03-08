'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  getProducts,
  deleteProduct,
  Product,
} from '@/lib/api/products';

export default function ProductsPage() {
  const params = useParams();
  const storeId = params.storeId as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchProducts = useCallback(async () => {
    if (!storeId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getProducts({
        storeId,
        search: search || undefined,
        isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
        page,
        limit: 10
      });
      
      setProducts(response.products);
      setTotalPages(response.pagination.totalPages);
      setTotalProducts(response.pagination.total);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [storeId, search, statusFilter, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await deleteProduct(id);
      fetchProducts(); // Refresh list
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Link href="/stores">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground mt-1">
              Manage your store's products and inventory
            </p>
          </div>
          <Link href={`/stores/${storeId}/products/create`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Product
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setPage(1)}
            />
          </div>
          <div className="w-full sm:w-[180px]">
            <Select 
              value={statusFilter} 
              onValueChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Table */}
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                <tr>
                  <th className="h-12 px-4 w-[80px]">Image</th>
                  <th className="h-12 px-4">Product</th>
                  <th className="h-12 px-4">Status</th>
                  <th className="h-12 px-4">Inventory</th>
                  <th className="h-12 px-4">Price</th>
                  <th className="h-12 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="h-24 text-center text-muted-foreground">
                      Loading products...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-muted-foreground">No products found</p>
                        {search || statusFilter !== 'all' ? (
                          <Button variant="link" onClick={() => {
                            setSearch('');
                            setStatusFilter('all');
                          }}>
                            Clear filters
                          </Button>
                        ) : (
                          <Link href={`/stores/${storeId}/products/create`}>
                            <Button variant="outline" size="sm">Create your first product</Button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center overflow-hidden border">
                          {product.images?.[0] ? (
                            <img 
                              src={product.images[0].url} 
                              alt={product.images[0].altText || product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{product.name}</div>
                        {product.variants?.length > 0 && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {product.variants.length} variants
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          product.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {product.isActive ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4">
                        {product.variants?.length > 0 ? (
                          <span className="text-muted-foreground">
                            {product.variants.reduce((acc, v) => acc + v.stock, 0)} in stock
                          </span>
                        ) : (
                          <span className={product.stock <= 0 ? 'text-red-600 font-medium' : ''}>
                            {product.stock} in stock
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-medium">
                        {product.formattedBasePrice}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/stores/${storeId}/products/${product.id}/edit`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t bg-muted/20">
              <div className="text-sm text-muted-foreground">
                Showing {products.length} of {totalProducts} products
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  Page {page} of {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
