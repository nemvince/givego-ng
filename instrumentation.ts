export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { run: migrate } = await import("@/database/migrate");
    const { run: seed } = await import("@/database/seed");

    await migrate();
    await seed();
  }
}
