import { Injectable } from '@nestjs/common';
import { CreatePlanetInput } from './dto/create-planet.input';
import { UpdatePlanetInput } from './dto/update-planet.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Planet } from './entities/planet.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlanetsService {

  constructor(@InjectRepository(Planet) private planetRepository: Repository<Planet>){}

  async create(createPlanetInput: CreatePlanetInput): Promise<Planet> {
    const newPlanet = this.planetRepository.create(createPlanetInput)
    return this.planetRepository.save(newPlanet);
  }

  async findAll(): Promise<Planet[]> {
    return this.planetRepository.find();
  }

  async findOne(name: string): Promise<Planet> {
    return this.planetRepository.findOne({
      where: {
        name,
      }
    });
  }

  async update(name: string, updatePlanetInput: UpdatePlanetInput): Promise<Planet> {
    await this.planetRepository.update(name, updatePlanetInput);
    return this.findOne(name);
  }

  async remove(name: string): Promise<Planet> {
    const deleted = await this.findOne(name);
    await this.planetRepository.delete(name);
    return deleted;
  }
}
