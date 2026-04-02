import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { Product, CreateProductInput, UpdateProductInput, PaginatedProducts, ProductSort } from './models/product.model';
import { ProductService } from './product.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Resolver(() => Product)
export class ProductResolver {
    constructor(private productService: ProductService) { }

    @Query(() => PaginatedProducts, { name: 'products' })
    async getProducts(
        @Args('category', { nullable: true }) category?: string,
        @Args('search', { nullable: true }) search?: string,
        @Args('skip', { nullable: true, type: () => Int }) skip?: number,
        @Args('take', { nullable: true, type: () => Int }) take?: number,
        @Args('sortBy', { nullable: true, type: () => ProductSort }) sortBy?: ProductSort,
        @Args('includeInactive', { nullable: true, type: () => Boolean, defaultValue: false }) includeInactive?: boolean,
    ) {
        return this.productService.findAll(category, search, skip, take, sortBy, includeInactive);
    }

    @Query(() => Product, { name: 'productBySlug', nullable: true })
    async getProductBySlug(@Args('slug') slug: string) {
        const decodedSlug = decodeURIComponent(slug);
        return this.productService.findBySlug(decodedSlug);
    }

    @Query(() => Product, { name: 'product', nullable: true })
    async getProduct(@Args('id', { type: () => ID }) id: string) {
        return this.productService.findById(id);
    }

    @Mutation(() => Product)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles('admin')
    async createProduct(
        @Args('input') input: CreateProductInput,
    ) {
        return this.productService.create(input);
    }

    @Mutation(() => Product)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles('admin')
    async updateProduct(
        @Args('id', { type: () => ID }) id: string,
        @Args('input') input: UpdateProductInput,
    ) {
        return this.productService.update(id, input);
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles('admin')
    async deleteProduct(@Args('id', { type: () => ID }) id: string) {
        return this.productService.delete(id);
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles('admin')
    async bulkDeleteProducts(@Args('ids', { type: () => [ID] }) ids: string[]) {
        return this.productService.bulkDelete(ids);
    }
}
