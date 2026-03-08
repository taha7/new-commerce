import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from './auth.guard';
import {
  CreateProductDto,
  UpdateProductDto,
  CreateVariantDto,
  UpdateVariantDto,
  GenerateVariantsDto,
  AddProductAttributesDto,
  ProductFilterDto,
} from './product.dto';

@Controller('vendor')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly uploadService: UploadService,
  ) {}

  // ============================================
  // PRODUCTS
  // ============================================

  @Post('products')
  async createProduct(@Body() dto: CreateProductDto, @Request() req: any) {
    // Verify vendor owns the store
    await this.verifyStoreOwnership(dto.storeId, req.user.userId);
    return this.productService.createProduct(dto);
  }

  @Get('products')
  async getProducts(@Query() filter: ProductFilterDto) {
    return this.productService.getProducts(filter);
  }

  @Get('products/:id')
  async getProduct(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Patch('products/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Request() req: any,
  ) {
    // Verify ownership
    const product = await this.productService.getProductById(id);
    await this.verifyStoreOwnership(product.storeId, req.user.userId);
    
    return this.productService.updateProduct(id, dto);
  }

  @Delete('products/:id')
  async deleteProduct(@Param('id') id: string, @Request() req: any) {
    // Verify ownership
    const product = await this.productService.getProductById(id);
    await this.verifyStoreOwnership(product.storeId, req.user.userId);
    
    return this.productService.deleteProduct(id);
  }

  // ============================================
  // PRODUCT ATTRIBUTES
  // ============================================

  @Post('products/:id/attributes')
  async addProductAttributes(
    @Param('id') id: string,
    @Body() dto: Omit<AddProductAttributesDto, 'productId'>,
    @Request() req: any,
  ) {
    // Verify ownership
    const product = await this.productService.getProductById(id);
    await this.verifyStoreOwnership(product.storeId, req.user.userId);
    
    return this.productService.addProductAttributes({
      productId: id,
      attributeIds: dto.attributeIds,
    });
  }

  // ============================================
  // VARIANTS
  // ============================================

  @Post('products/:id/variants/generate')
  async generateVariants(
    @Param('id') id: string,
    @Body() dto: Omit<GenerateVariantsDto, 'productId'>,
    @Request() req: any,
  ) {
    // Verify ownership
    const product = await this.productService.getProductById(id);
    await this.verifyStoreOwnership(product.storeId, req.user.userId);
    
    return this.productService.generateVariants({
      productId: id,
      ...dto,
    });
  }

  @Post('products/:id/variants')
  async createVariant(
    @Param('id') id: string,
    @Body() dto: Omit<CreateVariantDto, 'productId'>,
    @Request() req: any,
  ) {
    // Verify ownership
    const product = await this.productService.getProductById(id);
    await this.verifyStoreOwnership(product.storeId, req.user.userId);
    
    return this.productService.createVariant({
      productId: id,
      ...dto,
    });
  }

  @Patch('variants/:id')
  async updateVariant(
    @Param('id') id: string,
    @Body() dto: UpdateVariantDto,
    @Request() req: any,
  ) {
    // Verify ownership through variant's product
    const variant = await this.productService.getVariantById(id);
    const product = await this.productService.getProductById(variant.productId);
    await this.verifyStoreOwnership(product.storeId, req.user.userId);
    
    return this.productService.updateVariant(id, dto);
  }

  @Delete('variants/:id')
  async deleteVariant(@Param('id') id: string, @Request() req: any) {
    // Verify ownership through variant's product
    const variant = await this.productService.getVariantById(id);
    const product = await this.productService.getProductById(variant.productId);
    await this.verifyStoreOwnership(product.storeId, req.user.userId);
    
    return this.productService.deleteVariant(id);
  }

  // ============================================
  // VARIANT ATTRIBUTES (Global/Predefined)
  // ============================================

  @Get('variant-attributes')
  async getVariantAttributes(@Query('storeId') storeId?: string) {
    return this.productService.getVariantAttributes(storeId);
  }

  // ============================================
  // CATEGORIES
  // ============================================

  @Get('categories')
  async getCategories(@Query('storeId') storeId?: string) {
    return this.productService.getCategories(storeId);
  }

  // ============================================
  // PRODUCT IMAGES
  // ============================================

  @Post('products/:id/images')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProductImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('altText') altText?: string,
    @Body('position') position?: string,
    @Body('isFeatured') isFeatured?: string,
    @Body('variantValueId') variantValueId?: string,
    @Request() req?: any,
  ) {
    // Verify ownership
    const product = await this.productService.getProductById(id);
    await this.verifyStoreOwnership(product.storeId, req.user.userId);

    return this.uploadService.uploadProductImage(
      id,
      file,
      altText,
      position ? parseInt(position) : undefined,
      isFeatured === 'true',
      variantValueId,
    );
  }

  @Delete('images/:id')
  async deleteProductImage(@Param('id') id: string, @Request() req: any) {
    // Get image to verify ownership
    const image = await this.uploadService['prisma'].productImage.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!image) {
      throw new Error('Image not found');
    }

    await this.verifyStoreOwnership(image.product.storeId, req.user.userId);
    return this.uploadService.deleteProductImage(id);
  }

  @Patch('images/:id/position')
  async updateImagePosition(
    @Param('id') id: string,
    @Body('position') position: number,
    @Request() req: any,
  ) {
    // Get image to verify ownership
    const image = await this.uploadService['prisma'].productImage.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!image) {
      throw new Error('Image not found');
    }

    await this.verifyStoreOwnership(image.product.storeId, req.user.userId);
    return this.uploadService.updateImagePosition(id, position);
  }

  @Patch('images/:id/featured')
  async setFeaturedImage(@Param('id') id: string, @Request() req: any) {
    // Get image to verify ownership
    const image = await this.uploadService['prisma'].productImage.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!image) {
      throw new Error('Image not found');
    }

    await this.verifyStoreOwnership(image.product.storeId, req.user.userId);
    return this.uploadService.setFeaturedImage(id, image.productId);
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  private async verifyStoreOwnership(storeId: string, userId: string) {
    const store = await this.productService['prisma'].store.findUnique({
      where: { id: storeId },
      include: { vendor: true },
    });

    if (!store || store.vendor.userId !== userId) {
      throw new Error('Unauthorized: You do not own this store');
    }
  }
}
