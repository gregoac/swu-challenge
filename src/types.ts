import { ObjectType, Field, Float, InputType } from "@nestjs/graphql";

// @ObjectType()
// export class Coordinates {
//   @Field(type => Float)
//   lat: number;
//   @Field(type => Float)
//   lon: number;
// }

@ObjectType()
export class PointType {
  @Field()
  type: string;
  @Field(_ => [Float])
  coordinates: number[]
}

// @InputType()
// export class CoordinatesInput {
//   @Field(_ => Float)
//   lat: number;

//   @Field(_ => Float)
//   lon: number;
// }

@InputType()
export class PointTypeInput {
  @Field()
  type: string;
  @Field(_ => [Float])
  coordinates: number[]
}