## How to run on local

### Prerequisites
- Node.js 18+
- Yarn
- Docker

### Installation

1. Install dependencies

```bash
yarn 
```

### Spin database and Run migrations
Please make sure you have docker installed and port `5432` is available
```bash
# assume you are in project root
cd ./docker
docker-compose up -d
cd ../
yarn migrate
```

if migration succeeds, you should see something like this
```bash
yarn run v1.22.22
$ yarn knex migrate:latest
$ /Users/apple/code/ab-testing/node_modules/.bin/knex migrate:latest
Using Postgres
Batch 1 run: 1 migrations
✨  Done in 0.82s.
```

### Run the development server

```bash
yarn dev
```

### Start sending events and monitoring
After the server is running, you can start sending events to the server.

1. Please go to the `http://localhost:3000/monitor` to see the real-time analysis result.
Fill in the start date, end date then click `Start monitoring`, You should see the analysis result is empty for now.

2. Start another terminal to run the following command to send events to the server
```bash
node ./scripts/sendEvents.ts
```

This script will send 10000 events to the server with concurrency 100.
3. Now you can see the analysis result in the monitor page.

## Clean up

```bash
# assume you are in project root
cd ./docker
docker compose down

# reset the database
yarn reset
```

## Start with docker-compose
To start the project with docker-compose, you need to build the docker image first
```sh
# build your image locally
docker buildx build --platform linux/arm64 --tag abconvert-v1 --file ./Dockerfile  --load .
```

After the image is built, you can start the project with docker-compose
```sh
cd ./docker
docker-compose up -d
```

If the server running successfully, you should see something like this
```sh
abconvert-pg-1  |
abconvert-pg-1  | PostgreSQL Database directory appears to contain a database; Skipping initialization
abconvert-pg-1  |
abconvert-pg-1  | 2024-10-14 16:56:09.137 UTC [1] LOG:  starting PostgreSQL 16.4 (Debian 16.4-1.pgdg120+2) on aarch64-unknown-linux-gnu, compiled by gcc (Debian 12.2.0-14) 12.2.0, 64-bit
abconvert-pg-1  | 2024-10-14 16:56:09.138 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
abconvert-pg-1  | 2024-10-14 16:56:09.138 UTC [1] LOG:  listening on IPv6 address "::", port 5432
abconvert-pg-1  | 2024-10-14 16:56:09.141 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
abconvert-pg-1  | 2024-10-14 16:56:09.145 UTC [29] LOG:  database system was shut down at 2024-10-14 16:56:05 UTC
abconvert-pg-1  | 2024-10-14 16:56:09.148 UTC [1] LOG:  database system is ready to accept connections
abconvert-1     | yarn run v1.22.19
abconvert-1     | $ yarn knex migrate:latest
abconvert-1     | $ /app/node_modules/.bin/knex migrate:latest
abconvert-1     | Using Postgres
abconvert-1     | Already up to date
abconvert-1     | Done in 0.49s.
abconvert-1     |   ▲ Next.js 14.2.13
abconvert-1     |   - Local:        http://localhost:3000
abconvert-1     |   - Network:      http://0.0.0.0:3000
abconvert-1     |
abconvert-1     |  ✓ Starting...
abconvert-1     |  ✓ Ready in 110ms
```

## Current version of the project
In this project, I create a simple AB testing platform which can accept a bunch of events without blocking users and analyze the result of the AB test.

The platform has three components
1. API server: responsible for analysis AB test logic and accepting events and storing it into a in-memory queue
2. Background jobs: responsible for dispatching events from the queue to database
3. Database: responsible for storing events and serving read queries

### Current Design
1. I use a in-memory queue to store events because it is easy to implement and it's just for a demo. In a real-world project, we should use a persistent storage like redis or something fast and reliable. I also abstract the queue to make it substitutable.
2. About the folder structure, I'm a fan of separation of concern. So I put all the logic into `src/server` and separate responsibilities into different folders.
 - `src/server/backgrounds`: a folder that contains all the background jobs
 - `src/server/repositories`: the files under this folder are responsible for communication with database
 - `src/server/models`: the abstraction layer of the database, contain lots of business logic inside.
    - `src/server/models/events`: the abstraction layer of the event, which contains two parts
      - `src/server/models/events/implementations`: the concrete implementation of the event
      - `src/server/models/events/base.ts`: the abstraction of the event
      - `src/server/models/events/factory.ts`: the factory that creates the event instance, so that the caller does not need to know the concrete implementation of the event
    The structure of `src/server/models/analysis` is similar to the `src/server/models/events`
 - `src/server/errors`: the custom error class
 - `src/server/knex`: the knex(which is a SQL query builder) configuration


### For the future design of this project
Please refer to the [DESIGN.md](./design.md)
