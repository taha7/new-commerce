import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { UploadService } from './upload.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/',
    }),
  ],
  controllers: [AppController, VendorController, ProductController],
  providers: [AppService, VendorService, ProductService, UploadService, PrismaService],
})
export class AppModule {}

