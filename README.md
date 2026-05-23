# Football

Football is a match prediction app for running a football pool. Users can register, sign in, predict match scores, follow their points, inspect other players and teams, and compare results. Admin users can create games, close games, enter final results, and manage the match schedule.

## Project Structure

- `frontend-vue/` - current Vue 3 frontend built with Vite, TypeScript, Pinia, PrimeVue, and Vue Router.
- `backend-spring/` - Spring Boot API backed by JPA and PostgreSQL.
- `frontend/` - legacy React frontend kept in the repository for reference.
- `deployment/` - example backend service files and nginx configuration.
- `backup.sql` and `statistics.sql` - database helper SQL files.

## Main Features

- Authentication: register, sign in, sign out, and protected routes.
- Games: upcoming matches grouped by date, score predictions, and match details.
- Personal page: current user guesses, previous games, and points.
- Results: standings table with player navigation.
- Player and team pages: historical guesses and match results.
- Admin panel: create/edit games, filter by state, close games, and submit final scores.
- Responsive layout with desktop side navigation and mobile drawer navigation.

## Tech Stack

Frontend:

- Vue 3
- Vite
- TypeScript
- Pinia
- PrimeVue
- Vue I18n
- Matter.js for the small interactive football in navigation

Backend:

- Java 16
- Spring Boot 2.5
- Spring Web
- Spring Security
- Spring Data JPA
- PostgreSQL
- H2 runtime dependency for local/dev alternatives

## Prerequisites

- Node.js and npm
- Java 16
- Maven, or use the included Maven wrapper
- PostgreSQL running locally

The default backend configuration expects this database:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/football
spring.datasource.username=football_user
spring.datasource.password=football_password
```

## Run Locally

Start the backend:

```sh
cd backend-spring
./mvnw spring-boot:run
```

The API runs on `http://localhost:8080`.

Start the current frontend:

```sh
cd frontend-vue
npm install
npm run dev
```

The Vite dev server proxies `/api` requests to `http://localhost:8080`.

## Run With Docker

Start the full stack with PostgreSQL:

```sh
docker compose up --build
```

The Vue app is available at `http://localhost:3000`, and the backend API is available at `http://localhost:8080`.

PostgreSQL data is stored in the `postgres-data` Docker volume. To stop the stack and remove the database volume:

```sh
docker compose down -v
```

To run two isolated instances, use different Compose project names and host ports:

```sh
COMPOSE_PROJECT_NAME=football1 FRONTEND_PORT=3000 BACKEND_PORT=8080 POSTGRES_PORT=5432 docker compose up -d --build
COMPOSE_PROJECT_NAME=football2 FRONTEND_PORT=3001 BACKEND_PORT=8081 POSTGRES_PORT=5433 docker compose up -d --build
```

The second instance will be available at `http://localhost:3001`. Each project gets its own containers, network, and `postgres-data` volume.

## Frontend Commands

Run from `frontend-vue/`:

```sh
npm run dev      # start Vite dev server
npm run build    # type-check and build for production
npm run lint     # run ESLint
npm run preview  # preview the production build
```

## Backend Commands

Run from `backend-spring/`:

```sh
./mvnw spring-boot:run  # start the API
./mvnw test             # run backend tests
./mvnw package          # build the backend jar
```

## API Areas

The backend exposes endpoints under `/api`, including:

- `/api/auth` - login and registration
- `/api/games` - match schedule and admin game management
- `/api/guesses` - user score predictions
- `/api/points` - personal and total points
- `/api/results` - standings and closed/finished match results
- `/api/teams` - team data and team-specific games
- `/api/users` - player profile data
- `/api/version` - API version check

## Notes

- `frontend-vue/` is the active frontend. The older `frontend/` React app is not the primary UI.
- Frontend routing is handled client-side; production hosting should serve the Vue app fallback for non-API routes.
- The backend uses `spring.jpa.hibernate.ddl-auto=update`, so schema changes are applied automatically in local development.
