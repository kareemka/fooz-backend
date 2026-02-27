import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import {
    Coupon,
    PaginatedCoupons,
    CreateCouponInput,
    UpdateCouponInput,
    CouponValidationResult
} from './models/coupon.model';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Throttle } from '@nestjs/throttler';
import { GqlThrottlerGuard } from '../common/guards/gql-throttler.guard';

@Resolver(() => Coupon)
export class CouponsResolver {
    constructor(private readonly couponsService: CouponsService) { }

    @Query(() => PaginatedCoupons, { name: 'coupons' })
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles('admin')
    findAll(
        @Args('search', { nullable: true }) search?: string,
        @Args('skip', { nullable: true, type: () => Int }) skip?: number,
        @Args('take', { nullable: true, type: () => Int }) take?: number,
    ) {
        return this.couponsService.findAll(search, skip, take);
    }

    @Query(() => Coupon, { name: 'coupon', nullable: true })
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles('admin')
    findOne(@Args('id', { type: () => ID }) id: string) {
        return this.couponsService.findOne(id);
    }

    @Query(() => CouponValidationResult, { name: 'validateCoupon' })
    @UseGuards(GqlThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60 } }) // منع brute-force لتخمين الكوبونات
    validateCoupon(
        @Args('code') code: string,
        @Args('subtotal') subtotal: number,
    ) {
        return this.couponsService.validateCoupon(code, subtotal);
    }

    @Mutation(() => Coupon)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles('admin')
    createCoupon(@Args('input') input: CreateCouponInput) {
        return this.couponsService.create(input);
    }

    @Mutation(() => Coupon)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles('admin')
    updateCoupon(
        @Args('id', { type: () => ID }) id: string,
        @Args('input') input: UpdateCouponInput,
    ) {
        return this.couponsService.update(id, input);
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles('admin')
    deleteCoupon(@Args('id', { type: () => ID }) id: string) {
        return this.couponsService.delete(id);
    }
}
