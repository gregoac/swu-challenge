import { Module } from '@nestjs/common';
import { StarshipsService } from './starships.service';
import { StarshipsResolver } from './starships.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Starship } from './entities/starship.entity';
import { CharactersModule } from '../characters/characters.module';
import { PlanetsModule } from '../planets/planets.module';

@Module({
  imports: [TypeOrmModule.forFeature([Starship]), CharactersModule, PlanetsModule],
  providers: [StarshipsResolver, StarshipsService],
  // exports: [StarshipsService]
})
export class StarshipsModule {}
