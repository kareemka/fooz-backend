import { Module } from '@nestjs/common';
import { CategoryService } from './categories.service';
import { CategoryResolver } from './categories.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    providers: [CategoryService, CategoryResolver, PrismaService],
    exports: [CategoryService],
})
export class CategoriesModule { }
