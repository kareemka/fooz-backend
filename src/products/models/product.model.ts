import { ObjectType, Field, ID, Float, Int, InputType, PartialType, registerEnumType } from '@nestjs/graphql';
import { Category } from '../../categories/models/category.model';
import { Accessory } from '../../accessories/entities/accessory.entity';
import { Color } from '../../colors/models/color.model';

export enum ProductSort {
    LATEST = 'LATEST',
    BEST_SELLING = 'BEST_SELLING',
    PRICE_LOW_TO_HIGH = 'PRICE_LOW_TO_HIGH',
    PRICE_HIGH_TO_LOW = 'PRICE_HIGH_TO_LOW',
}

registerEnumType(ProductSort, {
    name: 'ProductSort',
});

@ObjectType()
@InputType('ProductSizeInput')
export class ProductSize {
    @Field(() => ID, { nullable: true })
    id?: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    dimensions?: string;

    @Field(() => Float)
    price: number;

    @Field({ nullable: true })
    productId?: string;
}

@ObjectType()
export class Product {
    @Field(() => ID)
    id: string;

    @Field()
    slug: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => Float)
    price: number;

    @Field(() => Float, { nullable: true })
    discountPercentage?: number; // 0-100

    @Field(() => Int)
    stock: number;

    @Field(() => Boolean)
    isActive: boolean;

    @Field({ nullable: true })
    categoryId?: string;

    @Field(() => Category, { nullable: true })
    category?: any;

    @Field()
    mainImage: string;

    @Field(() => [String])
    galleryImages: string[];

    @Field({ nullable: true })
    glbFileUrl?: string;

    @Field(() => [Color])
    colors: Color[];

    @Field(() => [ProductSize])
    sizes: ProductSize[];

    @Field(() => [Accessory])
    accessories: Accessory[];

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

@ObjectType()
export class PaginatedProducts {
    @Field(() => [Product])
    items: Product[];

    @Field(() => Int)
    total: number;
}

import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, IsInt } from 'class-validator';

@InputType()
export class CreateProductInput {
    @Field()
    @IsString()
    name: string;

    @Field()
    @IsString()
    slug: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    description?: string;

    @Field(() => Float)
    @IsNumber()
    price: number;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    discountPercentage?: number; // 0-100

    @Field(() => Int)
    @IsInt()
    stock: number;

    @Field(() => Boolean, { defaultValue: true })
    @IsBoolean()
    isActive: boolean;

    @Field()
    @IsString()
    mainImage: string;

    @Field(() => [String], { defaultValue: [] })
    @IsArray()
    @IsString({ each: true })
    galleryImages: string[];

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    glbFileUrl?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    categoryId?: string;

    @Field(() => [String], { nullable: true })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    colorIds?: string[];

    @Field(() => [ProductSize], { nullable: true })
    @IsOptional()
    @IsArray()
    sizes?: ProductSize[];

    @Field(() => [String], { nullable: true })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    accessoryIds?: string[];
}

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) { }
