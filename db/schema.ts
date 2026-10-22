import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const inboxes = sqliteTable("inboxes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  handle: text("handle").notNull().unique(),
  inboxKeyHash: text("inbox_key_hash").notNull(),
  createdAt: text("created_at").notNull(),
});

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  recipientHandle: text("recipient_handle")
    .notNull()
    .references(() => inboxes.handle, { onDelete: "cascade" }),
  body: text("body").notNull(),
  theme: text("theme").notNull().default("light"),
  createdAt: text("created_at").notNull(),
});
