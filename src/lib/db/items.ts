import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import type { ItemStats, ItemSummary } from "@/types/item";

/**
 * Everything a card renders. The item type comes back on the same query so the
 * grid never looks one up per card.
 */
const CARD_SELECT = {
  id: true,
  title: true,
  description: true,
  isPinned: true,
  isFavorite: true,
  updatedAt: true,
  itemType: { select: { id: true, name: true, icon: true, color: true } },
  tags: { select: { name: true }, orderBy: { name: "asc" } },
} satisfies Prisma.ItemSelect;

type ItemCardRow = Prisma.ItemGetPayload<{ select: typeof CARD_SELECT }>;

function toSummary({ itemType, tags, ...item }: ItemCardRow): ItemSummary {
  return {
    ...item,
    type: itemType,
    tags: tags.map((tag) => tag.name),
  };
}

/** The user's pinned items, most recently updated first. */
export async function getPinnedItems(
  userId: string,
  limit: number
): Promise<ItemSummary[]> {
  const items = await prisma.item.findMany({
    where: { userId, isPinned: true },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: CARD_SELECT,
  });

  return items.map(toSummary);
}

/** The user's most recently updated items, newest first. */
export async function getRecentItems(
  userId: string,
  limit: number
): Promise<ItemSummary[]> {
  const items = await prisma.item.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: CARD_SELECT,
  });

  return items.map(toSummary);
}

export async function getItemStats(userId: string): Promise<ItemStats> {
  const [total, favorites] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.item.count({ where: { userId, isFavorite: true } }),
  ]);

  return { total, favorites };
}
