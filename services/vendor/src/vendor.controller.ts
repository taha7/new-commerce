import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { JwtAuthGuard } from './auth.guard';
import { CreateVendorDto, CreateStoreDto } from './vendor.dto';
import type { AuthenticatedRequest } from './types';

@Controller('vendor')
@UseGuards(JwtAuthGuard)
export class VendorController {
  constructor(private vendorService: VendorService) {}

  @Post('profile')
  async createVendorProfile(
    @Body(ValidationPipe) createVendorDto: CreateVendorDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;
    return this.vendorService.createVendorProfile(userId, createVendorDto);
  }

  @Get('profile')
  async getVendorProfile(@Request() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.vendorService.getVendorProfile(userId);
  }

  @Post('stores')
  async createStore(
    @Body(ValidationPipe) createStoreDto: CreateStoreDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;
    return this.vendorService.createStore(userId, createStoreDto);
  }

  @Get('stores')
  async getStores(@Request() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.vendorService.getStores(userId);
  }
}
