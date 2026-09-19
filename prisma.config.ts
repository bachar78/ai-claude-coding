import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Optional: point at a second Neon branch to use as the shadow database. When
// unset the CLI creates a temporary one itself. `env()` throws on a missing or
// empty value, so only pass it through when it actually holds a URL.
const shadowDatabaseUrl = process.env.SHADOW_DATABASE_URL
  ? env("SHADOW_DATABASE_URL")
  : undefined;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Direct (non-pooled) Neon URL — migrations must not go through the pooler.
    url: env("DIRECT_URL"),
    shadowDatabaseUrl,
  },
});
