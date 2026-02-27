import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponInput, UpdateCouponInput, CouponValidationResult } from './models/coupon.model';
import { DiscountType } from '@prisma/client';

@Injectable()
export class CouponsService {
    constructor(private prisma: PrismaService) { }

    async findAll(search?: string, skip?: number, take?: number) {
        const where: any = {};
        if (search) {
            where.code = { contains: search, mode: 'insensitive' };
        }

        const [items, total] = await Promise.all([
            this.prisma.coupon.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.coupon.count({ where }),
        ]);

        return { items, total };
    }

    async findOne(id: string) {
        return this.prisma.coupon.findUnique({ where: { id } });
    }

    async findByCode(code: string) {
        return this.prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    }

    async create(input: CreateCouponInput) {
        return this.prisma.coupon.create({
            data: {
                ...input,
                code: input.code.toUpperCase(),
            },
        });
    }

    async update(id: string, input: UpdateCouponInput) {
        return this.prisma.coupon.update({
            where: { id },
            data: {
                ...input,
                code: input.code ? input.code.toUpperCase() : undefined,
            },
        });
    }

    async delete(id: string) {
        await this.prisma.coupon.delete({ where: { id } });
        return true;
    }

    async validateCoupon(code: string, subtotal: number): Promise<CouponValidationResult> {
        const coupon = await this.findByCode(code);

        if (!coupon) {
            return { isValid: false, message: 'الكود غير موجود' };
        }

        if (!coupon.isActive) {
            return { isValid: false, message: 'الكود غير مفعل حالياً' };
        }

        if (coupon.expiryDate && new Date() > coupon.expiryDate) {
            return { isValid: false, message: 'انتهت صلاحية هذا الكود' };
        }

        if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
            return {
                isValid: false,
                message: `الحد الأدنى للطلب لاستخدام هذا الكود هو ${coupon.minOrderAmount} د.ع`
            };
        }

        let discountAmount = 0;
        if (coupon.discountType === DiscountType.PERCENTAGE) {
            discountAmount = (subtotal * coupon.discountValue) / 100;
        } else {
            discountAmount = coupon.discountValue;
        }

        return {
            isValid: true,
            discountAmount,
            message: 'تم تطبيق الكود بنجاح',
        };
    }
}
