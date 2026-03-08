import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';

// ============================================
// PRODUCT DTOs
// ============================================

export class CreateProductDto {
  @IsString()
  storeId: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  comparePrice?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  cost?: number;

  @IsBoolean()
  @IsOptional()
  trackInventory?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  lowStockThreshold?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsString()
  @IsOptional()
  metaTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categoryIds?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tagNames?: string[];
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  basePrice?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  comparePrice?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  cost?: number;

  @IsBoolean()
  @IsOptional()
  trackInventory?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  lowStockThreshold?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsString()
  @IsOptional()
  metaTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categoryIds?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tagNames?: string[];
}

// ============================================
// VARIANT DTOs
// ============================================

export class VariantCombinationDto {
  @IsString()
  attributeValueId: string;
}

export class CreateVariantDto {
  @IsString()
  productId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantCombinationDto)
  attributeValues: VariantCombinationDto[];

  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  barcode?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  comparePrice?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  cost?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  weight?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateVariantDto {
  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  barcode?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  comparePrice?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  cost?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  weight?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class GenerateVariantsDto {
  @IsString()
  productId: string;

  @IsArray()
  @IsString({ each: true })
  attributeIds: string[]; // IDs of variant attributes to use (e.g., Color, Size)

  @IsArray()
  @IsString({ each: true })
  attributeValueIds: string[]; // IDs of specific values to use
}

// ============================================
// PRODUCT ATTRIBUTE DTOs
// ============================================

export class AddProductAttributesDto {
  @IsString()
  productId: string;

  @IsArray()
  @IsString({ each: true })
  attributeIds: string[];
}

// ============================================
// IMAGE DTOs
// ============================================

export class UploadProductImageDto {
  @IsString()
  productId: string;

  @IsString()
  @IsOptional()
  altText?: string;

  @IsNumber()
  @IsOptional()
  position?: number;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsString()
  @IsOptional()
  variantValueId?: string; // Link to specific variant attribute value
}

// ============================================
// FILTER DTOs
// ============================================

export class ProductFilterDto {
  @IsString()
  @IsOptional()
  storeId?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isFeatured?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number;
}

