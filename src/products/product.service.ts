import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    async findAll(category?: string, search?: string, skip?: number, take?: number, sortBy?: string, includeInactive: boolean = false) {
        const where: any = {
            slug: { not: { contains: '-deleted-' } } // Exclude soft-deleted products
        };

        if (!includeInactive) {
            where.isActive = true;
        }

        let orderBy: any = { createdAt: 'desc' };

        if (sortBy) {
            switch (sortBy) {
                case 'BEST_SELLING':
                    orderBy = { orderItems: { _count: 'desc' } };
                    break;
                case 'PRICE_LOW_TO_HIGH':
                    orderBy = { price: 'asc' };
                    break;
                case 'PRICE_HIGH_TO_LOW':
                    orderBy = { price: 'desc' };
                    break;
                case 'LATEST':
                default:
                    orderBy = { createdAt: 'desc' };
                    break;
            }
        }

        if (category) {
            where.category = { slug: category };
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: {
                    category: true,
                    colors: true,
                    sizes: true,
                    accessories: true,
                },
                skip,
                take,
                orderBy,
            }),
            this.prisma.product.count({ where }),
        ]);

        return { items, total };
    }

    async findBySlug(slug: string) {
        return this.prisma.product.findUnique({
            where: { slug },
            include: {
                category: true,
                colors: true,
                sizes: true,
                accessories: true,
            },
        });
    }

    async findById(id: string) {
        const result = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                colors: true,
                sizes: true,
                accessories: true,
            },
        });
        return result;
    }

    async create(data: any) {
        const { categoryId, colorIds, sizes, accessoryIds, ...rest } = data;
        return this.prisma.product.create({
            data: {
                ...rest,
                category: categoryId ? { connect: { id: categoryId } } : undefined,
                colors: colorIds ? { connect: colorIds.map((id: string) => ({ id })) } : undefined,
                sizes: sizes ? { create: sizes.map(({ id, productId, ...s }) => s) } : undefined,
                accessories: accessoryIds ? { connect: accessoryIds.map((id: string) => ({ id })) } : undefined,
            },
            include: {
                category: true,
                colors: true,
                sizes: true,
                accessories: true,
            },
        });
    }

    async update(id: string, data: any) {
        const { categoryId, colorIds, sizes, accessoryIds, ...rest } = data;

        // Perform main update
        await this.prisma.product.update({
            where: { id },
            data: {
                ...rest,
                category: categoryId ? { connect: { id: categoryId } } : (categoryId === null ? { disconnect: true } : undefined),
                colors: colorIds ? { set: colorIds.map((id: string) => ({ id })) } : undefined,
                accessories: accessoryIds ? { set: accessoryIds.map((id: string) => ({ id })) } : undefined,
            },
        });

        // Handle nested sizes - simple strategy: delete existing and create new if provided
        if (sizes) {
            await this.prisma.productSize.deleteMany({ where: { productId: id } });
            if (sizes.length > 0) {
                await this.prisma.productSize.createMany({
                    data: sizes.map((s: any) => ({
                        ...s,
                        id: undefined,
                        productId: id,
                    })),
                });
            }
        }

        return this.findById(id);
    }

    async delete(id: string) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (product) {
            await this.prisma.product.update({
                where: { id },
                data: {
                    isActive: false,
                    slug: `${product.slug}-deleted-${Date.now()}`
                }
            });
        }
        return true;
    }

    async bulkDelete(ids: string[]) {
        const products = await this.prisma.product.findMany({ where: { id: { in: ids } } });

        // Process sequentially to ensure unique slugs
        for (const product of products) {
            await this.prisma.product.update({
                where: { id: product.id },
                data: {
                    isActive: false,
                    slug: `${product.slug}-deleted-${Date.now()}`
                }
            });
        }
        return true;
    }
}
