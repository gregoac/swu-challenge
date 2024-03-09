import { Module } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { PlanetsResolver } from './planets.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planet } from './entities/planet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Planet
    ])
  ],
  providers: [PlanetsResolver, PlanetsService],
  exports: [PlanetsService]
})
export class PlanetsModule {}
