import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateFaqInput } from './create-faq.input';

@InputType()
export class UpdateFaqInput extends PartialType(CreateFaqInput) {
    @Field()
    id: string;
}
