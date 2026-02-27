import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { AccessoriesService } from './accessories.service';
import { Accessory, PaginatedAccessories } from './entities/accessory.entity';
import { CreateAccessoryInput } from './dto/create-accessory.input';
import { UpdateAccessoryInput } from './dto/update-accessory.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Resolver(() => Accessory)
export class AccessoriesResolver {
    constructor(private readonly accessoriesService: AccessoriesService) { }

    @Mutation(() => Accessory)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles('admin')
    createAccessory(@Args('createAccessoryInput') createAccessoryInput: CreateAccessoryInput) {
        return this.accessoriesService.create(createAccessoryInput);
    }

    @Query(() => PaginatedAccessories, { name: 'accessories' })
    findAll(
        @Args('search', { nullable: true }) search?: string,
        @Args('skip', { nullable: true, type: () => Int }) skip?: number,
        @Args('take', { nullable: true, type: () => Int }) take?: number,
    ) {
        return this.accessoriesService.findAll(search, skip, take);
    }

    @Query(() => Accessory, { name: 'accessory' })
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.accessoriesService.findOne(id);
    }

    @Mutation(() => Accessory)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles('admin')
    updateAccessory(
        @Args('id', { type: () => String }) id: string,
        @Args('updateAccessoryInput') updateAccessoryInput: UpdateAccessoryInput
    ) {
        return this.accessoriesService.update(id, updateAccessoryInput);
    }

    @Mutation(() => Accessory)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles('admin')
    removeAccessory(@Args('id', { type: () => String }) id: string) {
        return this.accessoriesService.remove(id);
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles('admin')
    async bulkDeleteAccessories(@Args('ids', { type: () => [ID] }) ids: string[]) {
        await this.accessoriesService.bulkDelete(ids);
        return true;
    }
}
