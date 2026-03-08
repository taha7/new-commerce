import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly uploadDir = '/app/public/uploads';

  constructor(private prisma: PrismaService) {
    this.ensureUploadDirExists();
  }

  private ensureUploadDirExists() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadProductImage(
    productId: string,
    file: Express.Multer.File,
    altText?: string,
    position?: number,
    isFeatured?: boolean,
    variantValueId?: string,
  ) {
    // Get product to get store ID
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    // Create store-specific directory
    const storeDir = path.join(this.uploadDir, 'stores', product.storeId, 'products');
    if (!fs.existsSync(storeDir)) {
      fs.mkdirSync(storeDir, { recursive: true });
    }

    // Generate unique filename
    const fileExt = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`;
    const filePath = path.join(storeDir, fileName);

    // Save file
    fs.writeFileSync(filePath, file.buffer);

    // Create database record with full URL including backend port
    const baseUrl = process.env.BASE_URL || 'http://localhost:3002';
    const url = `${baseUrl}/uploads/stores/${product.storeId}/products/${fileName}`;
    
    const image = await this.prisma.productImage.create({
      data: {
        productId,
        url,
        altText,
        position: position ?? 0,
        isFeatured: isFeatured ?? false,
        variantValueId,
      },
    });

    return image;
  }

  async deleteProductImage(imageId: string) {
    const image = await this.prisma.productImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new BadRequestException('Image not found');
    }

    // Delete file from filesystem
    const filePath = path.join('/app/public', image.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete database record
    await this.prisma.productImage.delete({
      where: { id: imageId },
    });

    return { message: 'Image deleted successfully' };
  }

  async updateImagePosition(imageId: string, position: number) {
    return this.prisma.productImage.update({
      where: { id: imageId },
      data: { position },
    });
  }

  async setFeaturedImage(imageId: string, productId: string) {
    // Unset all featured images for this product
    await this.prisma.productImage.updateMany({
      where: { productId },
      data: { isFeatured: false },
    });

    // Set this image as featured
    return this.prisma.productImage.update({
      where: { id: imageId },
      data: { isFeatured: true },
    });
  }
}
