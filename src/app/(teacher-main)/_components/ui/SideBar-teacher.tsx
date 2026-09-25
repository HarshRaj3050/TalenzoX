"use client";

import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import Image from "next/image";

import {
  CircleUserRound,
  ChevronsUpDown,
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ---------------- Footer User Menu ---------------- */
function UserMenu() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    const supabase = getSupabaseBrowserClient("teacher");
    const { error } = await supabase.auth.signOut({ scope: "local" });

    if (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
      return;
    }

    window.location.replace("/teacher/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="h-12 w-full justify-between gap-3 px-3"
          />
        }
      >
        <div className="flex items-center gap-2">
          <CircleUserRound className="h-5 w-5 rounded-md" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">ruixen</span>
            <span className="text-xs text-muted-foreground">
              team@ruixen.com
            </span>
          </div>
        </div>
        <ChevronsUpDown className="h-4 w-4 opacity-70" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-500"
            disabled={isLoggingOut}
            onClick={handleLogout}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ---------------- Status Badge ---------------- */
function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  const colors: Record<string, string> = {
    New: "bg-green-100 text-green-700",
    Updated: "bg-blue-100 text-blue-700",
    "Coming Soon": "bg-yellow-100 text-yellow-700",
  };
  return (
    <span
      className={`ml-2 px-2 py-0.5 rounded-md text-xs font-medium ${colors[status]}`}
    >
      {status}
    </span>
  );
}

type SidebarLeafItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  status?: string;
};

type SidebarItem =
  | SidebarLeafItem
  | { sublabel: string; children: SidebarLeafItem[] };
type SidebarGroup =
  | { label: "Main"; items: SidebarLeafItem[] }
  | { label: "Work"; items: SidebarItem[] };

/* ---------------- Sidebar Data ---------------- */
const sidebarData: SidebarGroup[] = [
  {
    label: "Main",
    items: [
      { title: "Home", url: "#", icon: Home },
      { title: "Inbox", url: "#", icon: Inbox, status: "New" },
    ],
  },
  {
    label: "Work",
    items: [
      {
        sublabel: "Attendace",
        children: [{ title: "Preferences", url: "#", icon: Settings }],
      },
      {
        sublabel: "Weekly Activity",
        children: [
          { title: "Activity Dashboard", url: "#", icon: Calendar },
          { title: "Activity Ranking", url: "#", icon: Search, status: "Updated" },
        ],
      },
      {
        title: "Calendar",
        url: "#",
        icon: Calendar,
      },
      {
        title: "Reports", // <-- single item, no dropdown
        url: "#",
        icon: Inbox,
        status: "Coming Soon",
      },
    ],
  },
];

/* ---------------- Collapsible Subgroup ---------------- */
function CollapsibleSubGroup({
  sublabel,
  childrenItems,
}: {
  sublabel: string;
  childrenItems: SidebarLeafItem[];
}) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full justify-between items-center px-2 py-1 text-sm font-medium text-muted-foreground hover:text-foreground transition"
      >
        {sublabel}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <SidebarMenu>
              {childrenItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={
                      <a
                        href={item.url}
                        className="flex items-center text-muted-foreground hover:text-foreground"
                      />
                    }
                    tooltip={item.title}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    <span>{item.title}</span>
                    <StatusBadge status={item.status} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Main Sidebar ---------------- */
export function SidebarTeacher({ children }: { children?: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar className="">
        <SidebarContent>
          <div className="flex items-center gap-3 border-b px-4 py-4">
            <Image
              src="/TalenzoX_logo_white.png"
              alt="TalenzoX"
              width={36}
              height={36}
              className="h-9 w-9 object-contain "
            />
            <span className="text-md font-semibold leading-tight flex flex-col items-center">
              TalenzoX <div className="text-sm">Teacher Dashboard</div> 
            </span>
          </div>

          {sidebarData.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-2">
                {group.label}
              </SidebarGroupLabel>

              <SidebarGroupContent>
                {group.label === "Work" ? (
                  <>
                    {group.items.map((item: SidebarItem) =>
                      "children" in item ? (
                        <CollapsibleSubGroup
                          key={item.sublabel}
                          sublabel={item.sublabel}
                          childrenItems={item.children}
                        />
                      ) : (
                        // Single item with no dropdown
                        <SidebarMenu key={item.title}>
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              render={
                                <a
                                  href={item.url}
                                  className="flex items-center text-muted-foreground hover:text-foreground"
                                />
                              }
                              tooltip={item.title}
                            >
                              <item.icon className="h-4 w-4 mr-2" />
                              <span>{item.title}</span>
                              <StatusBadge status={item.status} />
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </SidebarMenu>
                      ),
                    )}
                  </>
                ) : (
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          render={
                            <a
                              href={item.url}
                              className="flex items-center text-muted-foreground hover:text-foreground"
                            />
                          }
                          tooltip={item.title}
                        >
                          <item.icon className="h-4 w-4 mr-2" />
                          <span>{item.title}</span>
                          <StatusBadge status={item.status} />
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        {/* Footer dropdown menu */}
        <SidebarFooter>
          <UserMenu />
        </SidebarFooter>
      </Sidebar>

      <main className="min-w-0 flex-1">
        <div className="px-4 py-2">
          <SidebarTrigger className="mt-2 h-5 w-5" />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
