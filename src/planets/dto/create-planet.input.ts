import { InputType, Int, Float, Field } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { PointTypeInput } from 'src/types';
import { Point } from 'typeorm';

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
  @Field(_ => PointTypeInput)
  location: Point;
}
