import { ObjectType, Field, ID, InputType, PartialType, Int } from '@nestjs/graphql';
import { Product } from '../../products/models/product.model';

@ObjectType()
export class Category {
    @Field(() => ID)
    id: string;

    @Field()
    slug: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    image?: string;

    @Field(() => [Product], { nullable: true })
    products?: any[]; // Keep as any to avoid circular issues

    @Field(() => Int, { defaultValue: 0 })
    productsCount?: number;
}

@ObjectType()
export class PaginatedCategories {
    @Field(() => [Category])
    items: Category[];

    @Field(() => Int)
    total: number;
}

import { IsString, IsOptional } from 'class-validator';

@InputType()
export class CreateCategoryInput {
    @Field()
    @IsString()
    name: string;

    @Field()
    @IsString()
    slug: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    image?: string;
}

@InputType()
export class UpdateCategoryInput extends PartialType(CreateCategoryInput) { }
