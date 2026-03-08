"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Loader2,
  CheckCircle2,
  Package,
  Layers,
  Image as ImageIcon,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { createProduct, generateVariants, Product } from "@/lib/api/products";
import { poundsToCents } from "@/utils/price";
import { VariantSelector } from "@/components/products/VariantSelector";
import { VariantTable } from "@/components/products/VariantTable";
import { ImageUploader } from "@/components/products/ImageUploader";
import { CategorySelector } from "@/components/products/CategorySelector";
import { TagInput } from "@/components/products/TagInput";
import { updateProduct, getProduct } from "@/lib/api/products";

// Steps for the wizard
const STEPS = [
  { id: "basic", title: "Basic Info", icon: Package },
  { id: "variants", title: "Variants", icon: Layers },
  { id: "images", title: "Images", icon: ImageIcon },
  { id: "metadata", title: "Categories", icon: Tag },
];

export default function CreateProductPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    comparePrice: "",
    cost: "",
    stock: "",
    trackInventory: true,
  });

  const [createdProduct, setCreatedProduct] = useState<Product | null>(null);

  const handleBasicInfoSubmit = async () => {
    if (!formData.name || !formData.basePrice) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert prices to cents
      const basePriceCents = poundsToCents(parseFloat(formData.basePrice));
      const comparePriceCents = formData.comparePrice
        ? poundsToCents(parseFloat(formData.comparePrice))
        : undefined;
      const costCents = formData.cost
        ? poundsToCents(parseFloat(formData.cost))
        : undefined;

      const product = await createProduct({
        storeId,
        name: formData.name,
        description: formData.description,
        basePrice: basePriceCents,
        comparePrice: comparePriceCents,
        cost: costCents,
        stock: formData.stock ? parseInt(formData.stock) : 0,
      });

      setCreatedProduct(product);
      setCurrentStep(1); // Move to variants step
    } catch (err: any) {
      console.error("Failed to create product:", err);
      setError(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create Product</h1>
          <p className="text-muted-foreground">
            Add a new product to your store
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10" />
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center gap-2 bg-background px-4"
              >
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isActive || isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="grid gap-6">
        {currentStep === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the core details about your product.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Cotton T-Shirt"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product..."
                  className="min-h-[120px]"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (£) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.basePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, basePrice: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comparePrice">Compare Price (£)</Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.comparePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, comparePrice: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost per Item (£)</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.cost}
                    onChange={(e) =>
                      setFormData({ ...formData, cost: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Initial Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  You can manage stock per variant in the next step.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">
                  {error}
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button onClick={handleBasicInfoSubmit} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Next: Variants
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 1 && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Generate Variants</CardTitle>
                <CardDescription>
                  Select attributes to automatically generate variant
                  combinations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VariantSelector
                  storeId={storeId}
                  onGenerate={async (data) => {
                    if (!createdProduct) return;
                    setLoading(true);
                    try {
                      const variants = await generateVariants(
                        createdProduct.id,
                        data
                      );
                      setCreatedProduct({ ...createdProduct, variants });
                    } catch (err) {
                      console.error("Failed to generate variants:", err);
                      setError("Failed to generate variants");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  loading={loading}
                />
              </CardContent>
            </Card>

            {createdProduct?.variants && createdProduct.variants.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Manage Variants</CardTitle>
                  <CardDescription>
                    Edit prices and stock for your variants.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VariantTable
                    variants={createdProduct.variants}
                    onUpdate={async (id, data) => {
                      try {
                        // Optimistic update
                        const updatedVariants = createdProduct.variants.map(
                          (v) => (v.id === id ? { ...v, ...data } : v)
                        );
                        setCreatedProduct({
                          ...createdProduct,
                          variants: updatedVariants,
                        });

                        // API update (debounced in real app, direct here for simplicity)
                        // Note: In a real app we'd call updateVariant API
                        // For now we just update local state as we don't have updateVariant imported yet
                      } catch (err) {
                        console.error("Failed to update variant:", err);
                      }
                    }}
                    onDelete={async (id) => {
                      if (!confirm("Delete this variant?")) return;
                      try {
                        // API call would go here
                        const updatedVariants = createdProduct.variants.filter(
                          (v) => v.id !== id
                        );
                        setCreatedProduct({
                          ...createdProduct,
                          variants: updatedVariants,
                        });
                      } catch (err) {
                        console.error("Failed to delete variant:", err);
                      }
                    }}
                    onBulkUpdate={(field, value) => {
                      const updatedVariants = createdProduct.variants.map(
                        (v) => ({
                          ...v,
                          [field]: value,
                        })
                      );
                      setCreatedProduct({
                        ...createdProduct,
                        variants: updatedVariants,
                      });
                      // In real app, would need bulk update API or loop calls
                    }}
                  />
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(0)}>
                Back
              </Button>
              <Button onClick={() => setCurrentStep(2)}>Next: Images</Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>
                  Upload high-quality images of your product. The first image
                  will be used as the main image.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {createdProduct && (
                  <ImageUploader
                    productId={createdProduct.id}
                    images={createdProduct.images || []}
                    onImagesChange={(images) => {
                      setCreatedProduct({ ...createdProduct, images });
                    }}
                  />
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button onClick={() => setCurrentStep(3)}>
                Next: Categories
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
                <CardDescription>
                  Organize your product with categories and tags to help
                  customers find it.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Categories</Label>
                  <CategorySelector
                    storeId={storeId}
                    selectedIds={
                      createdProduct?.categories?.map((c) => c.category.id) ||
                      []
                    }
                    onChange={async (ids) => {
                      if (!createdProduct) return;
                      try {
                        // Update local state optimistically
                        // In real app, we'd fetch the full category objects or reload product
                        // For now we just trigger the API update
                        await updateProduct(createdProduct.id, {
                          categoryIds: ids,
                        });

                        // Reload product to get full category objects
                        const updated = await getProduct(createdProduct.id);
                        setCreatedProduct(updated);
                      } catch (err) {
                        console.error("Failed to update categories:", err);
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <TagInput
                    tags={createdProduct?.tags?.map((t) => t.tag.name) || []}
                    onChange={async (tags) => {
                      if (!createdProduct) return;
                      try {
                        await updateProduct(createdProduct.id, {
                          tagNames: tags,
                        });

                        // Reload product
                        const updated = await getProduct(createdProduct.id);
                        setCreatedProduct(updated);
                      } catch (err) {
                        console.error("Failed to update tags:", err);
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Back
              </Button>
              <Button
                onClick={() => router.push(`/stores/${storeId}/products`)}
              >
                Finish & View Products
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

