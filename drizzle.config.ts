import { defineConfig } from "drizzle-kit";

if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {}
}


export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL?.trim().replace(/[\r\n]+/g, "") || "file:local.db",
    authToken: process.env.TURSO_AUTH_TOKEN?.trim().replace(/[\r\n]+/g, "") || undefined,
  },
});


