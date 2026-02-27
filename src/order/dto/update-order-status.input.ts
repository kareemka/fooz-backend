import { InputType, Field } from '@nestjs/graphql';
import { OrderStatus } from '../entities/order.entity';
import { IsString, IsEnum } from 'class-validator';

@InputType()
export class UpdateOrderStatusInput {
    @Field()
    @IsString()
    id: string;

    @Field(() => OrderStatus)
    @IsEnum(OrderStatus)
    status: OrderStatus;
}
