import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const url = process.env.TURSO_DATABASE_URL?.trim().replace(/[\r\n]+/g, "") || "file:local.db";
const authToken = process.env.TURSO_AUTH_TOKEN?.trim().replace(/[\r\n]+/g, "") || undefined;

const client = createClient({
  url,
  authToken,
});


export const db = drizzle(client, { schema });

export function getDb() {
  return db;
}

