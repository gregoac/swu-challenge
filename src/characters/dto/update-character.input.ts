import { CreateCharacterInput } from './create-character.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateCharacterInput extends PartialType(CreateCharacterInput) {
  @IsNotEmpty()
  @Field()
  name: string;
}
