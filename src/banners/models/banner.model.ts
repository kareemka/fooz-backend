import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Banner {
    @Field(() => ID)
    id: string;

    @Field({ nullable: true })
    title?: string;

    @Field()
    image: string;

    @Field({ nullable: true })
    link?: string;

    @Field(() => Int)
    order: number;

    @Field()
    isActive: boolean;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
