import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { CoordinatesInput } from 'src/types';

@InputType()
export class CreateStarshipInput {
  @IsNotEmpty()
  @Field()
  name: string;

  @IsNotEmpty()
  @Field()
  model: string;

  @IsNotEmpty()
  @Field(_ => Int)
  cargoCapacity: number;

  @IsNotEmpty()
  @Field(_ => CoordinatesInput)
  currentLocation: CoordinatesInput;
}
