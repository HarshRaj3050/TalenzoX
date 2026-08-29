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
import { BookOpen, CheckCircle2, Clock, PlayCircle, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const modules = [
  {
    id: 1,
    title: "Understanding Emotional Triggers",
    category: "Self-Awareness",
    duration: "15 min",
    lessons: 4,
    completed: true,
    description: "Identify how internal and external events influence emotional responses.",
  },
  {
    id: 2,
    title: "Mastering Active Empathy",
    category: "Social Awareness",
    duration: "20 min",
    lessons: 5,
    completed: false,
    description: "Techniques for deep listening and seeing situations from others' perspectives.",
  },
  {
    id: 3,
    title: "Constructive Conflict Resolution",
    category: "Relationship Skills",
    duration: "25 min",
    lessons: 6,
    completed: false,
    description: "Navigate interpersonal disagreements with empathy and clarity.",
  },
  {
    id: 4,
    title: "Mindful Stress Regulation",
    category: "Self-Management",
    duration: "18 min",
    lessons: 4,
    completed: false,
    description: "Real-time cognitive reframing and relaxation protocols under pressure.",
  },
];

export default function LearningPage() {
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
                  <BreadcrumbPage>Learning</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Social Emotional Learning Curriculum</h1>
                <p className="text-sm text-muted-foreground">
                  Interactive lessons and frameworks to cultivate your emotional intelligence.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {modules.map((mod) => (
              <div
                key={mod.id}
                className="group relative flex flex-col justify-between rounded-xl border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {mod.category}
                    </span>
                    {mod.completed ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" /> {mod.duration}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">{mod.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t pt-4">
                  <span className="text-xs text-muted-foreground">{mod.lessons} Lessons</span>
                  <Button size="sm" variant={mod.completed ? "outline" : "default"} className="gap-1.5">
                    {mod.completed ? "Review" : "Start Module"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
