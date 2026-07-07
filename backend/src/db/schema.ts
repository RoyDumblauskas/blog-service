import {
  timestamp,
  uuid,
  pgTable,
  pgEnum,
  jsonb,
  varchar,
  integer,
  bigint,
  unique,
  boolean,
  smallint,
  check,
  foreignKey
} from "drizzle-orm/pg-core";
import { sql, defineRelations } from "drizzle-orm";

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
  article_status: articleStatusEnum().notNull().default("draft"),
  author_id: uuid().notNull().references(() => users.id, { onDelete: "cascade" }),
  slug: varchar({ length: 511 }).unique().notNull(),
  summary: varchar({ length: 255 }).notNull(),

  date_created: timestamp({ mode: "date", withTimezone: true }).defaultNow().notNull(),
  last_edit: timestamp({ mode: "date", withTimezone: true }).defaultNow().notNull(),
  date_published: timestamp({ mode: "date", withTimezone: true }),

  previous_article: uuid(),
  next_article: uuid()
},
  (table) => [
    unique("no_repeat_slugs_per_author")
      .on(table.author_id, table.slug),

    foreignKey({
      name: "next_article_ref_id",
      columns: [table.next_article],
      foreignColumns: [table.id]
    }),

    foreignKey({
      name: "previous_article_ref_id",
      columns: [table.previous_article],
      foreignColumns: [table.id]
    })
  ]);

export const articleBlocks = pgTable("article_blocks", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  article_id: uuid().notNull().references(() => articles.id, { onDelete: "cascade" }),

  position: integer().notNull(),
  type: blockTypeEnum().notNull(),
  content: jsonb().$type<Record<string, unknown>>().notNull(),

},
  (table) => [{
    postPositionIdx: unique("no_repeat_block_position_per_article")
      .on(table.article_id, table.position)
  }]);

export const images = pgTable("images", {
  id: uuid().notNull().primaryKey().defaultRandom(), // Linked in 'content' of articleBlock with type 'image'
  bucket: varchar({ length: 63 }).notNull(),
  key: varchar({ length: 255 }).notNull(),
  mime_type: varchar({ length: 63 }).notNull(),
  height: integer().notNull(),
  width: integer().notNull(),
  bytes: bigint({ mode: "number" }).notNull(),
});

export const users = pgTable("users", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  display_name: varchar({ length: 63 }).unique().notNull(),

  username: varchar({ length: 63 }).unique().notNull(),
  hashed_password: varchar({ length: 255 }).notNull(),
  logged_in: boolean().notNull().default(false),

  refresh_token: varchar({ length: 511 }),
  permissions: smallint().notNull().default(44),
},
  (_) => [
    check("permissions lower bound", sql`users.permissions >= 0`),
    check("permissions upper bound", sql`users.permissions <= 77`),
  ]
);

export const relations = defineRelations({ articles, articleBlocks, users }, (r) => ({
  articles: {
    blocks: r.many.articleBlocks()
  },
  articleBlocks: {
    article: r.one.articles({
      from: r.articleBlocks.article_id,
      to: r.articles.id
    })
  }
}));
