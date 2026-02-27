import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateAccessoryInput {
    @Field()
    @IsString()
    name: string;

    @Field(() => Float)
    @IsNumber()
    price: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    image?: string;
}
