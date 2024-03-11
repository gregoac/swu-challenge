import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn, Point, Geography } from 'typeorm';
import { PointType } from 'src/types';

@Entity()
@ObjectType()
export class Planet {
  @PrimaryColumn({unique: true})
  @Field()
  name: string;

  @Column()
  @Field(_ => Int)
  population: number;

  @Column()
  @Field()
  climate: string;

  @Column()
  @Field()
  terrain: string;

  /* LON/LAT */
  @Column({
    type: "geography",
    spatialFeatureType: "point",
    srid: 4326,
  })
  @Field(_ => PointType)
  location: Point
}