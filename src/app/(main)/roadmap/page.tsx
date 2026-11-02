"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LearningRoadmap } from "@/agents/roadmap.agent";
import { AppSidebar } from "@/app/(main)/_components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Compass,
  Layers3,
  LoaderCircle,
  Milestone,
  Sparkles,
  Target,
} from "lucide-react";

const durations = [
  { months: 3, label: "3 months", detail: "A focused sprint" },
  { months: 6, label: "6 months", detail: "A deeper journey" },
] as const;

const suggestions = [
  "Become a software developer",
  "Learn data science",
  "Design my first mobile app",
  "Improve my public speaking",
];

const generationSteps = [
  "Getting your learning goal ready",
  "Creating your personalized path",
  "Building your roadmap milestones",
  "Putting the finishing touches on",
];

const milestoneVariants = {
  hidden: { opacity: 0, y: 28, rotateX: -8 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.55, delay: index * 0.12, ease: "easeOut" as const },
  }),
};

type RoadmapHistoryEntry = {
  id: string;
  goal: string;
  durationMonths: 3 | 6;
  roadmap: LearningRoadmap;
  createdAt: string;
};

export default function RoadmapPage() {
  const [learningGoal, setLearningGoal] = useState("");
  const [durationMonths, setDurationMonths] = useState<3 | 6>(3);
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [activeTab, setActiveTab] = useState<"ideas" | "history">("ideas");
  const [history, setHistory] = useState<RoadmapHistoryEntry[]>([]);

  useEffect(() => {
    if (!isGenerating) return;

    const timer = window.setInterval(() => {
      setGenerationStep((current) =>
        Math.min(current + 1, generationSteps.length - 1),
      );
    }, 1700);

    return () => window.clearInterval(timer);
  }, [isGenerating]);

  const handleGenerate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isGenerating) return;

    setGenerationStep(0);
    setIsGenerating(true);
    setErrorMessage("");
    setRoadmap(null);

    try {
      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ learningGoal, durationMonths }),
      });
      const result = (await response.json()) as {
        roadmap?: LearningRoadmap;
        message?: string;
      };

      const generatedRoadmap = result.roadmap;
      if (!response.ok || !generatedRoadmap) {
        throw new Error(result.message || "We could not build your roadmap.");
      }

      setRoadmap(generatedRoadmap);
      setHistory((entries) => [
        {
          id: `${Date.now()}-${entries.length}`,
          goal: learningGoal.trim(),
          durationMonths,
          roadmap: generatedRoadmap,
          createdAt: new Date().toISOString(),
        },
        ...entries,
      ]);
    } catch (error) {
      console.error("Failed to generate learning roadmap:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We could not build your roadmap. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-svh bg-[#f7f8fc]">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center gap-2 text-sm">
              <span className="hidden text-slate-500 sm:inline">Learning</span>
              <span className="hidden text-slate-300 sm:inline">/</span>
              <span className="font-semibold text-slate-900">AI Roadmap</span>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 sm:flex">
            <Sparkles className="size-3.5" />
            Your next step starts here
          </div>
        </header>

        <main className="mx-auto grid min-h-[calc(100dvh-4rem)] w-full max-w-[1600px] gap-4 p-3 sm:p-5 lg:h-[calc(100dvh-4rem)] lg:grid-cols-[350px_minmax(0,1fr)] lg:overflow-hidden">
          <aside className="flex min-h-[650px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:min-h-0">
            <div className="border-b border-slate-100 px-5 pb-4 pt-5">
              <div className="flex items-center justify-between gap-2">
                <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                  AI Roadmap Maker
                </h1>
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Layers3 className="size-5" />
                </div>
              </div>
              <p className="mt-1 text-center text-sm leading-5 text-slate-500">
                Level up with an AI-powered learning roadmap.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("ideas")}
                aria-pressed={activeTab === "ideas"}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  activeTab === "ideas"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Compass className="size-4" />
                  Ideas
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                aria-pressed={activeTab === "history"}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  activeTab === "history"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="size-4" />
                  History
                </span>
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              <AnimatePresence mode="wait" initial={false}>
                {activeTab === "ideas" ? (
                  <motion.div
                    key="ideas"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.18 }}
                  >
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Pick an idea to get started
                    </p>
                    <div className="space-y-2.5">
                      {suggestions.map((suggestion, index) => (
                        <motion.button
                          key={suggestion}
                          type="button"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.06 }}
                          onClick={() => {
                            setLearningGoal(suggestion);
                          }}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-800"
                        >
                          {suggestion}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ) : history.length ? (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-2.5"
                  >
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Roadmaps from this session
                    </p>
                    {history.map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => {
                          setLearningGoal(entry.goal);
                          setDurationMonths(entry.durationMonths);
                          setRoadmap(entry.roadmap);
                          setErrorMessage("");
                        }}
                        className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                          roadmap === entry.roadmap
                            ? "border-blue-300 bg-blue-50"
                            : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/50"
                        }`}
                      >
                        <span className="block truncate text-sm font-medium text-slate-800">
                          {entry.roadmap.title}
                        </span>
                        <span className="mt-1 block truncate text-xs text-slate-500">
                          {entry.goal} · {entry.durationMonths} months
                        </span>
                      </button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="history-empty"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.18 }}
                    className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center"
                  >
                    <Clock3 className="mx-auto size-5 text-slate-400" />
                    <p className="mt-3 text-sm font-medium text-slate-700">
                      No roadmaps yet
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Your generated roadmaps will appear here.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <form
              onSubmit={handleGenerate}
              className="border-t-[3px] border-slate-800 bg-white p-3.5"
            >
              <div className="flex items-center justify-between rounded-t-xl bg-slate-900 px-4 py-2.5 text-xs font-medium text-white">
                <span>Roadmap maker</span>
                <span className="text-slate-300">AI powered</span>
              </div>
              <div className="rounded-b-xl border border-t-0 border-slate-200 p-3">
                <div className="mb-3 flex items-center gap-2">
                  <Clock3 className="size-4 shrink-0 text-slate-400" />
                  <label htmlFor="roadmap-duration" className="sr-only">
                    Roadmap duration
                  </label>
                  <select
                    id="roadmap-duration"
                    value={durationMonths}
                    onChange={(event) =>
                      setDurationMonths(Number(event.target.value) as 3 | 6)
                    }
                    className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  >
                    {durations.map((duration) => (
                      <option key={duration.months} value={duration.months}>
                        {duration.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <label htmlFor="learning-goal" className="sr-only">
                    Tell us what you want to learn
                  </label>
                  <textarea
                    id="learning-goal"
                    required
                    minLength={10}
                    maxLength={2000}
                    value={learningGoal}
                    onChange={(event) => setLearningGoal(event.target.value)}
                    placeholder="Tell us what you want to learn"
                    rows={2}
                    className="min-h-14 min-w-0 flex-1 resize-y rounded-xl bg-slate-50 px-3 py-2 text-sm leading-5 text-slate-700 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-blue-100"
                  />
                  <button
                    type="submit"
                    aria-label="Generate roadmap"
                    disabled={isGenerating || learningGoal.trim().length < 10}
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {isGenerating ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <ArrowRight className="size-4" />
                    )}
                  </button>
                </div>
              </div>
              {errorMessage && (
                <p role="alert" className="px-1 pt-2 text-xs text-rose-600">
                  {errorMessage}
                </p>
              )}
            </form>
          </aside>

          <section className="relative min-h-[600px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:min-h-0">
            <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-blue-50 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 size-72 rounded-full bg-violet-50 blur-3xl" />
            <div
              className={`relative flex h-full min-h-[600px] flex-col items-center overflow-y-auto px-5 py-10 sm:px-10 lg:min-h-0 ${
                roadmap ? "justify-start" : "justify-center"
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isGenerating ? (
                  <motion.div
                    key="generating"
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                    className="w-full max-w-xl rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 shadow-[0_16px_40px_-24px_rgba(41,74,148,0.35)] sm:p-7"
                  >
                    <div className="flex items-start justify-between gap-4 ">
                      <div>
                        <p className="text-lg font-semibold leading-7 text-slate-900">
                          Hang tight, we&apos;re designing your personalized
                          roadmap
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                          {learningGoal}
                        </p>
                      </div>
                      <motion.div
                        animate={{ rotate: [0, 8, -8, 0], y: [0, -4, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm"
                      >
                        <Layers3 className="size-5" />
                      </motion.div>
                    </div>
                    <div className="mt-5 h-px bg-blue-100" />
                    <ol className="mt-5 space-y-3 ">
                      {generationSteps.map((step, index) => {
                        const complete = index < generationStep;
                        const active = index === generationStep;
                        return (
                          <motion.li
                            key={step}
                            initial={{ opacity: 0, x: 12 }}
                            animate={{
                              opacity: complete || active ? 1 : 0.48,
                              x: 0,
                            }}
                            transition={{ delay: index * 0.08 }}
                            className={`flex items-center gap-3 rounded-xl px-3 py-3 ${
                              active ? "bg-white shadow-sm" : ""
                            }`}
                          >
                            <span
                              className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${
                                complete
                                  ? "border-emerald-500 bg-emerald-500 text-white"
                                  : active
                                    ? "border-blue-500 text-blue-600"
                                    : "border-slate-300 bg-white text-slate-300"
                              }`}
                            >
                              {complete ? (
                                <Check className="size-3.5" />
                              ) : active ? (
                                <LoaderCircle className="size-3.5 animate-spin" />
                              ) : (
                                <span className="size-1.5 rounded-full bg-current" />
                              )}
                            </span>
                            <span
                              className={`flex-1 text-sm ${
                                active
                                  ? "font-medium text-slate-800"
                                  : "text-slate-500"
                              }`}
                            >
                              {step}
                            </span>
                            {active && (
                              <motion.span
                                aria-hidden="true"
                                animate={{ x: [0, 3, 0] }}
                                transition={{ duration: 1.1, repeat: Infinity }}
                                className="text-slate-400"
                              >
                                <ArrowRight className="size-4" />
                              </motion.span>
                            )}
                          </motion.li>
                        );
                      })}
                    </ol>
                  </motion.div>
                ) : roadmap ? (
                  <motion.div
                    key="roadmap"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-5xl py-8"
                  >
                    <div className="mx-auto mb-8 max-w-2xl text-center">
                      <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <Milestone className="size-5" />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                        Your personalized learning roadmap
                      </p>
                      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        {roadmap.title}
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {roadmap.summary}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
                        <CalendarDays className="size-3.5 text-blue-600" />
                        {durationMonths}-month learning journey
                      </div>
                      <p className="mt-3 text-xs font-medium text-slate-500">
                        8 learning milestones
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 perspective-distant ">
                      {roadmap.milestones.map((milestone, index) => (
                        <motion.article
                          key={`section-${index + 1}`}
                          custom={index}
                          variants={milestoneVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover={{ y: -4, rotateX: 1 }}
                          style={{ transformPerspective: 1000 }}
                          className="h-full"
                        >
                          <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_35px_-26px_rgba(31,53,91,0.5)] transition-shadow hover:shadow-[0_20px_40px_-24px_rgba(49,83,151,0.3)] sm:p-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700">
                                <CalendarDays className="size-3.5" />
                                Month {milestone.month}
                              </span>
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                                Section {index + 1} / 8
                              </span>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">
                              {milestone.title}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              {milestone.focus}
                            </p>
                            <div className="mt-4 rounded-xl bg-blue-50/70 p-4">
                              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-800">
                                <Target className="size-3.5" />
                                Your milestone
                              </p>
                              <p className="mt-2 text-sm leading-5 text-slate-700">
                                {milestone.outcome}
                              </p>
                            </div>
                            <ul className="mt-4 space-y-2.5">
                              {milestone.activities.map((activity) => (
                                <li
                                  key={activity}
                                  className="flex items-start gap-2.5 text-sm leading-5 text-slate-600"
                                >
                                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                    <Check className="size-3" />
                                  </span>
                                  {activity}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.article>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4 }}
                    className="relative z-10 mx-auto w-full max-w-2xl text-center"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.55, delay: 0.1 }}
                    >
                      <h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                        Welcome to your personalised
                        <br className="hidden sm:block" /> learning roadmap
                      </h2>
                      <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                        Follow the right steps toward your learning goal. Start
                        with an idea or tell us what you want to achieve.
                      </p>
                    </motion.div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
