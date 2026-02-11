import { InputType, Field, Int } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateBannerInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    title?: string;

    @Field()
    @IsString()
    image: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    link?: string;

    @Field(() => Int, { defaultValue: 0 })
    @IsOptional()
    @IsNumber()
    order?: number;

    @Field({ defaultValue: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
