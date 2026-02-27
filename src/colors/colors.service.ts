import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateColorInput, UpdateColorInput } from './models/color.model';

@Injectable()
export class ColorsService {
    constructor(private prisma: PrismaService) { }

    async findAll(search?: string, skip?: number, take?: number) {
        const where: any = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [items, total] = await Promise.all([
            this.prisma.color.findMany({
                where,
                skip,
                take,
                orderBy: { name: 'asc' },
            }),
            this.prisma.color.count({ where }),
        ]);

        return { items, total };
    }

    async findOne(id: string) {
        return this.prisma.color.findUnique({
            where: { id },
        });
    }

    async create(data: CreateColorInput) {
        return this.prisma.color.create({
            data,
        });
    }

    async update(id: string, data: UpdateColorInput) {
        return this.prisma.color.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        await this.prisma.color.delete({ where: { id } });
        return true;
    }

    async bulkDelete(ids: string[]) {
        await this.prisma.color.deleteMany({
            where: { id: { in: ids } },
        });
        return true;
    }
}
