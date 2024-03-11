import { Injectable } from '@nestjs/common';
import { CreateStarshipInput } from './dto/create-starship.input';
import { UpdateStarshipInput } from './dto/update-starship.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Starship } from './entities/starship.entity';
import { Point, Repository } from 'typeorm';
import { CharactersService } from 'src/characters/characters.service';
import { PlanetsService } from 'src/planets/planets.service';
import { isConvertibleToNumber, findObjectByProperty, getRandomLongitudeAndLatitude } from 'src/utils';

@Injectable()
export class StarshipsService {

  constructor(
    @InjectRepository(Starship) 
    private starshipRepository: Repository<Starship>,
    private characterService: CharactersService,
    private planetService: PlanetsService
  ){}

  async create(createStarshipInput: CreateStarshipInput): Promise<Starship> {
    const newStarship = this.starshipRepository.create(createStarshipInput)
    return this.starshipRepository.save(newStarship);
  }

  async findAll(): Promise<Starship[]> {
    return this.starshipRepository.find({
      relations: {
        passengers: true,
        enemies: true
      }
    });
  }

  async findOne(name: string): Promise<Starship> {
    return this.starshipRepository.findOne({
      where: {
        name,
      },
      relations: {
        passengers: true,
        enemies: true
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
    if(character.current_location){
      character = await this.characterService.relocateOrRemoveCharacterFromPlanet(character.name)
    }
    const starship = await this.findOne(name);
    starship.passengers.push(character);
    return this.starshipRepository.save(starship);
  }

  async disembarkingCharacter(name: string, disembarkingCharacterName: string): Promise<Starship>{
    const starship = await this.findOne(name);
    starship.passengers = starship.passengers.filter(passenger => passenger.name !== disembarkingCharacterName);
    return this.starshipRepository.save(starship);
  }

  async travelToPlanet(name: string, targetPlanetName: string): Promise<Starship>{
    const starship = await this.findOne(name);
    const targetPlanet = await this.planetService.findOne(targetPlanetName)
    starship.current_location = targetPlanet.location
    return this.starshipRepository.save(starship);
  }

  async calculateDistanceToPlanet(name: string, targetName: string): Promise<string>{
    const starship = await this.findOne(name);
    const targePlanet = await this.planetService.findOne(targetName);
    const distanceInMeters = await this.starshipRepository.query(
      `SELECT ST_Distance(
        'SRID=4326;POINT(${starship.current_location.coordinates.join(" ")})'::geography,
        'SRID=4326;POINT(${targePlanet.location.coordinates.join(" ")})'::geography);`
    )
    return `The distance between ${name} starship and ${targetName} planet is: ${(distanceInMeters[0].st_distance / 1000).toFixed(2)} km`;
  }

  async searchForNearByEnemies(name: string)/*: Promise<Starship[]>*/{
    const starship = await this.findOne(name);
    const starshipCoordinates = starship.current_location.coordinates.join(" ")
    const nearByStarships = await this.starshipRepository.query(
      `SELECT "name", "model", "cargo_capacity", ST_AsText("current_location") as "current_location"
      FROM starship
      WHERE ST_DWithin("current_location", 'POINT(${starshipCoordinates})', 100000000.0)`
    )

    const nearByStarshipWithoutOwn = nearByStarships.filter(nearByStarship => nearByStarship.name !== name);

    const enemies = [];

    // Loop through the first array
    starship.enemies.forEach(enemy => {
        // Find matching object in the second array based on 'name'
        const matchingEnemy = nearByStarshipWithoutOwn.find(nearByStarship => nearByStarship.name === enemy.name);

        if (matchingEnemy) {
          enemies.push(matchingEnemy);
        }
    });

    enemies.map(enemyNearBy => {
      const numbersArray = enemyNearBy.current_location.match(/-?\d+(\.\d+)?/g)
      const numbers = numbersArray.map(Number);
      enemyNearBy.current_location = {
        type: "Point",
        coordinates: numbers
      }
    })

    return enemies;
  }

  async spawnRandomEnemy(url: string = 'https://swapi.py4e.com/api/starships'){

    const liveStarships: Starship[] = await this.findAll();
    const res = await fetch(`${url}`)
    const starshipsJson = await res.json()
    const starships = starshipsJson.results

    for(let i = 0; i < starships.length; i++){
      const newStarship = starships[i]
      const foundStarshipWithThatName = findObjectByProperty<Starship>(liveStarships, 'name', newStarship.name)
      if(!foundStarshipWithThatName){
        if(!isConvertibleToNumber(newStarship.cargo_capacity)){
          newStarship.cargo_capacity = null
        }
        return this.create({name: newStarship.name as string, model: newStarship.model as string, cargo_capacity: newStarship.cargo_capacity as string, current_location: {type: "Point", coordinates: getRandomLongitudeAndLatitude()} as Point})
      }
    }

    if(!starshipsJson.next){
      throw new Error('Cannot create a new random starship - Out of data');
    } else {
      return this.spawnRandomEnemy(starshipsJson.next);
    }
  }

  async declareEnemy(name: string, enemyName: string){
    const starship = await this.starshipRepository.findOne({
      where: {
        name
      },
      relations: {
        enemies: true
      }
    });
    const enemyStarship = await this.starshipRepository.findOne({
      where: {
        name: enemyName
      }
    })
    starship.enemies.push(enemyStarship);
    return this.starshipRepository.save(starship);
  }
}
