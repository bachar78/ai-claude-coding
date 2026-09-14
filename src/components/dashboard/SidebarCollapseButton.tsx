"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function SidebarCollapseButton() {
  const { state, isMobile, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;
  const label = isMobile ? "Close" : isCollapsed ? "Expand" : "Collapse";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={label}
          onClick={toggleSidebar}
          className="text-muted-foreground"
        >
          {isCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          <span>{label}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
