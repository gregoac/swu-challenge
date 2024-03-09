import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { CoordinatesInput } from 'src/types';

@InputType()
export class CreatePlanetInput {
  @MaxLength(50)
  @IsNotEmpty()
  @Field()
  name: string;

  @IsNotEmpty()
  @Field(type => Int)
  population: number;

  @MaxLength(50)
  @IsNotEmpty()
  @Field()
  climate: string;

  @MaxLength(50)
  @IsNotEmpty()
  @Field()
  terrain: string;

  @IsNotEmpty()
  @Field(_ => CoordinatesInput)
  coordinates: CoordinatesInput;
}
