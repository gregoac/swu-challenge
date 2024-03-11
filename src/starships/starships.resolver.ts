import { Resolver, Query, Mutation, Args} from '@nestjs/graphql';
import { StarshipsService } from './starships.service';
import { Starship } from './entities/starship.entity';
import { CreateStarshipInput } from './dto/create-starship.input';
import { UpdateStarshipInput } from './dto/update-starship.input';
import { StarshipAndPlanetInput } from './dto/travel-to-planet.input';
import { BoardingOrDisembarkingCharacterInput } from './dto/boarding-disembarking-character.input';
import { DeclareEnemyInput } from './dto/declare-enemy.input';

@Resolver(_ => Starship)
export class StarshipsResolver {
  constructor(private readonly starshipsService: StarshipsService) {}

  @Mutation(_ => Starship)
  createStarship(
    @Args('createStarshipInput') createStarshipInput: CreateStarshipInput,
  ) {
    return this.starshipsService.create(createStarshipInput);
  }

  @Query(_ => [Starship], { name: 'starships' })
  findAll() {
    return this.starshipsService.findAll();
  }

  @Query(_ => Starship, { name: 'starship' })
  findOne(@Args('name') name: string) {
    return this.starshipsService.findOne(name);
  }

  @Query(_ => String)
  calcultateDistanceToPlanet(@Args('starshipAndPlanetTargetName') starshipAndPlanetTargetName: StarshipAndPlanetInput){
    return this.starshipsService.calculateDistanceToPlanet(starshipAndPlanetTargetName.name, starshipAndPlanetTargetName.targePlanetName);
  }

  @Query(_ => [Starship])
  searchForNearByEnemies(@Args('name') name: string){
    return this.starshipsService.searchForNearByEnemies(name);
  }

  @Mutation(_ => Starship)
  updateStarship(
    @Args('updateStarshipInput') updateStarshipInput: UpdateStarshipInput,
  ) {
    return this.starshipsService.update(
      updateStarshipInput.name,
      updateStarshipInput,
    );
  }

  @Mutation(_ => Starship)
  removeStarship(@Args('name') name: string) {
    return this.starshipsService.remove(name);
  }

  @Mutation(_ => Starship)
  boardingCharacter(@Args('boardingCharacterInput') boardingCharacterInput: BoardingOrDisembarkingCharacterInput){
    return this.starshipsService.boardingCharacter(boardingCharacterInput.name, boardingCharacterInput.characterName);
  }

  @Mutation(_ => Starship)
  disembarkingCharacter(@Args('disembarkingCharacterInput') disembarkingCharacterInput: BoardingOrDisembarkingCharacterInput){
    return this.starshipsService.disembarkingCharacter(disembarkingCharacterInput.name, disembarkingCharacterInput.characterName);
  }

  @Mutation(_ => Starship)
  travelToPlanet(@Args('StarshipAndPlanetInput') StarshipAndPlanetInput: StarshipAndPlanetInput){
    return this.starshipsService.travelToPlanet(StarshipAndPlanetInput.name, StarshipAndPlanetInput.targePlanetName)
  }

  @Mutation(_ => Starship)
  async spawnRandomEnemy(){
    try {
      return this.starshipsService.spawnRandomEnemy();
    } catch(e){
      return e
    }
  }

  @Mutation(_ => Starship)
  declareEnemy(@Args("declareEnemyInput") declareEnemyInput: DeclareEnemyInput){
    return this.starshipsService.declareEnemy(declareEnemyInput.name, declareEnemyInput.enemyName);
  } 
}
