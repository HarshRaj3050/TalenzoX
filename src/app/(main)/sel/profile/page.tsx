"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import GradientPurpleBackground from "@/components/background/gradient-purple";
import { Skeleton } from "@/components/ui/skeleton";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  User,
  Award,
  Flame,
  Heart,
  Brain,
  Sparkles,
  TrendingUp,
  BookOpen,
  Target,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from "lucide-react";

type SelProfile = {
  self_awareness?: number | null;
  empathy_score?: number | null;
  streak_days?: number;
  growth_level?: string | null;
  self_management?: number | null;
  social_awareness?: number | null;
  relationship_skills?: number | null;
  responsible_decision_making?: number | null;
  completed_lessons?: number;
  completed_practices?: number;
  has_completed_assessment?: boolean;
  insights?: Array<{ title: string; text: string }>;
};

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("Learner");
  const [selProfile, setSelProfile] = useState<SelProfile | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProfileData = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (isMounted) setLoading(false);
          return;
        }

        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "Learner";

        if (isMounted) {
          setUserName(name);
        }

        // Query Supabase for SEL Profile
        const { data, error } = await supabase
          .from("sel_profiles")
          .select("*")
          .eq("auth_uid", user.id)
          .maybeSingle();

        if (!isMounted) return;

        const profileRecord = data as (SelProfile & { has_completed_assessment?: boolean }) | null;

        if (error || !profileRecord || !profileRecord.has_completed_assessment) {
          // New user: No SEL assessment/scores completed yet
          setIsNewUser(true);
          setSelProfile(null);
        } else {
          // Existing user with real scores
          setIsNewUser(false);
          setSelProfile(profileRecord);
        }
      } catch (err) {
        console.error("Failed to load SEL profile from Supabase:", err);
        if (isMounted) {
          setIsNewUser(true);
          setSelProfile(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfileData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative h-screen max-h-screen overflow-hidden flex flex-col bg-transparent">
        <GradientPurpleBackground />
        {/* Header */}
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
                  <BreadcrumbPage>Profile</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Content Area */}
        <main className="relative z-10 flex flex-1 flex-col overflow-y-auto min-h-0 gap-6 p-6 max-w-6xl w-full mx-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-10">
          {loading ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-64 rounded-xl" />
                <Skeleton className="h-64 rounded-xl" />
              </div>
            </div>
          ) : isNewUser ? (
            /* ========================================================================= */
            /* NEW USER VIEW: No fake data. Only Learning and Practice to improve score */
            /* ========================================================================= */
            <div className="space-y-8 animate-in fade-in-50 duration-500">
              {/* Header Title */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary">
                    <User className="h-6 w-6 bg-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                      Social Emotional Learning Profile &bull; {userName}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Social & Emotional Learning Progress & Intelligence Score
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-white from-primary/10 via-primary/5 to-background p-6 sm:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                  <div className="space-y-2 max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                      <Sparkles className="h-3.5 w-3.5" />
                      Get Started with SEL
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                      Your SEL score is not yet calculated
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      You are just beginning your Social Emotional Learning journey! Complete interactive lessons and practice realistic communication scenarios to establish your baseline score and unlock your personalized growth report.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex flex-col items-center justify-center rounded-xl border bg-card/80 backdrop-blur px-5 py-3 shadow-xs text-center">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Score Status</span>
                      <span className="text-lg font-bold text-primary mt-0.5">Pending</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* TWO MAIN COMPONENTS: LEARNING & PRACTICE */}
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold tracking-tight">
                    Improve & Build Your Profile Score
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Engage with these two core sections to start building your emotional intelligence competencies.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* 1. LEARNING COMPONENT */}
                  <div className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs transition-all hover:border-primary/50 hover:shadow-md">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          <BookOpen className="h-6 w-6" />
                        </div>
                        <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                          Core Knowledge
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                          1. Learning Curriculum
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                          Master foundational concepts in self-awareness, active empathy, emotional regulation, and relationship building through structured, bite-sized lessons.
                        </p>
                      </div>

                      <ul className="space-y-2.5 pt-2 border-t text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          <span>Interactive guided lessons & case studies</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          <span>Self-reflection & cognitive reframing tools</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          <span>Understand your personal triggers and responses</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-8 pt-4 border-t">
                      <Link
                        href="/sel/learning"
                        className={cn(
                          buttonVariants({ variant: "default" }),
                          "w-full gap-2 text-sm font-semibold"
                        )}
                      >
                        <span>Explore Learning Modules</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  {/* 2. PRACTICE COMPONENT */}
                  <div className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs transition-all hover:border-primary/50 hover:shadow-md">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          <Target className="h-6 w-6" />
                        </div>
                        <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                          Applied Scenarios
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                          2. Practice Arena
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                          Test and apply your skills in interactive simulations, conflict drills, and team scenarios to earn XP and calculate your profile score.
                        </p>
                      </div>

                      <ul className="space-y-2.5 pt-2 border-t text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-amber-500 shrink-0" />
                          <span>Real-world interactive scenario drills</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-amber-500 shrink-0" />
                          <span>Instant feedback on tone, empathy & clarity</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-amber-500 shrink-0" />
                          <span>Earn badges and raise your competency score</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-8 pt-4 border-t">
                      <Link
                        href="/sel/practice"
                        className={cn(
                          buttonVariants({ variant: "default" }),
                          "w-full gap-2 text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-600 dark:hover:bg-amber-700"
                        )}
                      >
                        <span>Start Practice Arena</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* RETURNING USER VIEW: Display actual Supabase score data and progress     */
            /* ========================================================================= */
            <div className="space-y-6 animate-in fade-in-50 duration-500">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">SEL Profile &bull; {userName}</h1>
                    <p className="text-sm text-muted-foreground">
                      Track your emotional intelligence, social competencies, and growth.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Self-Awareness</span>
                    <Heart className="h-4 w-4 text-rose-500" />
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-bold">
                      {selProfile?.self_awareness != null ? `${selProfile.self_awareness}%` : "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Evaluated competency</p>
                  </div>
                </div>

                <div className="rounded-xl border bg-card p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Empathy Score</span>
                    <Brain className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-bold">
                      {selProfile?.empathy_score != null ? `${selProfile.empathy_score}%` : "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Interpersonal score</p>
                  </div>
                </div>

                <div className="rounded-xl border bg-card p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Active Streak</span>
                    <Flame className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-bold">
                      {selProfile?.streak_days ?? 0} Days
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Consistency streak</p>
                  </div>
                </div>

                <div className="rounded-xl border bg-card p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Growth Level</span>
                    <Award className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-bold">
                      {selProfile?.growth_level || "Level 1"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Active Rank</p>
                  </div>
                </div>
              </div>

              {/* Core Competencies & Insights */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border bg-card p-6 shadow-xs">
                  <div className="flex items-center gap-2 font-semibold">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h2>Core SEL Competencies</h2>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Self-Management</span>
                        <span className="font-medium">
                          {selProfile?.self_management ?? 0}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${selProfile?.self_management ?? 0}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Social Awareness</span>
                        <span className="font-medium">
                          {selProfile?.social_awareness ?? 0}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${selProfile?.social_awareness ?? 0}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Relationship Skills</span>
                        <span className="font-medium">
                          {selProfile?.relationship_skills ?? 0}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${selProfile?.relationship_skills ?? 0}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Responsible Decision Making</span>
                        <span className="font-medium">
                          {selProfile?.responsible_decision_making ?? 0}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${selProfile?.responsible_decision_making ?? 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-semibold">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <h2>Insights & Achievements</h2>
                    </div>
                    <div className="mt-4 space-y-3">
                      {selProfile?.insights && selProfile.insights.length > 0 ? (
                        selProfile.insights.map((insight, idx) => (
                          <div key={idx} className="rounded-lg bg-muted/50 p-3.5 text-sm">
                            <p className="font-medium">{insight.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{insight.text}</p>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-lg bg-muted/40 p-4 text-center text-sm text-muted-foreground">
                          Keep engaging in learning and practice to generate AI reflections.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Link
                      href="/sel/learning"
                      className={cn(buttonVariants({ variant: "outline" }), "flex-1 gap-1.5")}
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Continue Learning</span>
                    </Link>
                    <Link
                      href="/sel/practice"
                      className={cn(buttonVariants({ variant: "default" }), "flex-1 gap-1.5")}
                    >
                      <Target className="h-4 w-4" />
                      <span>Practice More</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}