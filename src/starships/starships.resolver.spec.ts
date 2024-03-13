import { Test, TestingModule } from '@nestjs/testing';
import { StarshipsResolver } from './starships.resolver';
import { StarshipsService } from './starships.service';
import { Repository } from 'typeorm';
import { Starship } from './entities/starship.entity';
import { Character } from '../characters/entities/character.entity';
import { Planet } from '../planets/entities/planet.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CharactersService } from '../characters/characters.service';
import { PlanetsService } from '../planets/planets.service';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

describe('StarshipsResolver', () => {
  let resolver: StarshipsResolver;
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
      providers: [StarshipsResolver, StarshipsService, {
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

    resolver = module.get<StarshipsResolver>(StarshipsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
