import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import type {
  CollectionStats,
  CollectionSummary,
  ItemTypeBadge,
} from "@/types/collection";

type ItemTypeRow = ItemTypeBadge & { sortOrder: number };

interface TypeTallyRow {
  collectionId: string;
  itemTypeId: string;
  count: number;
}

/** System types plus the user's own custom ones, keyed by id. */
async function getItemTypesById(
  userId: string
): Promise<Map<string, ItemTypeRow>> {
  const types = await prisma.itemType.findMany({
    where: { OR: [{ userId: null }, { userId }] },
    select: { id: true, name: true, icon: true, color: true, sortOrder: true },
  });

  return new Map(types.map((type) => [type.id, type]));
}

/**
 * Item-type tallies for every given collection in one query (§6.6).
 *
 * Raw SQL because Prisma's `groupBy` cannot join, and the join is the point:
 * counting per card would be N+1 on the grid, and a plain `findMany` over
 * ItemCollection would pull back one row per membership instead of one per
 * (collection, type) pair.
 */
async function tallyTypesByCollection(
  collectionIds: string[]
): Promise<TypeTallyRow[]> {
  if (collectionIds.length === 0) return [];

  return prisma.$queryRaw<TypeTallyRow[]>`
    SELECT ic."collectionId", i."itemTypeId", COUNT(*)::int AS "count"
    FROM "ItemCollection" ic
    JOIN "Item" i ON i."id" = ic."itemId"
    WHERE ic."collectionId" IN (${Prisma.join(collectionIds)})
    GROUP BY ic."collectionId", i."itemTypeId"
  `;
}

/** Most-used type first; ties fall back to the type's own sort order. */
function byUsage(typesById: Map<string, ItemTypeRow>) {
  return (a: TypeTallyRow, b: TypeTallyRow) =>
    b.count - a.count ||
    (typesById.get(a.itemTypeId)?.sortOrder ?? 0) -
      (typesById.get(b.itemTypeId)?.sortOrder ?? 0);
}

function groupByCollection(tallies: TypeTallyRow[]): Map<string, TypeTallyRow[]> {
  const grouped = new Map<string, TypeTallyRow[]>();

  for (const row of tallies) {
    const rows = grouped.get(row.collectionId);
    if (rows) rows.push(row);
    else grouped.set(row.collectionId, [row]);
  }

  return grouped;
}

/** The user's most recently updated collections, newest first. */
export async function getRecentCollections(
  userId: string,
  limit: number
): Promise<CollectionSummary[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      description: true,
      isFavorite: true,
      defaultTypeId: true,
      updatedAt: true,
    },
  });

  if (collections.length === 0) return [];

  const [typesById, tallies] = await Promise.all([
    getItemTypesById(userId),
    tallyTypesByCollection(collections.map((collection) => collection.id)),
  ]);
  const talliesByCollection = groupByCollection(tallies);

  return collections.map(({ defaultTypeId, ...collection }) => {
    const rows = (talliesByCollection.get(collection.id) ?? []).sort(
      byUsage(typesById)
    );
    const types = rows.flatMap((row) => typesById.get(row.itemTypeId) ?? []);
    const defaultType = defaultTypeId
      ? typesById.get(defaultTypeId) ?? null
      : null;

    return {
      ...collection,
      // The tally counts every membership, so summing it saves a second query.
      itemCount: rows.reduce((total, row) => total + row.count, 0),
      types,
      accentType: types[0] ?? defaultType,
    };
  });
}

export async function getCollectionStats(
  userId: string
): Promise<CollectionStats> {
  const [total, favorites] = await Promise.all([
    prisma.collection.count({ where: { userId } }),
    prisma.collection.count({ where: { userId, isFavorite: true } }),
  ]);

  return { total, favorites };
}
