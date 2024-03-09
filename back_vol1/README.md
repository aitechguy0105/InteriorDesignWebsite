## Blog-Backend-REST-API-NestJS-Prisma

A simple backend REST API for a blog built using NestJS, Prisma, PostgreSQL and Swagger.

### Installation

1. Install dependencies: `npm install`
2. Start a PostgreSQL database with docker using: `docker-compose up -d`.
   - If you have a local instance of PostgreSQL running, you can skip this step. In this case, you will need to change the `DATABASE_URL` inside the `.env` file with a valid [PostgreSQL connection string](https://www.prisma.io/docs/concepts/database-connectors/postgresql#connection-details) for your database.
3. Apply database migrations: `npx prisma migrate dev` `npx prisma db seed`
4. Start the project: `npm run start:dev`
5. Access the project at http://localhost:3000/api

Stable defaulsion API Reference
https://stablediffusionapi.com/docs/stable-diffusion-api/img2img

{ "prompt": "interior room design fashion furniture bed room", "negative_prompt": "((out of frame)), ((extra fingers)), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((naked)), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, (((skinny))), glitchy, ((extra breasts)), ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), ((missing breasts)), (missing lips), ((ugly face)), ((fat)), ((extra legs)), anime", "guidance": 7.5, "init_image": "https://pub-8b49af329fae499aa563997f5d4068a4.r2.dev/generations/1588816411682820860.png", "safety_checker": "yes", "width": "512", "height": "512", "samples": "3", "steps": 20, "seed": 0, "strength": 0.7, "webhook": null, "track_id": null }
