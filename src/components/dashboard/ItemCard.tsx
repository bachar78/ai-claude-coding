import type { CSSProperties } from "react";
import { Pin, Star } from "lucide-react";

import { TypeIconBadge } from "@/components/dashboard/TypeIconBadge";
import { Badge } from "@/components/ui/badge";
import { getItemTypeById, type MockItem } from "@/lib/mock-data";

interface ItemCardProps {
  item: MockItem;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function ItemCard({ item }: ItemCardProps) {
  const type = getItemTypeById(item.itemTypeId);

  return (
    <article
      style={{ "--type-color": type?.color } as CSSProperties}
      className="flex flex-col gap-3 rounded-xl border border-l-2 border-l-(color:--type-color) bg-card p-4 transition-colors hover:border-foreground/20 hover:border-l-(color:--type-color)"
    >
      <div className="flex items-start gap-3">
        {type && <TypeIconBadge type={type} />}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-medium">{item.title}</h3>
            {item.isPinned && (
              <Pin className="size-3.5 shrink-0 text-muted-foreground" />
            )}
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {item.description}
          </p>
        </div>
        {item.isFavorite && (
          <Star className="size-4 shrink-0 fill-yellow-400 text-yellow-400" />
        )}
      </div>
      <div className="mt-auto flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap gap-1">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-muted-foreground">
              {tag}
            </Badge>
          ))}
        </div>
        <time
          dateTime={item.updatedAt}
          className="shrink-0 text-xs text-muted-foreground"
        >
          {dateFormatter.format(new Date(item.updatedAt))}
        </time>
      </div>
    </article>
  );
}
