import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MediaService } from './media.service';
import { Media, PaginatedMedia, MediaType } from './models/media.model';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => Media)
export class MediaResolver {
    constructor(private readonly mediaService: MediaService) { }

    @Query(() => PaginatedMedia)
    async mediaFiles(
        @Args('type', { type: () => MediaType, nullable: true }) type?: MediaType,
        @Args('page', { type: () => Int, defaultValue: 1 }) page?: number,
        @Args('limit', { type: () => Int, defaultValue: 20 }) limit?: number,
    ) {
        // MediaService returns { items, meta: { total, ... } }
        const result = await this.mediaService.getAllFiles(type as any, page, limit);
        return {
            items: result.items,
            total: result.meta.total,
        };
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtAuthGuard)
    async deleteMedia(@Args('id') id: string) {
        await this.mediaService.deleteFile(id);
        return true;
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtAuthGuard)
    async deleteMultipleMedia(@Args('ids', { type: () => [String] }) ids: string[]) {
        await this.mediaService.deleteMultipleFiles(ids);
        return true;
    }
}
