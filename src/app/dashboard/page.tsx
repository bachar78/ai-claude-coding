import { Boxes, FolderHeart, FolderOpen, Star } from "lucide-react";

import { CollectionCard } from "@/components/dashboard/CollectionCard";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { ItemCard } from "@/components/dashboard/ItemCard";
import { StatsCards, type Stat } from "@/components/dashboard/StatsCards";
import {
  getCollectionStats,
  getRecentCollections,
} from "@/lib/db/collections";
import {
  getItemStats,
  getPinnedItems,
  getRecentItems,
} from "@/lib/db/items";
import { getCurrentUserId } from "@/lib/db/user";

const RECENT_COLLECTIONS_LIMIT = 8;
const PINNED_ITEMS_LIMIT = 6;
const RECENT_ITEMS_LIMIT = 10;

const NO_COUNTS = { total: 0, favorites: 0 };

export default async function DashboardPage() {
  const userId = await getCurrentUserId();
  const [
    recentCollections,
    collectionStats,
    pinnedItems,
    recentItems,
    itemStats,
  ] = await Promise.all([
    userId ? getRecentCollections(userId, RECENT_COLLECTIONS_LIMIT) : [],
    userId ? getCollectionStats(userId) : NO_COUNTS,
    userId ? getPinnedItems(userId, PINNED_ITEMS_LIMIT) : [],
    userId ? getRecentItems(userId, RECENT_ITEMS_LIMIT) : [],
    userId ? getItemStats(userId) : NO_COUNTS,
  ]);

  const stats: Stat[] = [
    { label: "Items", value: itemStats.total, icon: Boxes },
    { label: "Collections", value: collectionStats.total, icon: FolderOpen },
    {
      label: "Favorite items",
      value: itemStats.favorites,
      icon: Star,
    },
    {
      label: "Favorite collections",
      value: collectionStats.favorites,
      icon: FolderHeart,
    },
  ];

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
        total={collectionStats.total}
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
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pinnedItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </DashboardSection>

      <DashboardSection
        title="Recent items"
        count={recentItems.length}
        total={itemStats.total}
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
