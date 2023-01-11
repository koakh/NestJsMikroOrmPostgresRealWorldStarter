import { ArrayType, Collection, Entity, EntityDTO, EntityRepositoryType, Enum, ManyToMany, OneToMany, PrimaryKey, Property, wrap } from '@mikro-orm/core';
import { Logger } from '@nestjs/common';
import { IsEmail } from 'class-validator';
import crypto from 'crypto';
import { v4 } from 'uuid';

import { Article } from '../article/article.entity';
import { UserRepository } from './user.repository';

export enum Role {
  User = 'user',
  Admin = 'admin',
}

@Entity({ customRepository: () => UserRepository })
export class User {

  [EntityRepositoryType]?: UserRepository;

  @PrimaryKey()
  id: string = v4();

  @Property()
  username: string;

  @Property({ hidden: true })
  @IsEmail()
  email: string;

  @Property()
  bio = '';

  @Property()
  image = '';

  @Property({ hidden: true })
  password: string;

  @ManyToMany({ entity: () => Article, hidden: true })
  favorites = new Collection<Article>(this);

  @ManyToMany({ entity: () => User, inversedBy: u => u.followed, owner: true, pivotTable: 'user_to_follower', joinColumn: 'follower', inverseJoinColumn: 'following', hidden: true })
  followers = new Collection<User>(this);

  @ManyToMany(() => User, u => u.followers, { hidden: true })
  followed = new Collection<User>(this);

  @OneToMany(() => Article, article => article.author, { hidden: true })
  articles = new Collection<Article>(this);

  @Property({ type: ArrayType })
  @Enum({ default: [Role.User] })
  roles: Role[] = [Role.User, Role.Admin];

  constructor(username: string, email: string, password: string, roles?: Role[]) {
    this.username = username;
    this.email = email;
    this.password = crypto.createHmac('sha256', password).digest('hex');
    this.roles = roles ? roles : [Role.User];
    // this.roles = [Role.User, Role.Admin];
    // this.roles.push(Role.User);
    // this.roles.push(Role.Admin);
    // // tag.books.add()
    // Logger.log(JSON.stringify(this, undefined, 2), User.name);
  }

  toJSON(user?: User) {
    const o = wrap<User>(this).toObject() as UserDTO;
    // else default to no image
    o.image = this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg';
    o.following = user && user.followers.isInitialized() ? user.followers.contains(this) : false;

    return o;
  }

}

interface UserDTO extends EntityDTO<User> {
  following?: boolean;
}
