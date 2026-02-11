import { Module } from '@nestjs/common';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    providers: [ProductResolver, ProductService, PrismaService],
    exports: [ProductService],
})
export class ProductsModule { }
