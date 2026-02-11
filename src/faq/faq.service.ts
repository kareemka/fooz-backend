import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFaqInput } from './dto/create-faq.input';
import { UpdateFaqInput } from './dto/update-faq.input';

@Injectable()
export class FaqService {
    constructor(private prisma: PrismaService) { }

    create(createFaqInput: CreateFaqInput) {
        return this.prisma.faq.create({
            data: createFaqInput,
        });
    }

    async findAll(search?: string, skip?: number, take?: number, isActive?: boolean) {
        const where: any = {};
        if (search) {
            where.OR = [
                { question: { contains: search, mode: 'insensitive' } },
                { answer: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        const [items, total] = await Promise.all([
            this.prisma.faq.findMany({
                where,
                skip,
                take,
                orderBy: { order: 'asc' },
            }),
            this.prisma.faq.count({ where }),
        ]);

        return { items, total };
    }

    findOne(id: string) {
        return this.prisma.faq.findUnique({
            where: { id },
        });
    }

    update(id: string, updateFaqInput: UpdateFaqInput) {
        const { id: _, ...data } = updateFaqInput;
        return this.prisma.faq.update({
            where: { id },
            data,
        });
    }

    remove(id: string) {
        return this.prisma.faq.delete({
            where: { id },
        });
    }

    async bulkDelete(ids: string[]) {
        await this.prisma.faq.deleteMany({
            where: { id: { in: ids } },
        });
        return true;
    }
}
