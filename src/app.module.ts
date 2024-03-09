import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlanetsModule } from './planets/planets.module';
import { CharactersModule } from './characters/characters.module';
import { StarshipsModule } from './starships/starships.module';


@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
        driver: ApolloDriver,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'swu',
      password: 'VxtsXQvr4e1wC1Sn',
      database: 'swu',
      autoLoadEntities: true,
      synchronize: true,
    }),
    PlanetsModule,  
    StarshipsModule,
    CharactersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
