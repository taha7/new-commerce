import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { formatPrice } from './utils/price.utils';
import {
  CreateProductDto,
  UpdateProductDto,
  CreateVariantDto,
  UpdateVariantDto,
  GenerateVariantsDto,
  AddProductAttributesDto,
  ProductFilterDto,
} from './product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // PRODUCT CRUD
  // ============================================

  async createProduct(dto: CreateProductDto) {
    const { categoryIds, tagNames, ...productData } = dto;

    // Generate slug from name
    const slug = this.generateSlug(productData.name);

    // Check if slug already exists for this store
    const existing = await this.prisma.product.findUnique({
      where: { storeId_slug: { storeId: dto.storeId, slug } },
    });

    if (existing) {
      throw new BadRequestException(`Product with slug "${slug}" already exists in this store`);
    }

    // Create product
    const product = await this.prisma.product.create({
      data: {
        ...productData,
        slug,
        basePrice: productData.basePrice,
      },
    });

    // Add categories if provided
    if (categoryIds && categoryIds.length > 0) {
      await this.prisma.productCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          productId: product.id,
          categoryId,
        })),
      });
    }

    // Add tags if provided
    if (tagNames && tagNames.length > 0) {
      for (const tagName of tagNames) {
        const tagSlug = this.generateSlug(tagName);
        
        // Find or create tag
        let tag = await this.prisma.tag.findUnique({ where: { slug: tagSlug } });
        if (!tag) {
          tag = await this.prisma.tag.create({
            data: { name: tagName, slug: tagSlug },
          });
        }

        // Link tag to product
        await this.prisma.productTag.create({
          data: {
            productId: product.id,
            tagId: tag.id,
          },
        });
      }
    }

    return this.getProductById(product.id);
  }

  async getProducts(filter: ProductFilterDto) {
    const { storeId, categoryId, search, isActive, isFeatured, page = 1, limit = 20 } = filter;

    const where: any = {};

    if (storeId) where.storeId = storeId;
    if (isActive !== undefined) where.isActive = isActive;
    if (isFeatured !== undefined) where.isFeatured = isFeatured;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categories = {
        some: { categoryId },
      };
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { position: 'asc' } },
          categories: { include: { category: true } },
          tags: { include: { tag: true } },
          variants: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: products.map((p) => this.enrichProductWithFormattedPrices(p)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { position: 'asc' } },
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        attributes: { include: { attribute: { include: { values: true } } } },
        variants: {
          include: {
            values: { include: { attributeValue: { include: { attribute: true } } } },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.enrichProductWithFormattedPrices(product);
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const { categoryIds, tagNames, ...updateData } = dto;

    // Update product
    const product = await this.prisma.product.update({
      where: { id },
      data: updateData,
    });

    // Update categories if provided
    if (categoryIds !== undefined) {
      // Remove existing categories
      await this.prisma.productCategory.deleteMany({ where: { productId: id } });
      
      // Add new categories
      if (categoryIds.length > 0) {
        await this.prisma.productCategory.createMany({
          data: categoryIds.map((categoryId) => ({
            productId: id,
            categoryId,
          })),
        });
      }
    }

    // Update tags if provided
    if (tagNames !== undefined) {
      // Remove existing tags
      await this.prisma.productTag.deleteMany({ where: { productId: id } });
      
      // Add new tags
      if (tagNames.length > 0) {
        for (const tagName of tagNames) {
          const tagSlug = this.generateSlug(tagName);
          
          let tag = await this.prisma.tag.findUnique({ where: { slug: tagSlug } });
          if (!tag) {
            tag = await this.prisma.tag.create({
              data: { name: tagName, slug: tagSlug },
            });
          }

          await this.prisma.productTag.create({
            data: { productId: id, tagId: tag.id },
          });
        }
      }
    }

    return this.getProductById(id);
  }

  async deleteProduct(id: string) {
    await this.prisma.product.delete({ where: { id } });
    return { message: 'Product deleted successfully' };
  }

  // ============================================
  // PRODUCT ATTRIBUTES
  // ============================================

  async addProductAttributes(dto: AddProductAttributesDto) {
    const { productId, attributeIds } = dto;

    // Verify product exists
    await this.getProductById(productId);

    // Add attributes
    const attributes = await Promise.all(
      attributeIds.map((attributeId, index) =>
        this.prisma.productAttribute.create({
          data: {
            productId,
            attributeId,
            position: index,
          },
          include: {
            attribute: { include: { values: true } },
          },
        }),
      ),
    );

    return attributes;
  }

  // ============================================
  // VARIANTS
  // ============================================

  async generateVariants(dto: GenerateVariantsDto) {
    const { productId, attributeIds, attributeValueIds } = dto;

    // Get product
    const product = await this.getProductById(productId);

    // Get attribute values grouped by attribute
    const attributeValues = await this.prisma.variantAttributeValue.findMany({
      where: { id: { in: attributeValueIds } },
      include: { attribute: true },
    });

    // Group values by attribute
    const valuesByAttribute = new Map<string, any[]>();
    for (const value of attributeValues) {
      if (!valuesByAttribute.has(value.attributeId)) {
        valuesByAttribute.set(value.attributeId, []);
      }
      valuesByAttribute.get(value.attributeId)!.push(value);
    }

    // Generate all combinations
    const combinations = this.generateCombinations(Array.from(valuesByAttribute.values()));

    // Create variants
    const variants = [];
    for (const combination of combinations) {
      // Generate SKU
      const sku = this.generateVariantSku(product.slug, combination);

      // Create variant
      const variant = await this.prisma.productVariant.create({
        data: {
          productId,
          sku,
          price: product.basePrice,
          stock: 0,
        },
      });

      // Link variant to attribute values
      await Promise.all(
        combination.map((value) =>
          this.prisma.variantValue.create({
            data: {
              variantId: variant.id,
              attributeValueId: value.id,
            },
          }),
        ),
      );

      variants.push(variant);
    }

    return variants;
  }

  async createVariant(dto: CreateVariantDto) {
    const { productId, attributeValues, ...variantData } = dto;

    // Generate SKU if not provided
    let sku = dto.sku;
    if (!sku) {
      const product = await this.prisma.product.findUnique({ where: { id: productId } });
      const values = await this.prisma.variantAttributeValue.findMany({
        where: { id: { in: attributeValues.map((av) => av.attributeValueId) } },
      });
      sku = this.generateVariantSku(product!.slug, values);
    }

    // Create variant
    const variant = await this.prisma.productVariant.create({
      data: {
        ...variantData,
        productId,
        sku,
      },
    });

    // Link to attribute values
    await Promise.all(
      attributeValues.map((av) =>
        this.prisma.variantValue.create({
          data: {
            variantId: variant.id,
            attributeValueId: av.attributeValueId,
          },
        }),
      ),
    );

    return this.getVariantById(variant.id);
  }

  async updateVariant(id: string, dto: UpdateVariantDto) {
    const variant = await this.prisma.productVariant.update({
      where: { id },
      data: dto,
    });

    return this.getVariantById(variant.id);
  }

  async deleteVariant(id: string) {
    await this.prisma.productVariant.delete({ where: { id } });
    return { message: 'Variant deleted successfully' };
  }

  async getVariantById(id: string) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id },
      include: {
        values: {
          include: {
            attributeValue: {
              include: { attribute: true },
            },
          },
        },
      },
    });

    if (!variant) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }

    return variant;
  }

  // ============================================
  // VARIANT ATTRIBUTES (Global/Predefined)
  // ============================================

  async getVariantAttributes(storeId?: string) {
    const where: any = {
      OR: [
        { storeId: null }, // Global attributes
      ],
    };

    if (storeId) {
      where.OR.push({ storeId }); // Store-specific attributes
    }

    return this.prisma.variantAttribute.findMany({
      where,
      include: { values: true },
      orderBy: { name: 'asc' },
    });
  }

  // ============================================
  // CATEGORIES
  // ============================================

  async getCategories(storeId?: string) {
    const where: any = {
      OR: [
        { storeId: null }, // Global categories
      ],
    };

    if (storeId) {
      where.OR.push({ storeId }); // Store-specific categories
    }

    return this.prisma.category.findMany({
      where,
      include: {
        parent: true,
        children: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private generateVariantSku(productSlug: string, values: any[]): string {
    const valueSlugs = values.map((v) => v.slug || v.value.toLowerCase()).join('-');
    return `${productSlug}-${valueSlugs}`;
  }

  private generateCombinations(arrays: any[][]): any[][] {
    if (arrays.length === 0) return [[]];
    if (arrays.length === 1) return arrays[0].map((item) => [item]);

    const [first, ...rest] = arrays;
    const restCombinations = this.generateCombinations(rest);

    const combinations: any[][] = [];
    for (const item of first) {
      for (const combination of restCombinations) {
        combinations.push([item, ...combination]);
      }
    }

    return combinations;
  }

  /**
   * Enrich product with formatted price fields
   */
  private enrichProductWithFormattedPrices(product: any) {
    return {
      ...product,
      formattedBasePrice: formatPrice(product.basePrice),
      formattedComparePrice: product.comparePrice ? formatPrice(product.comparePrice) : null,
      variants: product.variants?.map((variant: any) => ({
        ...variant,
        formattedPrice: formatPrice(variant.price),
        formattedComparePrice: variant.comparePrice ? formatPrice(variant.comparePrice) : null,
      })),
    };
  }
}
