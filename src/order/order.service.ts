import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderStatusInput } from './dto/update-order-status.input';
import { OrderStatus } from './entities/order.entity';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) { }

    async create(createOrderInput: CreateOrderInput) {
        const { items, couponCode, ...orderData } = createOrderInput;

        // Generate a simple order number
        const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

        // Process items to fetch additional details (images, dimensions) from DB
        let subtotal = 0;
        const processedItems = await Promise.all(items.map(async (item) => {
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
                include: {
                    colors: true,
                    sizes: true,
                    accessories: true
                }
            });

            if (!product) {
                throw new BadRequestException(`عذراً، المنتج الذي تحاول طلبه غير متوفر حالياً`);
            }

            if (!product.isActive) {
                throw new BadRequestException(`عذراً، المنتج "${product.name}" لم يعد متوفراً في المتجر حالياً`);
            }

            // --- Server-side Price Calculation ---
            let basePrice = product.price || 0;

            // If a size is selected, update base price to size price
            if (item.sizeName) {
                const size = product.sizes.find(s => s.name === item.sizeName);
                if (size) {
                    basePrice = size.price;
                } else {
                    throw new Error(`Size ${item.sizeName} not found for product ${product.name}`);
                }
            }

            // Apply discount if exists
            const hasDiscount = !!(product.discountPercentage && product.discountPercentage > 0);
            const finalBasePrice = hasDiscount
                ? basePrice * (1 - product.discountPercentage / 100)
                : basePrice;

            // Find selected color image
            let colorImage = null;
            if (item.colorName) {
                const color = product.colors.find(c => c.name === item.colorName);
                if (color) colorImage = color.image;
            }

            // Find selected size dimensions
            let sizeDimensions = null;
            if (item.sizeName) {
                const size = product.sizes.find(s => s.name === item.sizeName);
                if (size) sizeDimensions = size.dimensions;
            }

            // Process accessories and validate their prices
            let totalAccessoriesPrice = 0;
            const processedAccessories = item.accessories ? item.accessories.map(acc => {
                const dbAccessory = product.accessories.find(a => a.name === acc.name);
                if (!dbAccessory) {
                    throw new Error(`Accessory ${acc.name} not found for product ${product.name}`);
                }
                totalAccessoriesPrice += dbAccessory.price;
                return {
                    name: dbAccessory.name,
                    price: dbAccessory.price,
                    image: dbAccessory.image
                };
            }) : undefined;

            const finalCalculatedPrice = finalBasePrice + totalAccessoriesPrice;
            subtotal += finalCalculatedPrice * item.quantity;

            return {
                productId: item.productId,
                quantity: item.quantity,
                price: finalCalculatedPrice, // Forced server-side price
                colorName: item.colorName,
                colorImage: colorImage,
                sizeName: item.sizeName,
                sizeDimensions: sizeDimensions,
                accessories: processedAccessories ? {
                    create: processedAccessories
                } : undefined
            };
        }));

        // Coupon Logic
        let discountAmount = 0;
        let finalCouponCode = null;

        if (couponCode) {
            const coupon = await this.prisma.coupon.findUnique({
                where: { code: couponCode.toUpperCase() }
            });

            if (coupon && coupon.isActive) {
                const isNotExpired = !coupon.expiryDate || new Date() <= coupon.expiryDate;
                const matchesMinAmount = !coupon.minOrderAmount || subtotal >= coupon.minOrderAmount;

                if (isNotExpired && matchesMinAmount) {
                    finalCouponCode = coupon.code;
                    if (coupon.discountType === 'PERCENTAGE') {
                        discountAmount = (subtotal * coupon.discountValue) / 100;
                    } else {
                        discountAmount = coupon.discountValue;
                    }
                }
            }
        }

        const finalTotalAmount = Math.max(0, subtotal - discountAmount);

        return this.prisma.order.create({
            data: {
                ...orderData,
                orderNumber,
                totalAmount: finalTotalAmount,
                discountAmount,
                couponCode: finalCouponCode,
                status: OrderStatus.PENDING,
                items: {
                    create: processedItems
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                        accessories: true,
                        order: true,
                    },
                },
            },
        });
    }

    async findAll(status?: OrderStatus, search?: string, skip?: number, take?: number) {
        const where: any = {};
        if (status) {
            where.status = status;
        }
        if (search) {
            where.OR = [
                { orderNumber: { contains: search, mode: 'insensitive' } },
                { customerName: { contains: search, mode: 'insensitive' } },
                { customerPhone: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [items, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: {
                    items: {
                        include: {
                            product: true,
                            accessories: true,
                        },
                    },
                },
            }),
            this.prisma.order.count({ where }),
        ]);

        return { items, total };
    }

    findOne(id: string) {
        return this.prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                        accessories: true,
                    },
                },
            },
        });
    }

    async updateStatus(updateOrderStatusInput: UpdateOrderStatusInput) {
        return this.prisma.order.update({
            where: { id: updateOrderStatusInput.id },
            data: { status: updateOrderStatusInput.status },
        });
    }

    async remove(id: string) {
        await this.prisma.order.delete({
            where: { id },
        });
        return true;
    }

    async getMonthlySales(months: number = 6) {
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);

        const orders = await this.prisma.order.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                },
                status: {
                    notIn: [OrderStatus.CANCELLED],
                },
            },
            select: {
                totalAmount: true,
                createdAt: true,
            },
        });

        const monthNames = [
            'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
            'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ];

        const monthlySalesMap = new Map<string, { totalSales: number; orderCount: number }>();

        // Initialize all months with zero values
        for (let i = 0; i < months; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthName = monthNames[date.getMonth()];
            monthlySalesMap.set(monthKey, { totalSales: 0, orderCount: 0 });
        }

        // Aggregate sales by month
        for (const order of orders) {
            const date = new Date(order.createdAt);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (monthlySalesMap.has(monthKey)) {
                const current = monthlySalesMap.get(monthKey)!;
                current.totalSales += order.totalAmount;
                current.orderCount += 1;
            }
        }

        // Convert to array and sort by date
        const result = Array.from(monthlySalesMap.entries())
            .map(([key, data]) => {
                const [year, month] = key.split('-').map(Number);
                return {
                    month: monthNames[month - 1],
                    totalSales: data.totalSales,
                    orderCount: data.orderCount,
                    sortKey: key,
                };
            })
            .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
            .map(({ month, totalSales, orderCount }) => ({ month, totalSales, orderCount }));

        return result;
    }
}
