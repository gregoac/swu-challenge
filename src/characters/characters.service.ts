import { Injectable } from '@nestjs/common';
import { CreateCharacterInput } from './dto/create-character.input';
import { UpdateCharacterInput } from './dto/update-character.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from './entities/character.entity';
import { PlanetsService } from 'src/planets/planets.service';

@Injectable()
export class CharactersService {

  constructor(
    @InjectRepository(Character) 
    private characterRepository: Repository<Character>,
    private planetService: PlanetsService
  ){}

  async create(createCharacterInput: CreateCharacterInput): Promise<Character> {
    const newCharacter = this.characterRepository.create(createCharacterInput)
    return this.characterRepository.save(newCharacter);
  }

  async findAll(): Promise<Character[]> {
    return this.characterRepository.find();
  }

  async findOne(name: string): Promise<Character> {
    const result = await this.characterRepository.findOneOrFail({
      where: {
        name
      },
    },
    );
    return result;
  }

  async update(name: string, updateCharacterInput: UpdateCharacterInput): Promise<Character> {
    await this.characterRepository.update(name, updateCharacterInput);
    return this.findOne(name);
  }

  async remove(name: string): Promise<Character> {
    const deleted = await this.findOne(name);
    await this.characterRepository.delete(name);
    return deleted;
  }

  /*When invoked without the second parameter this function will remove the named character from its current
    planet if it has. Otherwise it will relocate it to the new targetPlanet unless the targetPlanet isn't
    found in which case it set the current_location of the character to `null`*/
  async relocateOrRemoveCharacterFromPlanet(name: string, targePlanet: string = ""): Promise<Character>{
    const planet = await this.planetService.findOne(targePlanet);
    await this.characterRepository.update(name, {current_location: planet})
    return this.findOne(name);
  }
}
