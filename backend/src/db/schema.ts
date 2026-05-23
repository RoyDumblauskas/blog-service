import {
  timestamp,
  uuid,
  pgTable,
  pgEnum,
  jsonb,
  varchar,
  integer,
  bigint,
  uniqueIndex,
  index,
  boolean,
  smallint,
  check
} from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";

export const blockTypeEnum = pgEnum("post_block_type", [
  "title",
  "paragraph",
  "heading",
  "image",
  "code",
  "quote",
  "ordered_list",
  "unordered_list"
]);

export const articleStatusEnum = pgEnum("post_status", [
  "draft",
  "published"
]);

export const articles = pgTable("articles", {
  id: uuid().notNull().primaryKey().defaultRandom(),

  name: varchar({ length: 255 }).notNull(),
  article_status: articleStatusEnum().default("draft"),
  author_id: uuid().notNull(),
  slug: varchar({ length: 511 }).unique().notNull(),
  summary: varchar({ length: 255 }).notNull(),

  date_created: timestamp({ mode: "date", withTimezone: true }).defaultNow().notNull(),
  last_edit: timestamp({ mode: "date", withTimezone: true }).defaultNow().notNull(),
  date_published: timestamp({ mode: "date", withTimezone: true }),
});

export const articleBlocks = pgTable("article_blocks", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  article_id: uuid().notNull().references(() => articles.id, { onDelete: "cascade" }),

  position: integer().notNull(),
  type: blockTypeEnum().notNull(),
  content: jsonb().$type<Record<string, unknown>>().notNull(),

},
  (table) => [{
    postPositionIdx: uniqueIndex("article_blocks_article_position_idx")
      .on(table.article_id, table.position),

    postIdx: index("article_blocks_article_id_idx")
      .on(table.article_id),
  }]);

export const images = pgTable("images", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  bucket: varchar({ length: 63 }).notNull(),
  key: varchar({ length: 255 }).notNull(),
  mime_type: varchar({ length: 63 }).notNull(),
  height: integer().notNull(),
  width: integer().notNull(),
  bytes: bigint({ mode: "number" }).notNull(),

});

export const users = pgTable("users", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  display_name: varchar({ length: 63 }).notNull(),

  username: varchar({ length: 63 }).notNull(),
  hashed_password: varchar({ length: 255 }).notNull(),
  logged_in: boolean().notNull().default(false),

  token: varchar({ length: 511 }),
  permissions: smallint().notNull().default(44),
},
  (users) => [
    check("permissions lower bound", sql`users.permissions >= 0`),
    check("permissions upper bound", sql`users.permissions <= 77`),
  ]
);

export const articlesRelations = relations(articles, ({ many }) => ({
  blocks: many(articleBlocks),
}));

export const articleBlocksRelations = relations(articleBlocks, ({ one }) => ({
  article: one(articles, {
    fields: [articleBlocks.article_id],
    references: [articles.id],
  }),
}));
