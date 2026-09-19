import {
  Code,
  File,
  Image,
  Link,
  Sparkles,
  StickyNote,
  Terminal,
  type LucideIcon,
} from "lucide-react";

export const ITEM_TYPE_ICONS: Record<string, LucideIcon> = {
  Code,
  File,
  Image,
  Link,
  Sparkles,
  StickyNote,
  Terminal,
};

/** Stands in for the accent color of a type-less or empty collection. */
export const NEUTRAL_TYPE_COLOR = "#6b7280";

export function getItemTypeIcon(name: string): LucideIcon {
  return ITEM_TYPE_ICONS[name] ?? File;
}
