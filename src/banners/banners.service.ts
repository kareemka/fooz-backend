import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBannerInput } from './dto/create-banner.input';
import { UpdateBannerInput } from './dto/update-banner.input';

@Injectable()
export class BannersService {
    constructor(private prisma: PrismaService) { }

    async findAll(search?: string, skip?: number, take?: number) {
        const where: any = {};

        if (search) {
            where.title = { contains: search, mode: 'insensitive' };
        }

        const [items, total] = await Promise.all([
            this.prisma.banner.findMany({
                where,
                skip,
                take,
                orderBy: { order: 'asc' },
            }),
            this.prisma.banner.count({ where }),
        ]);

        return { items, total };
    }

    async findActive() {
        return this.prisma.banner.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.banner.findUnique({
            where: { id },
        });
    }

    async create(data: CreateBannerInput) {
        return this.prisma.banner.create({
            data: {
                title: data.title,
                image: data.image,
                link: data.link,
                order: data.order,
                isActive: data.isActive,
            },
        });
    }

    async update(id: string, data: UpdateBannerInput) {
        return this.prisma.banner.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        await this.prisma.banner.delete({ where: { id } });
        return true;
    }

    async bulkDelete(ids: string[]) {
        await this.prisma.banner.deleteMany({
            where: { id: { in: ids } },
        });
        return true;
    }
}
