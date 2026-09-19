/** The fields an item type contributes to a card: its icon badge and accent color. */
export interface ItemTypeBadge {
  id: string;
  name: string;
  icon: string;
  color: string;
}

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
