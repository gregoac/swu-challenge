import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateCharacterInput {
  @IsNotEmpty()
  @Field()
  name: string;

  @IsNotEmpty()
  @Field()
  species: string;

  @IsNotEmpty()
  @Field()
  sensitivity_to_the_force: string;
}
