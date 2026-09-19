import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import type { ContentType } from "../src/generated/prisma/enums";

interface SystemType {
  slug: string;
  name: string;
  contentType: ContentType;
  icon: string;
  color: string;
  sortOrder: number;
  isProOnly?: boolean;
}

const SYSTEM_TYPES: SystemType[] = [
  { slug: "snippets", name: "Snippet", contentType: "TEXT", icon: "Code", color: "#3b82f6", sortOrder: 0 },
  { slug: "prompts", name: "Prompt", contentType: "TEXT", icon: "Sparkles", color: "#8b5cf6", sortOrder: 1 },
  { slug: "commands", name: "Command", contentType: "TEXT", icon: "Terminal", color: "#f97316", sortOrder: 2 },
  { slug: "notes", name: "Note", contentType: "TEXT", icon: "StickyNote", color: "#fde047", sortOrder: 3 },
  { slug: "links", name: "Link", contentType: "URL", icon: "Link", color: "#10b981", sortOrder: 4 },
  { slug: "files", name: "File", contentType: "FILE", icon: "File", color: "#6b7280", sortOrder: 5, isProOnly: true },
  { slug: "images", name: "Image", contentType: "FILE", icon: "Image", color: "#ec4899", sortOrder: 6, isProOnly: true },
];

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const type of SYSTEM_TYPES) {
    const data = {
      name: type.name,
      contentType: type.contentType,
      icon: type.icon,
      color: type.color,
      sortOrder: type.sortOrder,
      isProOnly: type.isProOnly ?? false,
      isSystem: true,
    };

    // `upsert` can't target the partial unique index on (slug WHERE userId IS
    // NULL), so find-then-write keeps this idempotent across re-runs.
    const existing = await prisma.itemType.findFirst({
      where: { slug: type.slug, userId: null },
      select: { id: true },
    });

    if (existing) {
      await prisma.itemType.update({ where: { id: existing.id }, data });
    } else {
      await prisma.itemType.create({ data: { ...data, slug: type.slug, userId: null } });
    }
  }

  console.log(`Seeded ${SYSTEM_TYPES.length} system item types.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
