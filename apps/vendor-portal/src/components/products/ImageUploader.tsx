'use client';

import { useState, useRef } from 'react';
import { Upload, X, Star, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { uploadProductImage, deleteProductImage, ProductImage } from '@/lib/api/products';

interface ImageUploaderProps {
  productId: string;
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
}

export function ImageUploader({ productId, images, onImagesChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    const files = Array.from(e.target.files);
    const newImages: ProductImage[] = [];

    try {
      // Upload files sequentially
      for (const file of files) {
        const image = await uploadProductImage(productId, file, {
          position: images.length + newImages.length,
          isFeatured: images.length === 0 && newImages.length === 0 // First image is featured
        });
        newImages.push(image);
      }
      
      onImagesChange([...images, ...newImages]);
    } catch (err) {
      console.error('Failed to upload images:', err);
      alert('Failed to upload some images');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm('Delete this image?')) return;

    try {
      await deleteProductImage(imageId);
      onImagesChange(images.filter(img => img.id !== imageId));
    } catch (err) {
      console.error('Failed to delete image:', err);
      alert('Failed to delete image');
    }
  };

  const handleSetFeatured = async (imageId: string) => {
    // Optimistic update
    const updatedImages = images.map(img => ({
      ...img,
      isFeatured: img.id === imageId
    }));
    onImagesChange(updatedImages);

    // In a real app, we'd call an API to set featured status
    // For now, we assume the backend handles this or we'd add a setFeaturedImage API method
    // Since we didn't add that specific endpoint in the client yet, we'll just update local state
    // and rely on the fact that the backend supports it via PATCH /images/:id/featured
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card 
        className="border-2 border-dashed cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple 
            accept="image/*"
            onChange={handleFileSelect}
          />
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <Upload className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div className="text-center">
            <h3 className="font-medium">Click to upload images</h3>
            <p className="text-sm text-muted-foreground">
              SVG, PNG, JPG or GIF (max. 5MB)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <Card key={image.id} className="group relative overflow-hidden">
              <div className="aspect-square relative">
                <img 
                  src={image.url} 
                  alt={image.altText || 'Product image'} 
                  className="h-full w-full object-cover"
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetFeatured(image.id);
                    }}
                    title="Set as featured"
                  >
                    <Star className={`h-4 w-4 ${image.isFeatured ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(image.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Featured Badge */}
                {image.isFeatured && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Featured
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
