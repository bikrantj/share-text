import { drizzle } from "drizzle-orm/neon-http"; // For Neon (production)
import { Client } from "pg"; // For local Postgres (development)
import { drizzle as drizzleLocal } from "drizzle-orm/node-postgres"; // For local Postgres (development)

let db;

if (process.env.NODE_ENV === "production") {
  // Use Neon in production
  db = drizzle(process.env.DATABASE_URL!);
} else {
  // Use local Postgres in development
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect(); // Connect to the local Postgres instance
  db = drizzleLocal(client);
}

export { db };
