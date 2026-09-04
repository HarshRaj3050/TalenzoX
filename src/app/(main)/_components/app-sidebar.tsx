"use client"

import * as React from "react"
import Image from "next/image"

import { NavMain } from "@/app/(main)/_components/nav-main"
import { NavProjects } from "@/app/(main)/_components/nav-projects"
import { NavUser } from "@/app/(main)/_components/nav-user"
import { TeamSwitcher } from "@/app/(main)/_components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { AudioLinesIcon, TerminalIcon, TerminalSquareIcon, BotIcon, BookOpenIcon, Settings2Icon, FrameIcon, PieChartIcon, MapIcon, Settings, LayoutDashboard } from "lucide-react"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "TalenzoX",
      logo: (
        <Image
          src="/TalenzoX_logo.png"
          alt="TalenzoX logo"
          width={24}
          height={24}
          className="size-6 object-contain "
        />
      ),
      plan: "Skill Development Application",
    },
    {
      name: "Acme Corp.",
      logo: (
        <AudioLinesIcon
        />
      ),
      plan: "TalenzoX",
    },
    {
      name: "Evil Corp.",
      logo: (
        <TerminalIcon
        />
      ),
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Models",
      url: "#",
      icon: (
        <BotIcon
        />
      ),
      items: [
        {
          title: "AI Chat",
          url: "/ai-assistant",
        },
        {
          title: "AI Voice Agent",
          url: "/ai-voice-agent",
        },
        {
          title: "Schedule Maker",
          url: "#",
        },
      ],
    },
    {
      title: "Social Emotional Learning",
      url: "#",
      icon: (
        <BookOpenIcon
        />
      ),
      isActive: true,
      items: [
        {
          title: "Profile",
          url: "/sel/profile",
        },
        {
          title: "Learning",
          url: "/sel/learning",
        },
        {
          title: "Practice",
          url: "/sel/practice",
        },
      ],
    },
    {
      title: "Experiment",
      url: "#",
      icon: (
        <Settings2Icon
        />
      ),
      items: [
        {
          title: "Profile",
          url: "/user-details",
        },
        {
          title: "Video Playlist",
          url: "/experiment/playlist",
        },
        {
          title: "Hands-on Experiment",
          url: "/experiment/hand-on-experiment",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: (
        <FrameIcon
        />
      ),
    },
    {
      name: "Settings",
      url: "/settings",
      icon: (
        <Settings />
      ),
    },
    {
      name: "Travel",
      url: "#",
      icon: (
        <MapIcon
        />
      ),
    },
  ],
  Routes: [
    {
      name: "Dashboard",
      url: "/home",
      icon: (
        <LayoutDashboard />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.Routes} />
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
