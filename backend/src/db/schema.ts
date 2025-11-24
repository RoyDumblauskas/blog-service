import { integer, uuid, pgTable, varchar, date } from "drizzle-orm/pg-core";

export const articles = pgTable("articles", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  date: date({ mode: "date" }).notNull(),
  text: varchar({ length: 9999 }).notNull()
});

