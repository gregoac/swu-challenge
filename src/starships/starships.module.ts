import { Module } from '@nestjs/common';
import { StarshipsService } from './starships.service';
import { StarshipsResolver } from './starships.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Starship } from './entities/starship.entity';
import { CharactersModule } from 'src/characters/characters.module';

@Module({
  imports: [TypeOrmModule.forFeature([Starship]), CharactersModule],
  providers: [StarshipsResolver, StarshipsService],
  // exports: [StarshipsService]
})
export class StarshipsModule {}
