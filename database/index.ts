import { env } from "@/lib/env";
import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";

let connection: SQL;

if (process.env.NODE_ENV === "production") {
  connection = new SQL(env.DATABASE_URL);
} else {
  const globalConnection = global as typeof globalThis & {
    connection: SQL;
  };

  if (!globalConnection.connection) {
    globalConnection.connection = new SQL(env.DATABASE_URL);
  }

  connection = globalConnection.connection;
}

export const db = drizzle(connection, {});
