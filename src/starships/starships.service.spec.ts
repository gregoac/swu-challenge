import { Test, TestingModule } from '@nestjs/testing';
import { StarshipsService } from './starships.service';

describe('StarshipsService', () => {
  let service: StarshipsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StarshipsService],
    }).compile();

    service = module.get<StarshipsService>(StarshipsService);
  });

  // describe('findAll', () => {
  //   it('should return an array of starships', async () => {
  //     const result = ['test']
  //     jest.spyOn(service, 'findAll').mockImplementation(() => result)
  //     expect(service).toBeDefined();
  //   });
  // })
  
});
