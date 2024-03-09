import { Injectable } from '@nestjs/common';
import { CreateStarshipInput } from './dto/create-starship.input';
import { UpdateStarshipInput } from './dto/update-starship.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Starship } from './entities/starship.entity';
import { Repository } from 'typeorm';
import { CharactersService } from 'src/characters/characters.service';

@Injectable()
export class StarshipsService {

  constructor(
    @InjectRepository(Starship) 
    private starshipRepository: Repository<Starship>,
    private characterService: CharactersService
  ){}

  async create(createStarshipInput: CreateStarshipInput): Promise<Starship> {
    const newStarship = this.starshipRepository.create(createStarshipInput)
    return this.starshipRepository.save(newStarship);
  }

  async findAll(): Promise<Starship[]> {
    return this.starshipRepository.find();
  }

  async findOne(name: string): Promise<Starship> {
    return this.starshipRepository.findOne({
      where: {
        name,
      }
    });
  }

  async update(name: string, updateStarshipInput: UpdateStarshipInput): Promise<Starship> {
    await this.starshipRepository.update(name, updateStarshipInput);
    return this.findOne(name);
  }

  async remove(name: string): Promise<Starship> {
    const deleted = await this.findOne(name);
    await this.starshipRepository.delete(name);
    return deleted;
  }

  async boardingCharacter(name: string, boardingCharacterName: string): Promise<Starship>{
    let character = await this.characterService.findOne(boardingCharacterName);
    if(character.currentLocation){
      character = await this.characterService.relocateOrRemoveCharacterFromPlanet(character.name)
    }
    const starship = await this.findOne(name);
    starship.passengers.push(character);
    return this.starshipRepository.save(starship);
  }

  async disembarkingCharacter(name: string, disembarkingCharacterName: string){
    const starship = await this.findOne(name);
    starship.passengers = starship.passengers.filter(passenger => passenger.name !== disembarkingCharacterName);
    return this.starshipRepository.save(starship);
  }
}
