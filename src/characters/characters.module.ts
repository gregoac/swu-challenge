import { Module } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CharactersResolver } from './characters.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from './entities/character.entity';
import { PlanetsModule } from '../planets/planets.module';

@Module({
  imports: [TypeOrmModule.forFeature([Character]), PlanetsModule],
  providers: [CharactersResolver, CharactersService],
  exports: [CharactersService]
})
export class CharactersModule {}
