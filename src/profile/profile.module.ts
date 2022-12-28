import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { AuthMiddleware } from '~src/user/auth.middleware';
import { User } from '~src/user/user.entity';
import { UserModule } from '~src/user/user.module';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  controllers: [
    ProfileController,
  ],
  exports: [],
  imports: [MikroOrmModule.forFeature({ entities: [User] }), UserModule],
  providers: [ProfileService],
})
export class ProfileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'profiles/:username/follow', method: RequestMethod.ALL });
  }
}
