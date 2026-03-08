/**
 * Product API Client
 * 
 * API functions for product management
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

interface ProductFilters {
  storeId?: string;
  categoryId?: string;
  search?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
}

interface Product {
  id: string;
  storeId: string;
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  formattedBasePrice: string;
  comparePrice?: number;
  formattedComparePrice?: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  images: ProductImage[];
  categories: { category: Category }[];
  tags: { tag: Tag }[];
  variants: ProductVariant[];
}

interface ProductVariant {
  id: string;
  sku?: string;
  price: number;
  formattedPrice: string;
  comparePrice?: number;
  formattedComparePrice?: string;
  stock: number;
  isActive: boolean;
}

interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  position: number;
  isFeatured: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface VariantAttribute {
  id: string;
  name: string;
  slug: string;
  values: VariantAttributeValue[];
}

interface VariantAttributeValue {
  id: string;
  value: string;
  slug: string;
}

/**
 * Get authentication token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

/**
 * Make authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Get products with filters
 */
export async function getProducts(filters: ProductFilters = {}) {
  const params = new URLSearchParams();
  
  if (filters.storeId) params.append('storeId', filters.storeId);
  if (filters.categoryId) params.append('categoryId', filters.categoryId);
  if (filters.search) params.append('search', filters.search);
  if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));
  if (filters.isFeatured !== undefined) params.append('isFeatured', String(filters.isFeatured));
  if (filters.page) params.append('page', String(filters.page));
  if (filters.limit) params.append('limit', String(filters.limit));

  return apiRequest<{
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(`/vendor/products?${params}`);
}

/**
 * Get single product by ID
 */
export async function getProduct(id: string) {
  return apiRequest<Product>(`/vendor/products/${id}`);
}

/**
 * Create new product
 */
export async function createProduct(data: {
  storeId: string;
  name: string;
  description?: string;
  basePrice: number;
  comparePrice?: number;
  cost?: number;
  stock?: number;
  categoryIds?: string[];
  tagNames?: string[];
}) {
  return apiRequest<Product>('/vendor/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update product
 */
export async function updateProduct(
  id: string, 
  data: Partial<Product> & { categoryIds?: string[]; tagNames?: string[] }
) {
  return apiRequest<Product>(`/vendor/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Delete product
 */
export async function deleteProduct(id: string) {
  return apiRequest<{ message: string }>(`/vendor/products/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Get variant attributes
 */
export async function getVariantAttributes(storeId?: string) {
  const params = storeId ? `?storeId=${storeId}` : '';
  return apiRequest<VariantAttribute[]>(`/vendor/variant-attributes${params}`);
}

/**
 * Get categories
 */
export async function getCategories(storeId?: string) {
  const params = storeId ? `?storeId=${storeId}` : '';
  return apiRequest<Category[]>(`/vendor/categories${params}`);
}

/**
 * Generate variants for product
 */
export async function generateVariants(
  productId: string,
  data: {
    attributeIds: string[];
    attributeValueIds: string[];
  },
) {
  return apiRequest<ProductVariant[]>(`/vendor/products/${productId}/variants/generate`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Upload product image
 */
export async function uploadProductImage(
  productId: string,
  file: File,
  options?: {
    altText?: string;
    position?: number;
    isFeatured?: boolean;
    variantValueId?: string;
  },
) {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append('file', file);
  
  if (options?.altText) formData.append('altText', options.altText);
  if (options?.position !== undefined) formData.append('position', String(options.position));
  if (options?.isFeatured) formData.append('isFeatured', 'true');
  if (options?.variantValueId) formData.append('variantValueId', options.variantValueId);

  const response = await fetch(`${API_BASE_URL}/vendor/products/${productId}/images`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Image upload failed');
  }

  return response.json();
}

/**
 * Delete product image
 */
export async function deleteProductImage(imageId: string) {
  return apiRequest<{ message: string }>(`/vendor/images/${imageId}`, {
    method: 'DELETE',
  });
}

export type {
  Product,
  ProductVariant,
  ProductImage,
  Category,
  Tag,
  VariantAttribute,
  VariantAttributeValue,
  ProductFilters,
};
