import { Boxes, FolderHeart, FolderOpen, Star } from "lucide-react";

import { CollectionCard } from "@/components/dashboard/CollectionCard";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { ItemCard } from "@/components/dashboard/ItemCard";
import { StatsCards, type Stat } from "@/components/dashboard/StatsCards";
import {
  getCollectionStats,
  getRecentCollections,
} from "@/lib/db/collections";
import { getCurrentUserId } from "@/lib/db/user";
import { items } from "@/lib/mock-data";

const RECENT_COLLECTIONS_LIMIT = 8;
const RECENT_ITEMS_LIMIT = 10;

const NO_COLLECTIONS = { total: 0, favorites: 0 };

export default async function DashboardPage() {
  // Items are still mock data — they move to the database in a later pass.
  const userId = await getCurrentUserId();
  const [recentCollections, collectionStats] = await Promise.all([
    userId ? getRecentCollections(userId, RECENT_COLLECTIONS_LIMIT) : [],
    userId ? getCollectionStats(userId) : NO_COLLECTIONS,
  ]);

  const stats: Stat[] = [
    { label: "Items", value: items.length, icon: Boxes },
    { label: "Collections", value: collectionStats.total, icon: FolderOpen },
    {
      label: "Favorite items",
      value: items.filter((item) => item.isFavorite).length,
      icon: Star,
    },
    {
      label: "Favorite collections",
      value: collectionStats.favorites,
      icon: FolderHeart,
    },
  ];

  const pinnedItems = items.filter((item) => item.isPinned);
  const recentItems = [...items]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, RECENT_ITEMS_LIMIT);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Your developer knowledge hub
        </p>
      </div>

      <StatsCards stats={stats} />

      <DashboardSection
        title="Collections"
        count={recentCollections.length}
        viewAllHref="/collections"
        emptyMessage="No collections yet."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {recentCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </DashboardSection>

      <DashboardSection
        title="Pinned"
        count={pinnedItems.length}
        viewAllHref="/items"
        emptyMessage="Pin items to keep them at the top."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pinnedItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </DashboardSection>

      <DashboardSection
        title="Items"
        count={recentItems.length}
        viewAllHref="/items"
        emptyMessage="No items yet."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recentItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </DashboardSection>
    </div>
  );
}
