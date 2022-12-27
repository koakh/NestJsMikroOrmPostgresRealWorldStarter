import { MikroORM } from '@mikro-orm/core';
import { MikroOrmMiddleware } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import * as Joi from 'joi';
// watch for reorder imports here else we can't get bellow error
// Error: Please provide either 'type' or 'entity' attribute in PostEntity.author
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { TagModule } from './tag/tag.module';
import { AppController } from './app.controller';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        // TODO:
        // JWT_SECRET: Joi.string().required(),
        // JWT_EXPIRATION_TIME: Joi.string().required(),
        SHOULD_DEBUG_SQL: Joi.boolean(),
      }),
    }),
    DatabaseModule,
    // MikroOrmModule.forRoot(),
    ArticleModule,
    UserModule,
    ProfileModule,
    TagModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [],
})
export class AppModule implements NestModule, OnModuleInit {

  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up();
  }

  // for some reason the auth middlewares in profile and article modules are fired before the request context one,
  // so they would fail to access contextual EM. by registering the middleware directly in AppModule, we can get
  // around this issue
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MikroOrmMiddleware)
      .forRoutes('*');
  }

}
