import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) { }

    async findAll(search?: string, skip?: number, take?: number) {
        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [items, total] = await Promise.all([
            this.prisma.category.findMany({
                where,
                skip,
                take,
                orderBy: { name: 'asc' },
            }),
            this.prisma.category.count({ where }),
        ]);

        return { items, total };
    }

    async findBySlug(slug: string) {
        return this.prisma.category.findUnique({
            where: { slug },
            include: {
                products: true,
            },
        });
    }

    async create(data: { name: string; slug: string; image?: string }) {
        return this.prisma.category.create({
            data,
        });
    }

    async update(id: string, data: any) {
        return this.prisma.category.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        await this.prisma.category.delete({ where: { id } });
        return true;
    }

    async bulkDelete(ids: string[]) {
        await this.prisma.category.deleteMany({
            where: { id: { in: ids } },
        });
        return true;
    }

    async countProducts(categoryId: string) {
        return this.prisma.product.count({
            where: { categoryId },
        });
    }
}
