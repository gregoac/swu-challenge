import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, Point, ManyToMany, OneToMany, JoinTable, PrimaryColumn } from 'typeorm';
import { Character } from '../../characters/entities/character.entity';
import { PointType } from '../../types';

@Entity()
@ObjectType()
export class Starship {
  @PrimaryColumn({unique: true})
  @Field()
  name: string;

  @Column()
  @Field()
  model: string;

  @Column({type: "bigint", nullable: true})
  @Field({nullable: true})
  cargo_capacity: string | null;
  
  /* LON/LAT */
  @Column({
    type: "geography",
    spatialFeatureType: "point",
    srid: 4326,
  })
  @Field(_ => PointType)
  current_location: Point;

  @OneToMany(_ => Character, character => character.starship, {nullable: true})
  @Field(_ => [Character], {nullable: true})
  passengers?: Character[];

  @ManyToMany(() => Starship, {nullable: true, cascade: true})
  @JoinTable()
  @Field(_ => [Starship], {nullable: true})
  enemies?: Starship[]

}
