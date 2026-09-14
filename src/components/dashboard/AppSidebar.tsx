import Link from "next/link";
import { ChevronRight, Folder, Lock, Settings, Star, Zap } from "lucide-react";

import { SidebarCollapseButton } from "@/components/dashboard/SidebarCollapseButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { getItemTypeIcon } from "@/lib/item-type-icons";
import {
  collections,
  currentUser,
  items,
  itemTypes,
  type MockCollection,
} from "@/lib/mock-data";
import { getInitials } from "@/lib/utils";

const RECENT_COLLECTIONS_LIMIT = 5;

const typeColorById = new Map(itemTypes.map((type) => [type.id, type.color]));

function countItemsByType(typeId: string): number {
  return items.filter((item) => item.itemTypeId === typeId).length;
}

interface CollectionListProps {
  label: string;
  collections: MockCollection[];
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
                <Folder
                  color={
                    collection.defaultTypeId
                      ? typeColorById.get(collection.defaultTypeId)
                      : undefined
                  }
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

export function AppSidebar() {
  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const recentCollections = [...collections]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, RECENT_COLLECTIONS_LIMIT);

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
                const isLocked = type.isProOnly && currentUser.plan === "FREE";

                return (
                  <SidebarMenuItem key={type.id}>
                    <SidebarMenuButton
                      tooltip={type.name}
                      render={<Link href={`/items/${type.slug}`} />}
                    >
                      <Icon color={type.color} />
                      <span>{type.name}</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge className="text-muted-foreground">
                      {isLocked ? (
                        <Lock className="size-3.5" />
                      ) : (
                        countItemsByType(type.id)
                      )}
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
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip={currentUser.name}>
              <Avatar>
                {currentUser.image && (
                  <AvatarImage src={currentUser.image} alt={currentUser.name} />
                )}
                <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 leading-tight">
                <span className="truncate font-medium">{currentUser.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {currentUser.email}
                </span>
              </div>
              <Settings className="text-muted-foreground" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
