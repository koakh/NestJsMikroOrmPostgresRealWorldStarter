import { Migration } from '@mikro-orm/migrations';

export class Migration20230109172610 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "tag" ("id" serial primary key, "tag" varchar(255) not null);');

    this.addSql('create table "user" ("id" varchar(255) not null, "username" varchar(255) not null, "email" varchar(255) not null, "bio" varchar(255) not null, "image" varchar(255) not null, "password" varchar(255) not null, "roles" text[] not null default \'{user}\', constraint "user_pkey" primary key ("id"));');

    this.addSql('create table "article" ("id" varchar(255) not null, "slug" varchar(255) not null, "title" varchar(255) not null, "description" varchar(255) not null, "body" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "tag_list" text[] not null, "author_id" varchar(255) not null, "favorites_count" int not null, constraint "article_pkey" primary key ("id"));');

    this.addSql('create table "comment" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "body" varchar(255) not null, "article_id" varchar(255) not null, "author_id" varchar(255) not null, constraint "comment_pkey" primary key ("id"));');

    this.addSql('create table "user_favorites" ("user_id" varchar(255) not null, "article_id" varchar(255) not null, constraint "user_favorites_pkey" primary key ("user_id", "article_id"));');

    this.addSql('create table "user_to_follower" ("follower" varchar(255) not null, "following" varchar(255) not null, constraint "user_to_follower_pkey" primary key ("follower", "following"));');

    this.addSql('alter table "article" add constraint "article_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "comment" add constraint "comment_article_id_foreign" foreign key ("article_id") references "article" ("id") on update cascade;');
    this.addSql('alter table "comment" add constraint "comment_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "user_favorites" add constraint "user_favorites_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_favorites" add constraint "user_favorites_article_id_foreign" foreign key ("article_id") references "article" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "user_to_follower" add constraint "user_to_follower_follower_foreign" foreign key ("follower") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_to_follower" add constraint "user_to_follower_following_foreign" foreign key ("following") references "user" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "article" drop constraint "article_author_id_foreign";');

    this.addSql('alter table "comment" drop constraint "comment_author_id_foreign";');

    this.addSql('alter table "user_favorites" drop constraint "user_favorites_user_id_foreign";');

    this.addSql('alter table "user_to_follower" drop constraint "user_to_follower_follower_foreign";');

    this.addSql('alter table "user_to_follower" drop constraint "user_to_follower_following_foreign";');

    this.addSql('alter table "comment" drop constraint "comment_article_id_foreign";');

    this.addSql('alter table "user_favorites" drop constraint "user_favorites_article_id_foreign";');

    this.addSql('drop table if exists "tag" cascade;');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "article" cascade;');

    this.addSql('drop table if exists "comment" cascade;');

    this.addSql('drop table if exists "user_favorites" cascade;');

    this.addSql('drop table if exists "user_to_follower" cascade;');
  }

}
