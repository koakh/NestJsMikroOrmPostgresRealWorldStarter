# NOTES

- [Using MikroORM with NestJS framework | MikroORM](https://mikro-orm.io/docs/usage-with-nestjs)
- [GitHub - mikro-orm/c3-customers-backend: Example real world backend API built with NestJS + MikroORM](https://github.com/mikro-orm/c3-customers-backend)

## Init Project

```shell
$ curl -fsSL https://get.pnpm.io/install.sh | sh -
$ cp src/config.ts.example src/config.ts
$ cp src/mikro-orm.config.ts.example src/mikro-orm.config.ts
$ pnpm i
$ pnpm remove @mikro-orm/mysql
$ pnpm install @mikro-orm/postgresql
```

## Replace all Project

`@mikro-orm/mysql` with `@mikro-orm/postgresql`

## Postgres

```shell
$ mv docker-compose.yml docker-compose-mysql.yml
$ code docker-compose-mysql.yml
```

add `docker-compose.yml` content

## Configure MikroOrm to use Postgres

`src/mikro-orm.config.ts`

## Recreate Migrations and Stack Up

> NOTE: if have problem run app and problems with migrations, like stalled migrations, delele `dist/migrations` or whole `dist/` folder, se it in `src/mikro-orm.config.ts`

clean up db and removed stalled migrations, and stack up, same as `tearDown` script

```shell
$ docker-compose down --volumes --remove-orphans && docker-compose up -d
$ rm dist/ -R
$ rm src/migrations -R
```

```shell
$ npx mikro-orm migration:create
Migration20221226154247.ts successfully created
# create migrations
$ Migration20221226125500.ts successfully created
```

## Seed Database

- [Seeding | MikroORM](https://mikro-orm.io/docs/seeding)
- [Seeding | MikroORM](https://mikro-orm.io/docs/seeding#use-with-cli)

```shell
# create DatabaseSeeder
$ npx mikro-orm seeder:create DatabaseSeeder
```

get code from `database/seeder/test.seeder.ts` ex

`src/seeders/DatabaseSeeder.ts`

```ts
import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { User } from '../user/user.entity';

export class DatabaseSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {
    const author = em.create(User, {
      username: 'John Snow',
      email: 'snow@wall.st',
      password: 'snow@wall.st',
      bio: '',
      image: ''
    });
    em.persist(author);
  }

}
```

```shell
# will drop the database, run all migrations and the DatabaseSeeder class
$ npx mikro-orm migration:fresh --seed
# outcome
Dropped schema successfully
Processing 'Migration20221226154247'
Applied 'Migration20221226154247'
Successfully migrated up to the latest version
Database seeded successfully with seeder class DatabaseSeeder
```

## Start application

```shell
# win2
$ pnpm run start:debug
# outcome
...
[Nest] 3048  - 12/26/2022, 3:44:08 PM     LOG [MikroORM] [query] insert into "public"."mikro_orm_migrations" ("name") values ('Migration20221226154247') [took 1 ms]
[Nest] 3048  - 12/26/2022, 3:44:08 PM     LOG [MikroORM] Applied 'Migration20221226154247'
[Nest] 3048  - 12/26/2022, 3:44:08 PM     LOG [MikroORM] [query] commit
[Nest] 3048  - 12/26/2022, 3:44:08 PM     LOG [NestApplication] Nest application successfully started +19ms
```

Test api by browsing to <http://localhost:3000/api/articles>
View automatically generated swagger api docs by browsing to <http://localhost:3000/docs>
Run e2e tests from the gothinkster/realworld repository with `pnpm run test:e2e`

## Login

get credentials from `database/seeder/test.seeder.ts` or `src/seeders/DatabaseSeeder.ts`

```shell
$ curl -s --request POST \
  --url http://127.0.0.1:3000/api/users/login \
  --header 'content-type: application/json' \
  --data '{"user": {"email": "snow@wall.st","password": "snow@wall.st"}}' | jq
# outcome
{
  "user": {
    "email": "snow@wall.st",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNub3dAd2FsbC5zdCIsImV4cCI6MTY3NzI1NDkxMC44MTcsImlkIjoxLCJ1c2VybmFtZSI6IkpvaG4gU25vdyIsImlhdCI6MTY3MjA3MDkxMH0.P-OgNxcCiTJIg_3XYuVJWMJ1f6pjkUNx2N0ydxTb-tA",
    "username": "John Snow",
    "bio": "",
    "image": ""
  }
}
```

## Build and Run Image

uncomment `c3-customers-backend` service on `docker-compose.yml`

## Problems

### [ExceptionHandler] Please provide either 'type' or 'entity' attribute in Comment.article

- [How to resolve "Please provide either 'type' or 'entity' attribute in EntityName.id" error when creating migration in MikroORM?](https://stackoverflow.com/a/68931143)

This works for me - put type attribute to each column. ex `@ManyToMany(() => Category)`

```ts
  // KO
  @ManyToMany({ hidden: true })
  favorites = new Collection<Article>(this);

  // OK
  @ManyToMany({ entity: () => Article, hidden: true })
  favorites = new Collection<Article>(this);
```

### Docker Image

- [@mikro-orm/core/typings.js:54 Unexpected token ? Unexpected token ?](https://github.com/mikro-orm/mikro-orm/discussions/2952)

```shell
# error
/usr/src/app/node_modules/.pnpm/@mikro-orm+core@5.6.2_othgpucmobiy5h3lsinwgo7vla/node_modules/@mikro-orm/core/typings.js:57
        this.root ?? (this.root = this);
```

- Upgrade your node version, and dont ignore warnings you get when you install things, as this is validated on npm level.
- I have updated my node to 17. It is working perfectly well now. Thanks

```shell
$ node dist/main
/usr/src/app/node_modules/@mikro-orm/core/typings.js:57
        this.root ?? (this.root = this);

$ node -v
v12.13.1
```

> now docker image works without issues