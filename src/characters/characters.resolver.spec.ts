import { Test, TestingModule } from '@nestjs/testing';
import { CharactersResolver } from './characters.resolver';
import { CharactersService } from './characters.service';

describe('CharactersResolver', () => {
  let resolver: CharactersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CharactersResolver, CharactersService],
    }).compile();

    resolver = module.get<CharactersResolver>(CharactersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
