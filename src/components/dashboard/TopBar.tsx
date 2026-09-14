import { FolderPlus, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function TopBar() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1 md:hidden" />

      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search title, content, tags..."
          className="h-9 pr-12 pl-8"
        />
        <Kbd className="absolute top-1/2 right-2 -translate-y-1/2">⌘K</Kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" className="h-9">
          <FolderPlus data-icon="inline-start" />
          <span className="hidden sm:inline">New collection</span>
        </Button>
        <Button className="h-9">
          <Plus data-icon="inline-start" />
          <span className="hidden sm:inline">New item</span>
        </Button>
      </div>
    </header>
  );
}
