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
