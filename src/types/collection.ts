import type { ItemTypeBadge } from "@/types/item-type";

/** A collection as the dashboard grid renders it. */
export interface CollectionSummary {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  /** Distinct item types held by the collection, most-used first. */
  types: ItemTypeBadge[];
  /** Dominant type, falling back to the collection's default type. */
  accentType: ItemTypeBadge | null;
  updatedAt: Date;
}

export interface CollectionStats {
  total: number;
  favorites: number;
}
