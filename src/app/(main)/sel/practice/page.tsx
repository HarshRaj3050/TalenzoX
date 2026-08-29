"use client";

import { AppSidebar } from "@/app/(main)/_components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Target, Trophy, Sparkles, MessageSquare, ShieldAlert, HeartHandshake, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const practices = [
  {
    id: 1,
    title: "Scenario: Team Disagreement",
    type: "Roleplay Simulation",
    xp: "+150 XP",
    icon: MessageSquare,
    difficulty: "Intermediate",
    prompt: "A teammate rejects your proposal in a group project. Respond with constructive assertiveness.",
  },
  {
    id: 2,
    title: "Scenario: Supporting an Overwhelmed Peer",
    type: "Empathy Drill",
    xp: "+120 XP",
    icon: HeartHandshake,
    difficulty: "Beginner",
    prompt: "Recognize signs of burnout and offer psychological safety without unsolicited advice.",
  },
  {
    id: 3,
    title: "Scenario: Handling High Pressure Feedback",
    type: "Emotional Regulation",
    xp: "+200 XP",
    icon: ShieldAlert,
    difficulty: "Advanced",
    prompt: "Receive critical evaluation from a mentor and extract growth opportunities calmly.",
  },
];

export default function PracticePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/home">TalenzoX</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Social Emotional Learning</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Practice</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Social Emotional Learning Practice Arena</h1>
                <p className="text-sm text-muted-foreground">
                  Simulate real-world interpersonal scenarios and receive instant AI feedback.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 shadow-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> Daily SEL Challenge
                </span>
                <h2 className="text-xl font-bold mt-2">Active Reframing Exercise</h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                  Take a stressful thought today and practice transforming it into a neutral, growth-oriented reflection.
                </p>
              </div>
              <Button className="shrink-0 gap-2">
                Start Daily Challenge <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Interactive Scenarios</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {practices.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between rounded-xl border bg-card p-5 shadow-xs transition-all hover:border-primary/50"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-foreground">
                          <IconComponent className="h-4.5 w-4.5" />
                        </div>
                        <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                          {item.xp}
                        </span>
                      </div>
                      <div className="mt-3">
                        <span className="text-xs text-muted-foreground font-medium">{item.type}</span>
                        <h3 className="text-base font-semibold mt-1">{item.title}</h3>
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                          {item.prompt}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t pt-4">
                      <span className="text-xs font-medium text-muted-foreground">{item.difficulty}</span>
                      <Button size="sm" variant="outline" className="gap-1 text-xs">
                        Practice <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
