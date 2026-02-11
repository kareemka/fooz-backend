import { InputType, Field, Int } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateFaqInput {
    @Field()
    @IsString()
    question: string;

    @Field()
    @IsString()
    answer: string;

    @Field(() => Int, { defaultValue: 0 })
    @IsOptional()
    @IsNumber()
    order?: number;

    @Field({ defaultValue: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
