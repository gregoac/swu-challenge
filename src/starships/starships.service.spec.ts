import { Test, TestingModule } from '@nestjs/testing';
import { StarshipsService } from './starships.service';
import { Starship } from './entities/starship.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Point, Repository } from 'typeorm';
import { PlanetsService } from '../planets/planets.service';
import { CharactersService } from '../characters/characters.service';
import { Character } from '../characters/entities/character.entity';
import { Planet } from '../planets/entities/planet.entity';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

describe('StarshipsService', () => {
  let service: StarshipsService;
  const starshipRepositoryMock: MockType<Repository<Starship>> = {
    delete: jest.fn(),
    save: jest.fn(),
    findOneOrFail: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    query: jest.fn(),
  };
  const characterRepositoryMock: MockType<Repository<Character>> = {
    save: jest.fn(),
    findOneOrFail: jest.fn(),
    find: jest.fn(),
  };
  const planetRepositoryMock: MockType<Repository<Planet>> = {
    save: jest.fn(),
    findOneOrFail: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StarshipsService, {
          provide: getRepositoryToken(Starship),
          useValue: starshipRepositoryMock,
        },
        CharactersService,
        {
          provide: getRepositoryToken(Character),
          useValue: characterRepositoryMock
        },
        PlanetsService,
        {
          provide: getRepositoryToken(Planet),
          useValue: planetRepositoryMock
        }
      ],
    }).compile();

    service = module.get<StarshipsService>(StarshipsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new starship', async () => {
      const starshipDTO = {
        name: "Starship Name",
        model: "Starship Model",
        cargo_capacity: "1000000",
        current_location: {
          type: "Point",
          coordinates: [122, 34]
        } as Point
      }
      starshipRepositoryMock.save.mockReturnValue(starshipDTO);
      const newStarship = await service.create(starshipDTO);
      expect(newStarship).toMatchObject(starshipDTO);
      expect(starshipRepositoryMock.save).toHaveBeenCalledWith(starshipDTO);
    });
  });

  describe('findAll', () => {
    it('should find all starships', async () => {
      const starships = [
        {
          name: "Starship Name",
          model: "Starship Model",
          cargo_capacity: "1000000",
          current_location: {
            type: "Point",
            coordinates: [122, 34]
          } as Point,
          passengers: [],
          enemies: []
        },
        {
          name: "Starship Name 2",
          model: "Starship Model",
          cargo_capacity: "1000000",
          current_location: {
            type: "Point",
            coordinates: [122, 34]
          } as Point,
          passengers: [],
          enemies: []
        }
      ];
      starshipRepositoryMock.find.mockReturnValue(starships);
      const foundCustomers = await service.findAll();
      expect(foundCustomers).toContainEqual({
        name: "Starship Name",
        model: "Starship Model",
        cargo_capacity: "1000000",
        current_location: {
          type: "Point",
          coordinates: [122, 34]
        } as Point,
        passengers: [],
        enemies: []
      });
      expect(starshipRepositoryMock.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a starship', async () => {
      const starship = {
        name: "Starship Name",
        model: "Starship Model",
        cargo_capacity: "1000000",
        current_location: {
          type: "Point",
          coordinates: [122, 34]
        } as Point,
        passengers: [],
        enemies: []
      };
      starshipRepositoryMock.findOneOrFail.mockReturnValue(starship);
      const foundStarship = await service.findOne(starship.name);
      expect(foundStarship).toMatchObject(starship);
      expect(starshipRepositoryMock.findOneOrFail).toHaveBeenCalledWith({ where: { name: starship.name }, relations: {passengers: true, enemies: true} });
    });
  });

  describe('update', () => {
    it('should update a starship and return it', async () => {
      const starship = {
        name: "Starship Name",
        model: "Starship Model",
        cargo_capacity: "1000000",
        current_location: {
          type: "Point",
          coordinates: [122, 34]
        } as Point,
        passengers: [],
        enemies: []
      };

      starshipRepositoryMock.update.mockReturnValue({ generatedMaps: [], raw: [], affected: 1 });
      const resultUpdateStarship = await service.update(starship.name, starship)
      // Assert
      expect(resultUpdateStarship).toMatchObject(starship)
      expect(starshipRepositoryMock.update).toHaveBeenCalledWith(starship.name, starship);

    })
  });

  describe('remove', () => {
    it('should delete starship and return it', async () => {
      const starship = {
        name: "Starship Name",
        model: "Starship Model",
        cargo_capacity: "1000000",
        current_location: {
          type: "Point",
          coordinates: [122, 34]
        } as Point,
        passengers: [],
        enemies: []
      };

      starshipRepositoryMock.delete.mockReturnValue({ raw: [], affected: 1 });

      //act
      const result = await service.remove(starship.name);

      expect(result).toEqual(starship);
      expect(starshipRepositoryMock.delete).toHaveBeenCalledWith(starship.name);
    });
  });

  describe('boardingCharacter', () => {
    it('should board character in starship', async () => {
      const characterName = "Character"
      const starshipName = "Starship"
      const character = {
        name: "Character",
        species: "Human",
        sensitivity_to_the_force: "High",
        current_location: null
      }
      const starship = {
        name: "Starship",
        model: "Starship Model",
        cargo_capacity: "1000000",
        current_location: {
          type: "Point",
          coordinates: [122, 34]
        } as Point,
        passengers: [],
        enemies: []
      };
      const starshipWithPassanger = {
        ...starship,
        passengers: [
          {...character}
        ]
      }

      characterRepositoryMock.findOneOrFail.mockReturnValue(character)
      starshipRepositoryMock.findOneOrFail.mockReturnValue(starship)
      starshipRepositoryMock.save.mockReturnValue(starshipWithPassanger)
      const resultStarship = await service.boardingCharacter(starshipName, characterName)
      expect(characterRepositoryMock.findOneOrFail).toHaveBeenCalledWith({ where: {name: characterName}})
      expect(starshipRepositoryMock.findOneOrFail).toHaveBeenCalledWith({ where: {name: starshipName}, relations: {passengers: true, enemies: true}})
      expect(starshipRepositoryMock.save).toHaveBeenCalledWith(starshipWithPassanger)
      expect(resultStarship).toMatchObject(starshipWithPassanger)
    })
  })

  describe('disembarkingCharacter', () => {
    it('should disembark character of starship', async () => {
      const characterName = "Character"
      const starshipName = "Starship"
      const character = {
        name: "Character",
        species: "Human",
        sensitivity_to_the_force: "High",
        current_location: null
      }
      const starship = {
        name: "Starship",
        model: "Starship Model",
        cargo_capacity: "1000000",
        current_location: {
          type: "Point",
          coordinates: [122, 34]
        } as Point,
        passengers: [],
        enemies: []
      };
      const starshipWithPassanger = {
        ...starship,
        passengers: [
          {...character}
        ]
      }

      starshipRepositoryMock.findOneOrFail.mockReturnValue(starshipWithPassanger)
      starshipRepositoryMock.save.mockReturnValue(starship)
      const resultStarship = await service.disembarkingCharacter(starshipName, characterName)
      expect(starshipRepositoryMock.findOneOrFail).toHaveBeenCalledWith({ where: {name: starshipName}, relations: {passengers: true, enemies: true}})
      expect(starshipRepositoryMock.save).toHaveBeenCalledWith(starship)
      expect(resultStarship).toMatchObject(starship)
    })
  })

  describe('travelToPlanet', () => {
    it('should navigate starship to planet location', async () => {
      const starship = {
        name: "Starship Name",
        model: "Starship Model",
        cargo_capacity: "1000000",
        current_location: {
          type: "Point",
          coordinates: [122, 34]
        } as Point,
        passengers: [],
        enemies: []
      };
      const planet = {
        name: "Planet Name",
        population: 1233,
        climate: "Climate",
        terrain: "Terrain",
        location: {
          type: "Point",
          coordinates: [125, 30]
        } as Point,
      }

      const starshipInPlanet = {...starship, current_location: {...planet.location}}

      starshipRepositoryMock.findOneOrFail.mockReturnValue(starship)
      planetRepositoryMock.findOneOrFail.mockReturnValue(planet)
      starshipRepositoryMock.save.mockReturnValue(starshipInPlanet)
      const starshipResult = await service.travelToPlanet(starship.name, planet.name);
      expect(planetRepositoryMock.findOneOrFail).toHaveBeenCalledWith({ where: {name: planet.name}})
      expect(starshipRepositoryMock.findOneOrFail).toHaveBeenCalledWith({ where: {name: starship.name}, relations: {passengers: true, enemies: true}})
      expect(starshipRepositoryMock.save).toHaveBeenCalledWith(starshipInPlanet)
      expect(starshipResult).toMatchObject(starshipInPlanet)
    })
  })

  describe('calculateDistanceToPlanet', () => {
    it('should calculate and return a string with the distance between the given starship and planet', async () => {
      const starship = {
        name: "Starship Name",
        model: "Starship Model",
        cargo_capacity: "1000000",
        current_location: {
          type: "Point",
          coordinates: [122, 34]
        } as Point,
        passengers: [],
        enemies: []
      };
      const planet = {
        name: "Planet Name",
        population: 1233,
        climate: "Climate",
        terrain: "Terrain",
        location: {
          type: "Point",
          coordinates: [125, 30]
        } as Point,
      }

      const st_distance = [
        {
          st_distance: 123
        }
      ]

      starshipRepositoryMock.findOneOrFail.mockReturnValue(starship)
      planetRepositoryMock.findOneOrFail.mockReturnValue(planet)
      starshipRepositoryMock.query.mockReturnValue(st_distance)
      const distanceText = await service.calculateDistanceToPlanet(starship.name, planet.name);
      expect(planetRepositoryMock.findOneOrFail).toHaveBeenCalledWith({ where: {name: planet.name}})
      expect(starshipRepositoryMock.findOneOrFail).toHaveBeenCalledWith({ where: {name: starship.name}, relations: {passengers: true, enemies: true}})
      expect(distanceText).toMatch(`The distance between ${starship.name} starship and ${planet.name} planet is: ${(st_distance[0].st_distance / 1000).toFixed(2)} km`)
    })
  })

  describe('searchForNearByEnemies', () => {
    it('should return an array of enemies starships', async () => {
      const starship = {
        name: "Starship Name",
        model: "Starship Model",
        cargo_capacity: "1000000",
        current_location: {
          type: "Point",
          coordinates: [122, 34]
        } as Point,
        enemies: [
          {
            name: "Starship 2",
            model: "Starship Model",
            cargo_capacity: "1000000",
            current_location: {
              type: "Point",
              coordinates: [123, 36]
            } as Point,
          }
        ]
      };

      const starshipsNearBy = [
        {name: "Starship 1"},
        {name: "Starship 2"}
      ]

      starshipRepositoryMock.findOneOrFail.mockReturnValue(starship)
      starshipRepositoryMock.query.mockReturnValue(starshipsNearBy)
      const enemies = await service.searchForNearByEnemies(starship.name)
      expect(starshipRepositoryMock.findOneOrFail).toHaveBeenCalledWith({where: {name: starship.name}, relations: {enemies: true}})
      expect(enemies).toMatchObject(starship.enemies)
    })
  })

  describe('spawnRandomEnemy', () => {
    it('should create a random enemy', async () => {
      const starships = [
        {
          name: "Starship Nameasd",
          model: "Starship Model",
          cargo_capacity: "1000000",
          current_location: {
            type: "Point",
            coordinates: [122, 34]
          } as Point,
          passengers: [],
          enemies: []
        },
        {
          name: "Starship Name sdfsdf",
          model: "Starship Model",
          cargo_capacity: "1000000",
          current_location: {
            type: "Point",
            coordinates: [122, 34]
          } as Point,
          passengers: [],
          enemies: []
        }
      ];

      starshipRepositoryMock.find.mockReturnValue(starships)
      const result = await service.spawnRandomEnemy();
      expect(starshipRepositoryMock.find).toHaveBeenCalledWith({
        relations: {
          passengers: true,
          enemies: true
        }
      })
      expect(starshipRepositoryMock.save).toHaveBeenCalledWith(result)
    })
  })

  describe('declareEnemey', () => {
    it('should declare an enemy for a given starship', async () => {

      const starship = {
        name: "Starship Name",
        model: "Starship Model",
        cargo_capacity: "1000000",
        current_location: {
          type: "Point",
          coordinates: [122, 34]
        } as Point,
        enemies: []
      };

      const enemyStarship = {
        name: "Enemy Starship Name",
        model: "Starship Model",
        cargo_capacity: "1000000",
        current_location: {
          type: "Point",
          coordinates: [123, 32]
        } as Point,
      };

      const starshipWithEnemy = {
        ...starship, enemies: [
          {...enemyStarship}
        ]
      }

      starshipRepositoryMock.find
      .mockReturnValueOnce(starship)
      .mockReturnValueOnce(enemyStarship)
      starshipRepositoryMock.save.mockReturnValue(starshipWithEnemy)

      const result = await service.declareEnemy(starship.name, enemyStarship.name);

      expect(starshipRepositoryMock.find).toHaveBeenCalledTimes(2);
      expect(result).toMatchObject(starshipWithEnemy);

    })
  })
  
});
