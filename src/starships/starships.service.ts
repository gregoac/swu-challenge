import { Injectable } from '@nestjs/common';
import { CreateStarshipInput } from './dto/create-starship.input';
import { UpdateStarshipInput } from './dto/update-starship.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Starship } from './entities/starship.entity';
import { Point, Repository } from 'typeorm';
import { CharactersService } from 'src/characters/characters.service';
import { PlanetsService } from 'src/planets/planets.service';
import { PointType, PointTypeInput } from 'src/types';

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

  async disembarkingCharacter(name: string, disembarkingCharacterName: string): Promise<Starship>{
    const starship = await this.findOne(name);
    starship.passengers = starship.passengers.filter(passenger => passenger.name !== disembarkingCharacterName);
    return this.starshipRepository.save(starship);
  }

  async travelToPlanet(name: string, targetPlanetName: string): Promise<Starship>{
    const starship = await this.findOne(name);
    const targetPlanet = await this.planetService.findOne(targetPlanetName)
    starship.currentLocation = targetPlanet.location
    return this.starshipRepository.save(starship);
  }

  async calculateDistanceToPlanet(name: string, targetName: string): Promise<string>{
    const starship = await this.findOne(name);
    const targePlanet = await this.planetService.findOne(targetName);
    // const starshipCoordinates = starship.currentLocation.coordinates.join(" ")
    // const targePlanetCoordinates = targePlanet.location.coordinates.join(" ");
    const distanceInMeters = await this.starshipRepository.query(
      `SELECT ST_Distance(
        'SRID=4326;POINT(${starship.currentLocation.coordinates.join(" ")})'::geography,
        'SRID=4326;POINT(${targePlanet.location.coordinates.join(" ")})'::geography);`
    )
    return `The distance between ${name} starship and ${targetName} planet is: ${(distanceInMeters[0].st_distance / 1000).toFixed(2)} km`;
  }

  async searchForNearByEnemies(name: string): Promise<Starship[]>{
    const starship = await this.findOne(name);
    const starshipCoordinates = starship.currentLocation.coordinates.join(" ")
    const nearByStarships = await this.starshipRepository.query(
      `SELECT "name", "model", "cargoCapacity", ST_AsText("currentLocation") as "currentLocation"
      FROM starship
      WHERE ST_DWithin("currentLocation", 'POINT(${starshipCoordinates})', 80000.0)`
    )

    const enemies = nearByStarships.filter(starshipNearBy => starshipNearBy.name !== name)

    enemies.map(enemyNearBy => {
      const numbersArray = enemyNearBy.currentLocation.match(/-?\d+(\.\d+)?/g)
      const numbers = numbersArray.map(Number);
      enemyNearBy.currentLocation = {
        type: "Point",
        coordinates: numbers
      }
    })

    return enemies;
  }

  async spawnRandomEnemy(url: string = 'https://swapi.py4e.com/api/starships?page=4'){

      
      const liveStarships: Starship[] = await this.findAll();
      const res = await fetch(`${url}`)
      const starshipsJson = await res.json()
      const starships = starshipsJson.results

      for(let i = 0; i < starships.length; i++){
        const newStarship = starships[i]
        const foundStarshipWithThatName = this.findObjectByProperty(liveStarships, 'name', newStarship.name)
        if(!foundStarshipWithThatName){
          if(!this.isConvertibleToNumber(newStarship.cargo_capacity)){
            newStarship.cargo_capacity = null
          }
          return this.create({name: newStarship.name as string, model: newStarship.model as string, cargoCapacity: newStarship.cargo_capacity as string, currentLocation: {type: "Point", coordinates: this.getRandomLongitudeAndLatitude()} as Point})
        }
      }

      if(!starshipsJson.next){
        throw new Error('Cannot create a new random starship - Out of data');
      } else {
        return this.spawnRandomEnemy(starshipsJson.next);
      }
  }

  findObjectByProperty(array: Starship[], property: string, value: string) {
    return array.find(obj => obj[property] === value);
  }

  getRandomLongitudeAndLatitude() {
    const minLongitude = -180;
    const maxLongitude = 180;
    const minLatitude = -90;
    const maxLatitude = 90;
    
    const randomLongitude = Math.random() * (maxLongitude - minLongitude) + minLongitude;
    const randomLatitude = Math.random() * (maxLatitude - minLatitude) + minLatitude;
    return [randomLongitude, randomLatitude];
  }

  isConvertibleToNumber(value: string): boolean {
    // Try parsing the string as a number
    const parsedValue = parseFloat(value);
    // Check if the parsed value is not NaN
    return !isNaN(parsedValue);
  }
}
