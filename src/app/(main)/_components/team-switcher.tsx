"use client";

import * as React from "react";
import Link from "next/link";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ReactNode;
    plan: string;
  }[];
}) {
  const team = teams[0];
  if (!team) {
    return null;
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          render={<Link href="/" />}
          size="lg"
          className="hover:bg-sidebar! hover:text-sidebar-primary-foreground!"
        >
          <div className="flex w-full items-center justify-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-centerrounded-lg bg-transparent text-sidebar-primary-foreground">
              {team.logo}
            </div>
            <div className="grid flex-1 text-left text-3xl leading-tight pl-1">
              <span className="truncate font-medium">{team.name}</span>
              <span className="truncate text-xs">{team.plan}</span>
            </div>
          </div>
        </SidebarMenuButton>
        <div className="mt-3">
          <hr />
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
