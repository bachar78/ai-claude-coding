import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface DashboardSectionProps {
  title: string;
  /** Rows rendered in this section. Drives the empty and hidden states. */
  count: number;
  /** Total across the whole collection, when the section only shows a page of it. Defaults to `count`. */
  total?: number;
  viewAllHref: string;
  /** Omit to hide the whole section while it is empty. */
  emptyMessage?: string;
  children: ReactNode;
}

export function DashboardSection({
  title,
  count,
  total,
  viewAllHref,
  emptyMessage,
  children,
}: DashboardSectionProps) {
  if (count === 0 && !emptyMessage) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">{title}</h2>
          <Badge variant="secondary" className="text-muted-foreground">
            {total ?? count}
          </Badge>
        </div>
        <Link
          href={viewAllHref}
          className="flex items-center gap-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          View all
          <ChevronRight className="size-3.5" />
        </Link>
      </div>
      {count === 0 ? (
        <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        children
      )}
    </section>
  );
}
