import { Resolver, Query, Mutation, Args, Parent, ResolveField } from '@nestjs/graphql';
import { StarshipsService } from './starships.service';
import { Starship } from './entities/starship.entity';
import { CreateStarshipInput } from './dto/create-starship.input';
import { UpdateStarshipInput } from './dto/update-starship.input';
import { BoardingOrDisembarkingCharacterInput } from './dto/boarding-disembarking-character.input';

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
}
