import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, Point, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm';
import { Character } from 'src/characters/entities/character.entity';
import { PointType } from 'src/types';

@Entity()
@ObjectType()
export class Starship {
  @PrimaryColumn({unique: true})
  @Field()
  name: string;

  @Column()
  @Field()
  model: string;

  @Column()
  @Field(_ => Int)
  cargoCapacity: number;

  @Column({
    type: 'geography',
    spatialFeatureType: 'point',
    srid: 4326,
  })
  @Field(_ => PointType)
  currentLocation: Point;

  @OneToMany(_ => Character, character => character.starship, {nullable: true, eager: true})
  @Field(_ => [Character], {nullable: true})
  passengers?: Character[];

  @ManyToMany(() => Starship, starship => starship.enemies, {nullable: true})
  @Field(_ => [Starship], {nullable: true})
  enemies?: Starship[]; 

}
