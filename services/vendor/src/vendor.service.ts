import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateVendorDto, CreateStoreDto } from './vendor.dto';

@Injectable()
export class VendorService {
  constructor(private prisma: PrismaService) {}

  async createVendorProfile(userId: string, createVendorDto: CreateVendorDto) {
    // Check if vendor already exists for this user
    const existingVendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (existingVendor) {
      throw new ConflictException(
        'Vendor profile already exists for this user',
      );
    }

    // Create vendor profile
    const vendor = await this.prisma.vendor.create({
      data: {
        userId,
        businessName: createVendorDto.businessName,
        businessType: createVendorDto.businessType,
        description: createVendorDto.description,
        contactPhone: createVendorDto.contactPhone,
        address: createVendorDto.address,
        city: createVendorDto.city,
        state: createVendorDto.state,
        zipCode: createVendorDto.zipCode,
        country: createVendorDto.country,
      },
    });

    return {
      message: 'Vendor profile created successfully',
      vendor,
    };
  }

  async getVendorProfile(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
      include: {
        stores: true,
      },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    return vendor;
  }

  async createStore(userId: string, createStoreDto: CreateStoreDto) {
    // Get vendor first
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    // Check if slug is already taken
    const existingStore = await this.prisma.store.findUnique({
      where: { slug: createStoreDto.slug },
    });

    if (existingStore) {
      throw new ConflictException('Store slug already exists');
    }

    // Create store
    const store = await this.prisma.store.create({
      data: {
        vendorId: vendor.id,
        name: createStoreDto.name,
        slug: createStoreDto.slug,
        description: createStoreDto.description,
      },
    });

    return {
      message: 'Store created successfully',
      store,
    };
  }

  async getStores(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
      include: {
        stores: true,
      },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    return vendor.stores;
  }
}
