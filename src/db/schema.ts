import {
  pgTable,
  text,
  integer,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const codes = pgTable("codes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  code: varchar("code", { length: 4 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const texts = pgTable("texts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  content: text("content").notNull(),
  codeId: integer("code_id")
    .notNull()
    .references(() => codes.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Code = typeof codes.$inferSelect;
export type Text = typeof texts.$inferSelect;
