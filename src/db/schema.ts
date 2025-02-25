import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const textTable = pgTable("text", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  text: varchar("text").notNull(),
  key: varchar("key", { length: 6 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
