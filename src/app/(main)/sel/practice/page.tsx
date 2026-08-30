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
import GradientPurpleBackground from "@/components/background/gradient-purple";
import { Target } from "lucide-react";

import { practices, kidChallenges } from "./_components/practice-data";
import { ScenarioCard } from "./_components/scenario-card";
import { KidChallengeBanner } from "./_components/kid-challenge-banner";

export default function PracticePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative h-screen max-h-screen overflow-hidden flex flex-col bg-transparent">
        <GradientPurpleBackground />

        {/* ── Top Header ── */}
        <header className="relative z-10 flex h-16 shrink-0 items-center gap-2 border-b-2 border-black hover:border-black px-4 bg-white dark:bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
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

        {/* ── Scrollable Main Content ── */}
        <main className="relative z-10 flex flex-1 flex-col overflow-y-auto min-h-0 gap-6 p-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-10">

          {/* Page Heading */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Social Emotional Learning Practice Arena
              </h1>
              <p className="text-sm text-muted-foreground">
                Simulate real-world interpersonal scenarios and receive instant AI feedback.
              </p>
            </div>
          </div>

          {/* ── Daily Challenges for Ages 5–12 ── */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold tracking-tight">
                Daily SEL Challenges
                <span className="ml-2 text-xs font-normal text-muted-foreground">Ages 5–12</span>
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {kidChallenges.map((challenge, i) => (
                <KidChallengeBanner key={challenge.id} challenge={challenge} index={i} />
              ))}
            </div>
          </section>

          {/* ── Interactive Scenarios ── */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold tracking-tight">Interactive Scenarios</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {practices.map((item) => (
                <ScenarioCard key={item.id} item={item} />
              ))}
            </div>
          </section>

        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
