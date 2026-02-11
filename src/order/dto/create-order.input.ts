import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, ValidateNested, IsArray, Min } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
class CreateOrderItemAccessoryInput {
    @Field()
    @IsString()
    name: string;

    @Field()
    @IsNumber()
    @Min(0)
    price: number;
}

@InputType()
class CreateOrderItemInput {
    @Field()
    @IsString()
    productId: string;

    @Field()
    @IsNumber()
    @Min(1)
    quantity: number;

    @Field()
    @IsNumber()
    @Min(0)
    price: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    colorName?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    sizeName?: string;

    @Field(() => [CreateOrderItemAccessoryInput], { nullable: true })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemAccessoryInput)
    accessories?: CreateOrderItemAccessoryInput[];
}

@InputType()
export class CreateOrderInput {
    @Field()
    @IsString()
    customerName: string;

    @Field()
    @IsString()
    customerPhone: string;

    @Field()
    @IsString()
    shippingAddress: string;

    @Field(() => [CreateOrderItemInput])
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemInput)
    items: CreateOrderItemInput[];

    @Field()
    @IsNumber()
    @Min(0)
    totalAmount: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    couponCode?: string;
}
