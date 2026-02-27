import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Faq {
    @Field(() => ID)
    id: string;

    @Field()
    question: string;

    @Field()
    answer: string;

    @Field(() => Int)
    order: number;

    @Field()
    isActive: boolean;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

@ObjectType()
export class PaginatedFaqs {
    @Field(() => [Faq])
    items: Faq[];

    @Field(() => Int)
    total: number;
}
