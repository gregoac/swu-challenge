import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { Point } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { PointTypeInput } from 'src/types';

@InputType()
export class CreateStarshipInput {
  @IsNotEmpty()
  @Field()
  name: string;

  @IsNotEmpty()
  @Field()
  model: string;

  @IsNotEmpty()
  @Field()
  cargoCapacity: string;

  @IsNotEmpty()
  @Field(_ => PointTypeInput)
  currentLocation: Point;
}
