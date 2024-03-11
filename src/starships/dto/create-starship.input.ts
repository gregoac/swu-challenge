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
  @Field(_ => Int)
  cargoCapacity: number;

  @IsNotEmpty()
  @Field(_ => PointTypeInput)
  currentLocation: Point;
}
