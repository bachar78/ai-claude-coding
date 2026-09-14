import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";

export interface Stat {
  label: string;
  value: number;
  icon: LucideIcon;
}

interface StatsCardsProps {
  stats: Stat[];
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <Card key={label} className="gap-2 px-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon className="size-4 shrink-0" />
            <span className="truncate">{label}</span>
          </div>
          <p className="text-2xl font-semibold tabular-nums">{value}</p>
        </Card>
      ))}
    </div>
  );
}
