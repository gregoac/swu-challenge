import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Planet } from '../../planets/entities/planet.entity';
import { Starship } from '../../starships/entities/starship.entity';
import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Character {
  @PrimaryColumn({unique: true})
  @Field()
  name: string;

  @Column()
  @Field()
  species: string;

  @Column()
  @Field()
  sensitivity_to_the_force: string;

  @ManyToOne(_ => Planet, planet => planet.name, {onDelete: "CASCADE", nullable: true, eager: true})
  @Field(_ => Planet, {nullable: true})
  current_location?: Planet;
  
  @ManyToOne(_ => Starship, starship => starship.passengers, {onDelete: "CASCADE", nullable: true})
  starship?: Starship;

}
