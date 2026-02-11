import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccessoryInput } from './dto/create-accessory.input';

@Injectable()
export class AccessoriesService {
    constructor(private prisma: PrismaService) { }

    create(createAccessoryInput: CreateAccessoryInput) {
        return this.prisma.accessory.create({
            data: createAccessoryInput,
        });
    }

    async findAll(search?: string, skip?: number, take?: number) {
        const where: any = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [items, total] = await Promise.all([
            this.prisma.accessory.findMany({
                where,
                skip,
                take,
                orderBy: { name: 'asc' },
            }),
            this.prisma.accessory.count({ where }),
        ]);

        return { items, total };
    }

    findOne(id: string) {
        return this.prisma.accessory.findUnique({
            where: { id },
        });
    }

    update(id: string, updateAccessoryInput: Partial<CreateAccessoryInput>) {
        return this.prisma.accessory.update({
            where: { id },
            data: updateAccessoryInput,
        });
    }

    remove(id: string) {
        return this.prisma.accessory.delete({
            where: { id },
        });
    }

    async bulkDelete(ids: string[]) {
        await this.prisma.accessory.deleteMany({
            where: { id: { in: ids } },
        });
        return true;
    }
}
