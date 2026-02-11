import { Field, ID, InputType, Int, ObjectType, PartialType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ObjectType()
export class Color {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    image?: string;
}

@InputType()
export class CreateColorInput {
    @Field()
    @IsString()
    name: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    image?: string;
}

@InputType()
export class UpdateColorInput extends PartialType(CreateColorInput) { }
@ObjectType()
export class PaginatedColors {
    @Field(() => [Color])
    items: Color[];

    @Field(() => Int)
    total: number;
}
