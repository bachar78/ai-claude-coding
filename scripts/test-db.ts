/**
 * Connection and seed smoke test — run with `npm run db:test`.
 *
 * Exercises the same runtime path the app uses (src/lib/db.ts → pooled
 * DATABASE_URL). Next.js loads .env on its own, but this runs under plain tsx,
 * so dotenv must be imported *before* db.ts builds its adapter.
 */
import "dotenv/config";
import { prisma } from "../src/lib/db";

const DEMO_EMAIL = "demo@devstash.io";

const EXPECTED = {
  systemTypes: 7,
  collections: 5,
  items: 18,
};

const problems: string[] = [];

function fail(message: string) {
  problems.push(message);
}

function expect(label: string, actual: number, expected: number) {
  if (actual !== expected) fail(`${label}: expected ${expected}, found ${actual}`);
}

function heading(text: string) {
  console.log(`\n${text}\n${"─".repeat(text.length)}`);
}

/** Counts each distinct value, e.g. "1 snippets, 2 links". */
function tally(values: string[]): string {
  return [...new Set(values)]
    .map((value) => `${values.filter((v) => v === value).length} ${value}`)
    .join(", ");
}

/** Fixed-width, single-column markers so titles stay aligned. */
function markers(item: { isPinned: boolean; isFavorite: boolean }): string {
  return `${item.isPinned ? "P" : " "}${item.isFavorite ? "★" : " "}`;
}

async function checkConnection() {
  heading("connection");
  const { host } = new URL(process.env.DATABASE_URL!);
  const start = Date.now();
  await prisma.$queryRaw`SELECT 1`;
  console.log(`host      ${host}`);
  console.log(`pooled    ${host.includes("-pooler")}`);
  console.log(`latency   ${Date.now() - start}ms`);
}

async function checkSystemTypes() {
  heading("system item types");
  const types = await prisma.itemType.findMany({
    where: { userId: null },
    orderBy: { sortOrder: "asc" },
  });

  for (const type of types) {
    const pro = type.isProOnly ? "  pro" : "";
    console.log(
      `  ${type.slug.padEnd(10)} ${type.name.padEnd(8)} ${type.contentType.padEnd(5)} ${type.color}${pro}`,
    );
  }

  expect("system item types", types.length, EXPECTED.systemTypes);
}

async function checkDemoUser() {
  heading("demo user");
  const user = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });

  if (!user) {
    throw new Error(`no user found for ${DEMO_EMAIL} — run \`npm run db:seed\``);
  }

  const rounds = user.passwordHash?.split("$")[2];
  const password = user.passwordHash ? `set (bcrypt, ${rounds} rounds)` : "MISSING";
  const verified = user.emailVerified?.toISOString().slice(0, 10) ?? "no";

  console.log(`  name      ${user.name}`);
  console.log(`  email     ${user.email}`);
  console.log(`  plan      ${user.plan}`);
  console.log(`  verified  ${verified}`);
  console.log(`  password  ${password}`);

  if (!user.passwordHash) fail("demo user has no passwordHash");
  return user;
}

async function checkCollections(userId: string) {
  heading("collections");
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    include: {
      defaultType: { select: { slug: true } },
      items: {
        orderBy: { addedAt: "asc" },
        include: {
          item: {
            include: {
              itemType: { select: { slug: true } },
              tags: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  let membershipTotal = 0;

  for (const collection of collections) {
    const star = collection.isFavorite ? "★" : " ";
    const defaultType = collection.defaultType?.slug ?? "no default type";
    const breakdown = tally(collection.items.map((link) => link.item.itemType.slug));

    console.log(`\n  ${star} ${collection.name}  [${defaultType}]  ${breakdown}`);
    console.log(`    ${collection.description}`);

    for (const { item } of collection.items) {
      const lines = item.content?.split("\n").length ?? 0;
      const detail = item.url ?? `${lines} lines ${item.language ?? ""}`;
      console.log(`    ${markers(item)} ${item.title.padEnd(40)} ${detail}`);
      if (item.tags.length) {
        const tags = item.tags.map((tag) => "#" + tag.name).join(" ");
        console.log(`       ${tags}`);
      }
    }

    membershipTotal += collection.items.length;
  }

  expect("collections", collections.length, EXPECTED.collections);
  return membershipTotal;
}

async function checkIntegrity(userId: string, membershipTotal: number) {
  heading("integrity");

  const [items, tags, orphans, shapeErrors] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.tag.count({ where: { userId } }),
    prisma.item.count({ where: { userId, collections: { none: {} } } }),
    // Every item must populate the shape its type declares: TEXT → content,
    // URL → url. Anything else would render as an empty card.
    prisma.item.count({
      where: {
        userId,
        OR: [
          { itemType: { contentType: "TEXT" }, content: null },
          { itemType: { contentType: "URL" }, url: null },
        ],
      },
    }),
  ]);

  console.log(`  items                  ${items}`);
  console.log(`  items in a collection  ${membershipTotal}`);
  console.log(`  items with no home     ${orphans}`);
  console.log(`  distinct tags          ${tags}`);
  console.log(`  wrong content shape    ${shapeErrors}`);

  expect("items", items, EXPECTED.items);
  if (orphans > 0) fail(`${orphans} item(s) belong to no collection`);
  if (shapeErrors > 0) fail(`${shapeErrors} item(s) do not match their type's content shape`);
  if (membershipTotal !== items) {
    fail(`collection membership (${membershipTotal}) does not match item count (${items})`);
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set — copy .env.example to .env.");
  }

  await checkConnection();
  await checkSystemTypes();
  const user = await checkDemoUser();
  const membershipTotal = await checkCollections(user.id);
  await checkIntegrity(user.id, membershipTotal);

  if (problems.length) {
    throw new Error(`\n  - ${problems.join("\n  - ")}`);
  }

  console.log("\nOK — connection, schema and seed data all verified.");
}

main()
  .catch((error) => {
    console.error("\nFAILED", error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
