import { Field, ID, InputType, ObjectType, registerEnumType, Float } from '@nestjs/graphql';
import { DiscountType } from '@prisma/client';
import { IsString, IsNumber, IsEnum, IsBoolean, IsDate, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

registerEnumType(DiscountType, {
    name: 'DiscountType',
});

@ObjectType()
export class Coupon {
    @Field(() => ID)
    id: string;

    @Field()
    code: string;

    @Field(() => DiscountType)
    discountType: DiscountType;

    @Field(() => Float)
    discountValue: number;

    @Field({ nullable: true })
    expiryDate?: Date;

    @Field(() => Float, { nullable: true })
    minOrderAmount?: number;

    @Field()
    isActive: boolean;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

@ObjectType()
export class PaginatedCoupons {
    @Field(() => [Coupon])
    items: Coupon[];

    @Field()
    total: number;
}

@ObjectType()
export class CouponValidationResult {
    @Field()
    isValid: boolean;

    @Field({ nullable: true })
    discountAmount?: number;

    @Field({ nullable: true })
    message?: string;
}

@InputType()
export class CreateCouponInput {
    @Field()
    @IsString()
    code: string;

    @Field(() => DiscountType)
    @IsEnum(DiscountType)
    discountType: DiscountType;

    @Field(() => Float)
    @IsNumber()
    @Min(0)
    discountValue: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    expiryDate?: Date;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    @Min(0)
    minOrderAmount?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

@InputType()
export class UpdateCouponInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    code?: string;

    @Field(() => DiscountType, { nullable: true })
    @IsOptional()
    @IsEnum(DiscountType)
    discountType?: DiscountType;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    @Min(0)
    discountValue?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsDate()
    expiryDate?: Date;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    @Min(0)
    minOrderAmount?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
