import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

import { Roles as UserRoles } from '../shared/enums';
import { User } from '../user/user.entity';

export class DatabaseSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {
    const user = em.create(User, {
      username: 'user',
      email: 'user@example.com',
      password: '12345678',
    });
    em.persist(user);

    const admin = em.create(User, {
      username: 'admin',
      email: 'admin@example.com',
      password: '12345678',
      roles: [UserRoles.ROLE_ADMIN, UserRoles.ROLE_USER]
    });
    em.persist(admin);
  }

}
