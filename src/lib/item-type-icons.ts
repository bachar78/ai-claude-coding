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

export function getItemTypeIcon(name: string): LucideIcon {
  return ITEM_TYPE_ICONS[name] ?? File;
}
