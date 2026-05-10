import { pgTable, integer, varchar, timestamp, text, pgEnum } from 'drizzle-orm/pg-core';

export const rolesEnum = pgEnum("roles", ["user", "admin"]);

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar().notNull().unique(),
  password: varchar().notNull(),
  role: rolesEnum().default("user").notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const spaces = pgTable('spaces', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  creatorId: integer('creator_id').references(() => users.id).notNull(),
  guestId: integer('guest_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const posts = pgTable('posts', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar().notNull(),
  body: text(),
  creatorId: integer('creator_id').references(() => users.id).notNull(),
  spaceId: integer('space_id').references(() => spaces.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const comments = pgTable('comments', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  body: text().notNull(),
  creatorId: integer('creator_id').references(() => users.id).notNull(),
  postId: integer('post_id').references(() => posts.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})