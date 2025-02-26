// src/db.ts
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import { Pool } from "pg";
import * as schema from "./schema";
import { config } from "dotenv";
if (process.env.NODE_ENV !== "production") {
  config({ path: ".env.local" });
}
// Define a global type to store the database client
type GlobalWithDB = typeof globalThis & {
  dbClient?: ReturnType<typeof drizzlePg> | ReturnType<typeof drizzleNeon>;
};

// Determine the environment
const isProduction = process.env.NODE_ENV === "production";

// Use a global variable to store the database client
const globalWithDB = global as GlobalWithDB;

// Initialize the database client if it doesn't exist
if (!globalWithDB.dbClient) {
  if (isProduction) {
    // Neon HTTP client for production
    neonConfig.fetchConnectionCache = true; // Enable connection pooling for Neon
    const neonSql = neon(process.env.DATABASE_URL!);
    globalWithDB.dbClient = drizzleNeon(neonSql, { schema });
  } else {
    // Local PostgreSQL client for development
    const localPool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    globalWithDB.dbClient = drizzlePg(localPool, { schema });
  }
}

// Export the database client
export const db = globalWithDB.dbClient;
