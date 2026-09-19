/** The fields an item type contributes to a card: its icon badge and accent color. */
export interface ItemTypeBadge {
  id: string;
  name: string;
  icon: string;
  color: string;
}

/** An item type as the sidebar lists it: a link, a lock and a count. */
export interface ItemTypeSummary extends ItemTypeBadge {
  slug: string;
  isProOnly: boolean;
  itemCount: number;
}
