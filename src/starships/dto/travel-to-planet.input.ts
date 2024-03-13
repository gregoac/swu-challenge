import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class StarshipAndPlanetInput {
  @IsNotEmpty()
  @Field({description: 'Starship name'})
  name: string;

  @IsNotEmpty()
  @Field({description: 'Planet from which we want to know the distance'})
  targePlanetName: string;
}