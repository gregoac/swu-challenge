# Project Overview

This project is a NestJS based web application that simulates the Star Wars universe, providing CRUD operations for Characters, Planets and Starships among other functionalities using GraphQL transport layer. The project also uses PostgreSQL extension PostGIS for GPS-like capabilities and features unit tests.

## Technical Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **TypeScript Version:** 5.1.3
- **ORM**: [TypeORM](https://typeorm.io/)
- **Transport Layer**: [GraphQL](https://graphql.org/)
- **Database System**: [PostgreSQL](https://www.postgresql.org/)

## Setup

1. Install PostgreSQL and the PostGIS extension. To do so, follow these steps: https://postgis.net/workshops/postgis-intro/installation.html.
2. Create a spatial database. To do so, follow these steps: https://postgis.net/workshops/postgis-intro/creating_db.html.
3. After pulling the project, run `npm install` to install necessary dependencies.
4. Make a copy of `.env.example` as `.env` and place your environmental variables that will set your database and port configuration. 
5. Run `npm run start` to start the project.
6. Go to the page `/graphql` to access the query interface.
7. Run `npm run test` to run the unit tests.

## Functionalities

- **CRUD operations:** Available for all entities.
- **Move characters and starships through planets:** You could relocate a character or a starship in a planet just giving the character or starship and planet name.
- **Calculate distances:** Using PostGIS GPS-like capabilites you could calculate the distance between a starship and a planet by giving the starship and planet name.
- **Search for enemy starships within a range:** Using PostGIS GPS-like capabilites you could search for near by declared enemies of a starship by giving the starship name.
- **Board or disembark characters:** You could board or disembark a character from a starship by giving the character and starship name.
- **Spawn random starship:** You could spawn a random starship in the universe.
- **Declare enemy starship:** You could declare a starship to be enemy of another starship by giving their names.
- Each planet and starship has its coordinates represented by the Geography type Point and it could accept other shapes in the future.
- The tests are only available for the Starships service and resolver for now. 

### Database Schema

#### Characters Table

| Field                      | Type          | Modifiers             |
|----------------------------|---------------|-----------------------|
| name                       | VARCHAR       | PRIMARY KEY, UNIQUE   |
| species                    | VARCHAR       |                       |
| sensitivity_to_the_force   | VARCHAR       |                       |
| currentLocationName        | VARCHAR       | NULLABLE              |
| starshipName               | VARCHAR       | NULLABLE              |

#### Planets Table

| Field                      | Type          | Modifiers             |
|----------------------------|---------------|-----------------------|
| name                       | VARCHAR       | PRIMARY KEY, UNIQUE   |
| population                 | INT           |                       |
| climate                    | VARCHAR       |                       |
| terrain                    | VARCHAR       |                       |
| location                   | GEOGRAPHY     | UNIQUE                |

#### Starships Table

| Field                      | Type          | Modifiers             |
|----------------------------|---------------|-----------------------|
| name                       | VARCHAR       | PRIMARY KEY, UNIQUE   |
| model                      | VARCHAR       |                       |
| current_location           | GEOGRAPHY     | UNIQUE                |
| cargo_capacity             | BIGINT        |                       |

#### Starships Enemies Table

| Field                      | Type          | Modifiers             |
|----------------------------|---------------|-----------------------|
| starshipName_1             | VARCHAR       | PRIMARY KEY           |
| starshipName_2             | VARCHAR       | PRIMARY KEY           |

---

Happy coding!

