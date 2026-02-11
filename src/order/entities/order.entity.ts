import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Product } from '../../products/models/product.model';

export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

registerEnumType(OrderStatus, {
    name: 'OrderStatus',
});

@ObjectType()
export class OrderItemAccessory {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    price: number;

    @Field({ nullable: true })
    image?: string;
}

@ObjectType()
export class OrderItem {
    @Field(() => ID)
    id: string;

    @Field()
    orderId: string;

    @Field()
    productId: string;

    @Field(() => Product, { nullable: true })
    product?: Product;

    @Field()
    quantity: number;

    @Field()
    price: number;

    @Field({ nullable: true })
    colorName?: string;

    @Field({ nullable: true })
    colorImage?: string;

    @Field({ nullable: true })
    sizeName?: string;

    @Field({ nullable: true })
    sizeDimensions?: string;

    @Field(() => [OrderItemAccessory], { nullable: true })
    accessories?: OrderItemAccessory[];
}

@ObjectType()
export class Order {
    @Field(() => ID)
    id: string;

    @Field()
    orderNumber: string;

    @Field()
    customerName: string;


    @Field()
    customerPhone: string;

    @Field()
    shippingAddress: string;

    @Field()
    totalAmount: number;

    @Field()
    discountAmount: number;

    @Field({ nullable: true })
    couponCode?: string;

    @Field(() => OrderStatus)
    status: OrderStatus;

    @Field(() => [OrderItem])
    items: OrderItem[];

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

@ObjectType()
export class PaginatedOrders {
    @Field(() => [Order])
    items: Order[];

    @Field()
    total: number;
}

@ObjectType()
export class MonthlySales {
    @Field()
    month: string;

    @Field()
    totalSales: number;

    @Field()
    orderCount: number;
}
