import { migrate } from "drizzle-orm/bun-sql/migrator";
import { db } from "@/database";
import path from "node:path";

async function run() {
  console.log("Running migrations...");
  await migrate(db, {
    migrationsFolder: path.join(process.cwd(), "database/migrations"),
  });
  console.log("Migrations done!");
}

run().catch((error) => {
  console.error(error, "MIGRATION_FAILED");
  process.exit(1);
});
