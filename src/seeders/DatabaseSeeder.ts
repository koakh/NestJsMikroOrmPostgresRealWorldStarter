import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

import { Role, User } from '../user/user.entity';

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
      roles: [Role.User, Role.Admin]
    });
    em.persist(admin);
  }

}
