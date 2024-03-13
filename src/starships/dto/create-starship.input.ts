import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { Point } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { PointTypeInput } from '../../types';

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
  cargo_capacity: string;

  @IsNotEmpty()
  @Field(_ => PointTypeInput)
  current_location: Point;
}
