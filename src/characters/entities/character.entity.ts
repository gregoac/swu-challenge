import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Planet } from 'src/planets/entities/planet.entity';
import { Starship } from 'src/starships/entities/starship.entity';
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
  sensitivityToTheForce: string;

  @ManyToOne(_ => Planet, planet => planet.name, {onDelete: "CASCADE", nullable: true, eager: true})
  @Field(_ => Planet, {nullable: true})
  currentLocation?: Planet;
  
  @ManyToOne(_ => Starship, starship => starship.passengers, {onDelete: "CASCADE", nullable: true})
  @Field(_ => Starship, {nullable: true})
  starship?: Starship;

}
