import { ObjectType, Field, Int, InputType } from "@nestjs/graphql";

@ObjectType()
export class Coordinates {
  @Field(type => Int)
  latitude: number;
  @Field(type => Int)
  longitude: number;
}

@InputType()
export class CoordinatesInput {
  @Field(_ => Int)
  latitude: number;

  @Field(_ => Int)
  longitude: number;
}