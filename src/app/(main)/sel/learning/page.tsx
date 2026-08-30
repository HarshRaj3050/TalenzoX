"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  X,
  ArrowRight,
  Sparkles,
  Maximize2,
  Share2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Module {
  id: number;
  title: string;
  category: string;
  duration: string;
  lessons: number;
  completed: boolean;
  description: string;
  youtubeId: string;
  thumbnailUrl?: string;
}

const initialModules: Module[] = [
  {
    id: 1,
    title: "Understanding Emotional Triggers",
    category: "Self-Awareness",
    duration: "16 min",
    lessons: 4,
    completed: false,
    description:
      "Identify how internal thoughts and external events trigger physiological and emotional reactions.",
    youtubeId: "Vs-MyQgfH3A",
    thumbnailUrl: "https://img.youtube.com/vi/Vs-MyQgfH3A/hqdefault.jpg",
  },
  {
    id: 2,
    title: "Mastering Active Empathy",
    category: "Social Awareness",
    duration: "12 min",
    lessons: 5,
    completed: false,
    description:
      "Techniques for deep empathetic listening and connecting with others' emotional perspectives.",
    youtubeId: "1Evwgu369Jw",
    thumbnailUrl: "https://img.youtube.com/vi/1Evwgu369Jw/hqdefault.jpg",
  },
  {
    id: 3,
    title: "Constructive Conflict Resolution",
    category: "Relationship Skills",
    duration: "15 min",
    lessons: 6,
    completed: false,
    description:
      "Transform tense interpersonal disagreements into collaborative problem-solving opportunities.",
    youtubeId: "o_9yPzAW6yc",
    thumbnailUrl: "https://img.youtube.com/vi/o_9yPzAW6yc/hqdefault.jpg",
  },
  {
    id: 4,
    title: "Mindful Stress Regulation",
    category: "Self-Management",
    duration: "14 min",
    lessons: 4,
    completed: false,
    description:
      "Practical cognitive reframing and autonomic nervous system calming protocols under acute pressure.",
    youtubeId: "inpok4MKVLM",
    thumbnailUrl: "https://img.youtube.com/vi/inpok4MKVLM/hqdefault.jpg",
  },
];

export default function LearningPage() {
  const [modulesList, setModulesList] = useState<Module[]>(initialModules);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);

  const handleOpenModule = (
    moduleItem: Module,
    e: React.MouseEvent<HTMLElement>
  ) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setButtonRect(rect);
    setActiveModule(moduleItem);
  };

  const handleCloseModal = () => {
    setActiveModule(null);
  };

  const toggleModuleCompletion = (moduleId: number) => {
    setModulesList((prev) =>
      prev.map((mod) =>
        mod.id === moduleId ? { ...mod, completed: !mod.completed } : mod
      )
    );
    if (activeModule && activeModule.id === moduleId) {
      setActiveModule((prev) =>
        prev ? { ...prev, completed: !prev.completed } : null
      );
    }
  };

  const getTransformOrigin = () => {
    if (!buttonRect) return "center center";
    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;
    return `${centerX}px ${centerY}px`;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    };
    if (activeModule) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [activeModule]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative h-screen max-h-screen overflow-hidden flex flex-col bg-transparent">
        <GradientPurpleBackground />
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
                  <BreadcrumbPage>Learning</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="relative z-10 flex flex-1 flex-col overflow-y-auto min-h-0 p-6 max-w-7xl mx-auto w-full gap-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-10">
          {/* Header Banner */}
          <div className="shrink-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl border bg-white from-primary/10 via-background to-muted/40 p-6 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight">
                    Social Emotional Learning Curriculum
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    <Sparkles className="h-3 w-3" /> Interactive Video Modules
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Master emotional intelligence, active empathy, and mindful conflict navigation with video lessons.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-sm font-semibold">
                  {modulesList.filter((m) => m.completed).length} / {modulesList.length} Modules
                </p>
              </div>
            </div>
          </div>

          {/* Video Modules Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modulesList.map((mod) => {
              const thumbnailSrc =
                mod.thumbnailUrl ||
                `https://img.youtube.com/vi/${mod.youtubeId}/hqdefault.jpg`;

              return (
                <motion.div
                  key={mod.id}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.18 }}
                  className="group relative flex flex-col justify-between rounded-xl border bg-card/80 backdrop-blur-xs overflow-hidden shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-200"
                >
                  {/* Video Thumbnail Preview */}
                  <div
                    onClick={(e) => handleOpenModule(mod, e)}
                    className="relative w-full aspect-[16/9] overflow-hidden bg-muted cursor-pointer"
                  >
                    <Image
                      src={thumbnailSrc}
                      alt={mod.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    {/* Category & Completed Badges */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                      <span className="inline-flex items-center rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-medium text-white border border-white/10">
                        {mod.category}
                      </span>
                      {mod.completed ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-medium text-white shadow-xs">
                          <CheckCircle2 className="h-3 w-3" /> Done
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-medium text-white/90 border border-white/10">
                          <Clock className="h-3 w-3" /> {mod.duration}
                        </span>
                      )}
                    </div>

                    {/* Central Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.92 }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-md shadow-black/40 backdrop-blur-xs border border-white/20 transition-transform duration-150 group-hover:bg-primary"
                      >
                        <Play className="h-4 w-4 fill-current ml-0.5" />
                      </motion.div>
                    </div>

                    {/* Bottom Info inside thumbnail */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white/90">
                      <span className="inline-flex items-center gap-1 backdrop-blur-md bg-black/60 px-1.5 py-0.5 rounded text-[10px] text-white/90 border border-white/10">
                        <Play className="h-2 w-2 fill-current" /> Video
                      </span>
                      <span className="backdrop-blur-md bg-black/60 px-1.5 py-0.5 rounded text-[10px] text-white/80">
                        {mod.lessons} Lessons
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-1 flex-col justify-between p-3.5">
                    <div>
                      <h3 className="text-sm font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {mod.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {mod.description}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5">
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {mod.duration}
                      </span>
                      <motion.div whileTap={{ scale: 0.95 }}>
                        <Button
                          size="sm"
                          variant={mod.completed ? "outline" : "default"}
                          onClick={(e) => handleOpenModule(mod, e)}
                          className="h-7 text-xs px-2.5 rounded-lg shadow-xs hover:cursor-pointer font-medium gap-1.5"
                        >
                          <Play className="h-3 w-3 fill-current" />
                          {mod.completed ? "Review" : "Start"}
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </main>

        {/* Animated Video Modal */}
        <AnimatePresence>
          {activeModule && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/80 backdrop-blur-md"
              onClick={handleCloseModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24 }}
              role="dialog"
              aria-modal="true"
              aria-label={activeModule.title}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.15 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.15 }}
                transition={{
                  duration: 0.38,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transformOrigin: getTransformOrigin() }}
                className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-card border border-border/70 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl text-card-foreground"
              >
                {/* Modal Top Bar */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b bg-muted/30">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary shrink-0">
                      {activeModule.category}
                    </span>
                    <h2 className="text-sm sm:text-base font-semibold truncate">
                      {activeModule.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleCloseModal}
                      className="p-1.5 sm:p-2 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                      aria-label="Close modal"
                      title="Close (Esc)"
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                </div>

                {/* 16:9 Video Frame */}
                <div className="relative w-full aspect-video bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${activeModule.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title={activeModule.title}
                  />
                </div>

                {/* Modal Bottom Detail & Interactive Controls */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card/60">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="h-3.5 w-3.5 text-primary" /> {activeModule.duration}
                      </span>
                      <span>•</span>
                      <span>{activeModule.lessons} Structured Lessons</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {activeModule.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 justify-end">
                    <Button
                      variant={activeModule.completed ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleModuleCompletion(activeModule.id)}
                      className="gap-1.5 text-xs sm:text-sm cursor-pointer rounded-xl"
                    >
                      {activeModule.completed ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-300" /> Completed
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" /> Mark as Completed
                        </>
                      )}
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleCloseModal}
                      className="text-xs sm:text-sm cursor-pointer rounded-xl"
                    >
                      Done
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarInset>
    </SidebarProvider>
  );
}

