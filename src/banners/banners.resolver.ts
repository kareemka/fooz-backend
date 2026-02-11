import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { Banner } from './models/banner.model';
import { CreateBannerInput } from './dto/create-banner.input';
import { UpdateBannerInput } from './dto/update-banner.input';
import { BannersService } from './banners.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class PaginatedBanners {
    @Field(() => [Banner])
    items: Banner[];

    @Field(() => Int)
    total: number;
}

@Resolver(() => Banner)
export class BannerResolver {
    constructor(private bannersService: BannersService) { }

    @Query(() => PaginatedBanners, { name: 'banners' })
    async getBanners(
        @Args('search', { nullable: true }) search?: string,
        @Args('skip', { nullable: true, type: () => Int }) skip?: number,
        @Args('take', { nullable: true, type: () => Int }) take?: number,
    ) {
        return this.bannersService.findAll(search, skip, take);
    }

    @Query(() => [Banner], { name: 'activeBanners' })
    async getActiveBanners() {
        return this.bannersService.findActive();
    }

    @Query(() => Banner, { name: 'banner', nullable: true })
    async getBanner(@Args('id', { type: () => ID }) id: string) {
        return this.bannersService.findOne(id);
    }

    @Mutation(() => Banner)
    @UseGuards(GqlAuthGuard)
    async createBanner(
        @Args('input') input: CreateBannerInput,
    ) {
        return this.bannersService.create(input);
    }

    @Mutation(() => Banner)
    @UseGuards(GqlAuthGuard)
    async updateBanner(
        @Args('id', { type: () => ID }) id: string,
        @Args('input') input: UpdateBannerInput,
    ) {
        return this.bannersService.update(id, input);
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAuthGuard)
    async deleteBanner(@Args('id', { type: () => ID }) id: string) {
        return this.bannersService.delete(id);
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAuthGuard)
    async bulkDeleteBanners(@Args('ids', { type: () => [ID] }) ids: string[]) {
        return this.bannersService.bulkDelete(ids);
    }
}
