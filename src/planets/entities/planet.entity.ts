import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Coordinates } from 'src/types';

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

  @Column({type: 'json'})
  @Field(_ => Coordinates)
  coordinates: {
    latitude: number,
    longitude: number,
  }
}