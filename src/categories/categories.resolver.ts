import { Resolver, Query, Mutation, Args, ID, Int, ResolveField, Parent } from '@nestjs/graphql';
import { Category, CreateCategoryInput, UpdateCategoryInput, PaginatedCategories } from './models/category.model';
import { CategoryService } from './categories.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

@Resolver(() => Category)
export class CategoryResolver {
    constructor(private categoryService: CategoryService) { }

    @ResolveField(() => Int)
    async productsCount(@Parent() category: Category) {
        return this.categoryService.countProducts(category.id);
    }

    @Query(() => PaginatedCategories, { name: 'categories' })
    async getCategories(
        @Args('search', { nullable: true }) search?: string,
        @Args('skip', { nullable: true, type: () => Int }) skip?: number,
        @Args('take', { nullable: true, type: () => Int }) take?: number,
    ) {
        console.log('getCategories args:', { search, skip, take });
        return this.categoryService.findAll(search, skip, take);
    }

    @Query(() => Category, { name: 'categoryBySlug', nullable: true })
    async getCategoryBySlug(@Args('slug') slug: string) {
        return this.categoryService.findBySlug(slug);
    }

    @Mutation(() => Category)
    @UseGuards(GqlAuthGuard)
    async createCategory(
        @Args('input') input: CreateCategoryInput,
    ) {
        return this.categoryService.create(input);
    }

    @Mutation(() => Category)
    @UseGuards(GqlAuthGuard)
    async updateCategory(
        @Args('id', { type: () => ID }) id: string,
        @Args('input') input: UpdateCategoryInput,
    ) {
        return this.categoryService.update(id, input);
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAuthGuard)
    async deleteCategory(@Args('id', { type: () => ID }) id: string) {
        return this.categoryService.delete(id);
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAuthGuard)
    async bulkDeleteCategories(@Args('ids', { type: () => [ID] }) ids: string[]) {
        return this.categoryService.bulkDelete(ids);
    }
}
