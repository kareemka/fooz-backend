import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';

export enum MediaType {
    IMAGE = 'IMAGE',
    GLB = 'GLB',
}

registerEnumType(MediaType, {
    name: 'MediaType',
});

@ObjectType()
export class Media {
    @Field(() => ID)
    id: string;

    @Field()
    url: string;

    @Field()
    name: string;

    @Field()
    path: string;

    @Field(() => MediaType)
    type: MediaType;

    @Field(() => Int)
    size: number;

    @Field()
    createdAt: Date;
}

@ObjectType()
export class PaginatedMedia {
    @Field(() => [Media])
    items: Media[];

    @Field(() => Int)
    total: number;
}
