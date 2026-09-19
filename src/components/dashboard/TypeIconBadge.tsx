import { createElement, type CSSProperties } from "react";

import { getItemTypeIcon } from "@/lib/item-type-icons";
import { cn } from "@/lib/utils";
import type { ItemTypeBadge } from "@/types/collection";

interface TypeIconBadgeProps {
  type: ItemTypeBadge;
  className?: string;
}

export function TypeIconBadge({ type, className }: TypeIconBadgeProps) {
  return (
    <span
      title={type.name}
      style={{ "--type-color": type.color } as CSSProperties}
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-md bg-(color:--type-color)/15 text-(color:--type-color)",
        className
      )}
    >
      {/* Icons come from a static map, so createElement avoids a false positive from react-hooks/static-components */}
      {createElement(getItemTypeIcon(type.icon), { className: "size-4" })}
    </span>
  );
}
