import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

import { User } from '../user/user.entity';
import { Article } from './article.entity';

@Entity()
export class Comment {

  @PrimaryKey()
  id: string = v4();

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property()
  body: string;

  @ManyToOne({ entity: () => Article })
  article: Article;

  @ManyToOne({ entity: () => User })
  author: User;

  constructor(author: User, article: Article, body: string) {
    this.author = author;
    this.article = article;
    this.body = body;
  }

}
