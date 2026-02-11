import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order, PaginatedOrders, MonthlySales } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderStatusInput } from './dto/update-order-status.input';
import { OrderStatus } from './entities/order.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { GqlThrottlerGuard } from '../common/guards/gql-throttler.guard';

@Resolver(() => Order)
export class OrderResolver {
    constructor(private readonly orderService: OrderService) { }

    @Mutation(() => Order)
    @UseGuards(GqlThrottlerGuard)
    @Throttle({ default: { limit: 2, ttl: 60000 } }) // Limit to 2 orders per minute per IP
    createOrder(@Args('input') createOrderInput: CreateOrderInput) {
        return this.orderService.create(createOrderInput);
    }

    @Query(() => PaginatedOrders, { name: 'orders' })
    @UseGuards(GqlAuthGuard)
    findAll(
        @Args('status', { type: () => OrderStatus, nullable: true }) status?: OrderStatus,
        @Args('search', { type: () => String, nullable: true }) search?: string,
        @Args('skip', { type: () => Int, nullable: true }) skip?: number,
        @Args('take', { type: () => Int, nullable: true }) take?: number,
    ) {
        return this.orderService.findAll(status, search, skip, take);
    }

    @Query(() => Order, { name: 'order' })
    @UseGuards(GqlAuthGuard)
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.orderService.findOne(id);
    }

    @Mutation(() => Order)
    @UseGuards(GqlAuthGuard)
    updateOrderStatus(@Args('input') updateOrderStatusInput: UpdateOrderStatusInput) {
        return this.orderService.updateStatus(updateOrderStatusInput);
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAuthGuard)
    removeOrder(@Args('id', { type: () => String }) id: string) {
        return this.orderService.remove(id);
    }

    @Query(() => [MonthlySales], { name: 'monthlySales' })
    @UseGuards(GqlAuthGuard)
    getMonthlySales(
        @Args('months', { type: () => Int, nullable: true, defaultValue: 6 }) months?: number,
    ) {
        return this.orderService.getMonthlySales(months);
    }
}
