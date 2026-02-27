import { InputType, PartialType } from '@nestjs/graphql';
import { CreateAccessoryInput } from './create-accessory.input';

@InputType()
export class UpdateAccessoryInput extends PartialType(CreateAccessoryInput) { }
