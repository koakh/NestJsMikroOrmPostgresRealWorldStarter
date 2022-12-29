import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UserModule } from '../user/user.module';
import { TagController } from './tag.controller';
import { Tag } from './tag.entity';
import { TagService } from './tag.service';

@Module({
  controllers: [
    TagController,
  ],
  exports: [],
  imports: [MikroOrmModule.forFeature({ entities: [Tag] }), UserModule],
  providers: [TagService],
})
export class TagModule { }
