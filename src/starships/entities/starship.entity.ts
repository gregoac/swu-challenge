import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm';
import { Coordinates } from 'src/types';
import { Character } from 'src/characters/entities/character.entity';

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

  @Column({type: 'json'})
  @Field(_ => Coordinates)
  currentLocation: Coordinates;

  @OneToMany(_ => Character, character => character.starship, {nullable: true, eager: true})
  @Field(_ => [Character], {nullable: true})
  passengers?: Character[];

  @ManyToMany(() => Starship, starship => starship.enemies, {nullable: true})
  @Field(_ => [Starship], {nullable: true})
  enemies?: Starship[]; 

}
