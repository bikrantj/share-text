import * as schema from "@/db/schema";
import {
  drizzle as drizzlePg,
  type NodePgDatabase,
} from "drizzle-orm/node-postgres";
import { migrate as migratePg } from "drizzle-orm/node-postgres/migrator";
import { type PgliteDatabase } from "drizzle-orm/pglite";
import { PHASE_PRODUCTION_BUILD } from "next/dist/shared/lib/constants";
import path from "node:path";
import { Client } from "pg";

let client: Client;
let drizzle: NodePgDatabase<typeof schema> | PgliteDatabase<typeof schema>;
const dbUrl = process.env.DATABASE_URL;
const isProduction = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;
const globalScope = globalThis as unknown as {
  client?: Client;
  drizzle?: NodePgDatabase<typeof schema> | PgliteDatabase<typeof schema>;
};

// **Production - Use Neon Database**
if (isProduction) {
  client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }, // Required for Neon
  });
  await client.connect();

  drizzle = drizzlePg(client, { schema });
  await migratePg(drizzle, {
    migrationsFolder: path.join(process.cwd(), "migrations"),
  });
} else {
  // **Development - Use Local Postgres, Remote Postgres, or PGlite**
  if (!globalScope.client) {
    if (dbUrl?.includes("localhost")) {
      globalScope.client = new Client({
        connectionString: dbUrl,
      });
      await globalScope.client.connect();
      globalScope.drizzle = drizzlePg(globalScope.client, { schema });
      await migratePg(globalScope.drizzle, {
        migrationsFolder: path.join(process.cwd(), "migrations"),
      });
    }
  }

  client = globalScope.client!;
  drizzle = globalScope.drizzle!;
}

export const db = drizzle;
