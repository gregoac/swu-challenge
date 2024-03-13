import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { CharactersService } from './characters.service';
import { Character } from './entities/character.entity';
import { CreateCharacterInput } from './dto/create-character.input';
import { UpdateCharacterInput } from './dto/update-character.input';
import { RelocateCharacterInput } from './dto/relocate-character.input';

@Resolver(_ => Character)
export class CharactersResolver {
  constructor(private readonly charactersService: CharactersService) {}

  @Mutation(_ => Character)
  createCharacter(
    @Args('createCharacterInput') createCharacterInput: CreateCharacterInput,
  ): Promise<Character> {
    return this.charactersService.create(createCharacterInput);
  }

  @Query(_ => [Character], { name: 'characters' })
  findAll() {
    return this.charactersService.findAll();
  }

  @Query(_ => Character, { name: 'character' })
  findOne(@Args('name') name: string) {
    return this.charactersService.findOne(name);
  }

  @Mutation(_ => Character)
  updateCharacter(
    @Args('updateCharacterInput') updateCharacterInput: UpdateCharacterInput,
  ) {
    return this.charactersService.update(
      updateCharacterInput.name,
      updateCharacterInput,
    );
  }

  @Mutation(_ => Character)
  removeCharacter(@Args('name') name: string) {
    return this.charactersService.remove(name);
  }

  @Mutation(_ => Character, {name: 'relocateCharacterToPlanet'})
  relocateCharacter(@Args('relocateCharacterInput') relocateCharacterInput: RelocateCharacterInput){
    return this.charactersService.relocateOrRemoveCharacterFromPlanet(relocateCharacterInput.name, relocateCharacterInput.targePlanet)
  }

}
