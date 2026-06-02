import path from "node:path";
import { migrate } from "drizzle-orm/bun-sql/migrator";
import { db } from "@/database";

export async function run() {
  console.log("Running migrations...");
  await migrate(db, {
    migrationsFolder: path.join(process.cwd(), "database/migrations"),
  });
  console.log("Migrations done!");
}
