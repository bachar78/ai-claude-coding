import type { CSSProperties } from "react";
import Link from "next/link";
import { Star } from "lucide-react";

import { TypeIconBadge } from "@/components/dashboard/TypeIconBadge";
import { NEUTRAL_TYPE_COLOR } from "@/lib/item-type-icons";
import type { CollectionSummary } from "@/types/collection";

interface CollectionCardProps {
  collection: CollectionSummary;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const { accentType, types, itemCount } = collection;

  return (
    <Link
      href={`/collections/${collection.id}`}
      style={
        { "--type-color": accentType?.color ?? NEUTRAL_TYPE_COLOR } as CSSProperties
      }
      className="group flex flex-col gap-3 rounded-xl border border-l-2 border-l-(color:--type-color) bg-card bg-linear-to-br from-(color:--type-color)/10 to-card p-4 transition-colors hover:border-foreground/20 hover:border-l-(color:--type-color)"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-medium">{collection.name}</h3>
          {collection.isFavorite && (
            <Star className="size-4 shrink-0 fill-yellow-400 text-yellow-400" />
          )}
        </div>
        {collection.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {collection.description}
          </p>
        )}
      </div>
      <div className="mt-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {types.map((type) => (
            <TypeIconBadge key={type.id} type={type} className="size-6" />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>
    </Link>
  );
}
