/**
 * Connection smoke test — run with `npm run db:test`.
 *
 * Exercises the same runtime path the app uses (src/lib/db.ts → pooled
 * DATABASE_URL). Next.js loads .env on its own, but this runs under plain tsx,
 * so dotenv must be imported *before* db.ts builds its adapter.
 */
import "dotenv/config";
import { prisma } from "../src/lib/db";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set — copy .env.example to .env.");
  }

  const { host } = new URL(process.env.DATABASE_URL);
  console.log(`host        ${host}`);
  console.log(`pooled      ${host.includes("-pooler")}`);

  const start = Date.now();
  await prisma.$queryRaw`SELECT 1`;
  console.log(`connected   ${Date.now() - start}ms\n`);

  const [users, items, collections, tags] = await Promise.all([
    prisma.user.count(),
    prisma.item.count(),
    prisma.collection.count(),
    prisma.tag.count(),
  ]);
  console.log("rows");
  console.log(`  users       ${users}`);
  console.log(`  items       ${items}`);
  console.log(`  collections ${collections}`);
  console.log(`  tags        ${tags}\n`);

  const systemTypes = await prisma.itemType.findMany({
    where: { userId: null },
    orderBy: { sortOrder: "asc" },
    select: { slug: true, name: true, contentType: true, isProOnly: true },
  });

  console.log(`system item types (${systemTypes.length})`);
  for (const type of systemTypes) {
    const pro = type.isProOnly ? "  pro" : "";
    console.log(
      `  ${type.slug.padEnd(10)} ${type.name.padEnd(8)} ${type.contentType}${pro}`,
    );
  }

  if (systemTypes.length !== 7) {
    throw new Error(
      `Expected 7 system item types, found ${systemTypes.length}. Run \`npm run db:seed\`.`,
    );
  }

  console.log("\nOK");
}

main()
  .catch((error) => {
    console.error("\nFAILED\n", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
