import type { CSSProperties } from "react";
import Link from "next/link";
import { ChevronRight, Settings, Star, Zap } from "lucide-react";

import { SidebarCollapseButton } from "@/components/dashboard/SidebarCollapseButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  getFavoriteCollections,
  getRecentCollections,
} from "@/lib/db/collections";
import { getItemTypesWithCounts } from "@/lib/db/items";
import { getCurrentUser } from "@/lib/db/user";
import { getItemTypeIcon, NEUTRAL_TYPE_COLOR } from "@/lib/item-type-icons";
import { getInitials } from "@/lib/utils";
import type { CollectionSummary } from "@/types/collection";

const RECENT_COLLECTIONS_LIMIT = 5;

/** The dominant item type of a collection, as a dot in the icon slot. */
function CollectionDot({ color }: { color: string }) {
  return (
    <span className="flex size-4 shrink-0 items-center justify-center">
      <span
        style={{ "--type-color": color } as CSSProperties}
        className="size-2 rounded-full bg-(color:--type-color)"
      />
    </span>
  );
}

/** Marks an item type that the user's plan does not include. */
function ProBadge() {
  return (
    <Badge
      variant="outline"
      className="h-4 px-1.5 text-[0.625rem] tracking-wider text-muted-foreground"
    >
      PRO
    </Badge>
  );
}

interface CollectionListProps {
  label: string;
  collections: CollectionSummary[];
  isFavorites?: boolean;
}

function CollectionList({ label, collections, isFavorites }: CollectionListProps) {
  if (collections.length === 0) return null;

  return (
    <>
      <p className="px-2 pt-2 pb-1 text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <SidebarMenu>
        {collections.map((collection) => (
          <SidebarMenuItem key={collection.id}>
            <SidebarMenuButton
              render={<Link href={`/collections/${collection.id}`} />}
            >
              {isFavorites ? (
                <Star className="fill-yellow-400 text-yellow-400" />
              ) : (
                <CollectionDot
                  color={collection.accentType?.color ?? NEUTRAL_TYPE_COLOR}
                />
              )}
              <span>{collection.name}</span>
            </SidebarMenuButton>
            <SidebarMenuBadge className="text-muted-foreground">
              {collection.itemCount}
            </SidebarMenuBadge>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </>
  );
}

export async function AppSidebar() {
  const user = await getCurrentUser();
  const [itemTypes, favoriteCollections, recentCollections] = await Promise.all([
    user ? getItemTypesWithCounts(user.id) : [],
    user ? getFavoriteCollections(user.id) : [],
    user ? getRecentCollections(user.id, RECENT_COLLECTIONS_LIMIT) : [],
  ]);

  const isPro = user?.plan === "PRO";
  const displayName = user?.name ?? user?.email ?? "";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 justify-center border-b border-sidebar-border">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 overflow-hidden px-0.5"
        >
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Zap className="size-4" />
          </div>
          <span className="truncate font-semibold group-data-[collapsible=icon]:hidden">
            DevStash
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarCollapseButton />
        </SidebarGroup>
        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Types</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemTypes.map((type) => {
                const Icon = getItemTypeIcon(type.icon);
                const isLocked = type.isProOnly && !isPro;

                return (
                  <SidebarMenuItem key={type.id}>
                    <SidebarMenuButton
                      tooltip={type.name}
                      render={<Link href={`/items/${type.slug}`} />}
                    >
                      <Icon color={type.color} />
                      <span>{type.name}</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge
                      className={isLocked ? "px-0" : "text-muted-foreground"}
                    >
                      {isLocked ? <ProBadge /> : type.itemCount}
                    </SidebarMenuBadge>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Collapsible
          defaultOpen
          className="group-data-[collapsible=icon]:hidden"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              render={<CollapsibleTrigger />}
              className="group/trigger w-full cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              Collections
              <ChevronRight className="ml-auto transition-transform group-data-panel-open/trigger:rotate-90" />
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <CollectionList
                  label="Favorites"
                  collections={favoriteCollections}
                  isFavorites
                />
                <CollectionList
                  label="Recent"
                  collections={recentCollections}
                />
                <SidebarMenu className="pt-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      render={<Link href="/collections" />}
                      className="text-muted-foreground"
                    >
                      <ChevronRight />
                      <span>View all collections</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      {user && (
        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip={displayName}>
                <Avatar>
                  {user.image && (
                    <AvatarImage src={user.image} alt={displayName} />
                  )}
                  <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
                <Settings className="text-muted-foreground" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
