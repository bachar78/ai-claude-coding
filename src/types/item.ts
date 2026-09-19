import type { ItemTypeBadge } from "@/types/item-type";

/** An item as the dashboard grids render it. */
export interface ItemSummary {
  id: string;
  title: string;
  description: string | null;
  isPinned: boolean;
  isFavorite: boolean;
  tags: string[];
  /** Always present — `Item.itemTypeId` is required. */
  type: ItemTypeBadge;
  updatedAt: Date;
}

export interface ItemStats {
  total: number;
  favorites: number;
}
