import { defineConfig } from "drizzle-kit";

// Local runs read the console app's env file; CI/Vercel provide DATABASE_URL directly.
try {
  process.loadEnvFile(new URL("../../apps/console/.env.local", import.meta.url));
} catch {}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
