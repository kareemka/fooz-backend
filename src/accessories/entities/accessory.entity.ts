import { ObjectType, Field, Float, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Accessory {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field(() => Float)
    price: number;

    @Field({ nullable: true })
    image?: string;
}
@ObjectType()
export class PaginatedAccessories {
    @Field(() => [Accessory])
    items: Accessory[];

    @Field(() => Int)
    total: number;
}
