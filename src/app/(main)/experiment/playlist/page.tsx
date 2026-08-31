"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AppSidebar } from "@/app/(main)/_components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, Check, CheckCircle2, Clock, FlaskConical, Play, Sparkles, X } from "lucide-react";

type Lesson = { id: number; title: string; category: string; duration: string; lessons: number; description: string; image: string; href?: string; completed?: boolean };

const initialLessons: Lesson[] = [
  { id: 1, title: "How does a laptop work?", category: "Technology", duration: "6 min", lessons: 4, description: "Meet the screen, processor, RAM, battery, and storage working together inside a laptop.", image: "/images/hero_image_2.avif", href: "/experiment" },
  { id: 2, title: "Volcanoes: pressure in action", category: "Earth Science", duration: "8 min", lessons: 5, description: "Discover how magma, pressure, and gases shape a volcano before an eruption.", image: "/images/hero_image_3.avif" },
  { id: 3, title: "A tour of the human heart", category: "Biology", duration: "7 min", lessons: 4, description: "Follow the journey of blood through the heart and learn why your heartbeat matters.", image: "/images/hero_image_4.avif" },
  { id: 4, title: "Plants making their own food", category: "Nature", duration: "5 min", lessons: 3, description: "See how sunlight, water, and air help a plant grow through photosynthesis.", image: "/images/hero_image_5.avif" },
  { id: 5, title: "The invisible world of magnets", category: "Physics", duration: "6 min", lessons: 4, description: "Explore magnetic fields, poles, and the invisible forces that push and pull.", image: "/images/hero_image_6.avif" },
  { id: 6, title: "Electricity on the move", category: "Physics", duration: "8 min", lessons: 5, description: "Build the idea of a circuit and learn how a switch controls electric flow.", image: "/images/hero_image_7.avif" },
];

export default function ExperimentPlaylistPage() {
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    if (typeof window === "undefined") return initialLessons;
    const saved = window.localStorage.getItem("talenzo-experiment-playlist");
    if (!saved) return initialLessons;
    const completed = JSON.parse(saved) as number[];
    return initialLessons.map((lesson) => ({ ...lesson, completed: completed.includes(lesson.id) }));
  });
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  function toggleCompleted(id: number) {
    setLessons((current) => {
      const next = current.map((lesson) => lesson.id === id ? { ...lesson, completed: !lesson.completed } : lesson);
      window.localStorage.setItem("talenzo-experiment-playlist", JSON.stringify(next.filter((lesson) => lesson.completed).map((lesson) => lesson.id)));
      setActiveLesson((active) => active?.id === id ? { ...active, completed: !active.completed } : active);
      return next;
    });
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative flex h-screen max-h-screen flex-col overflow-hidden bg-transparent">
        <header className="relative z-10 flex h-16 shrink-0 items-center gap-2 border-b-2 border-black bg-white px-4 transition-[width,height] ease-linear dark:bg-background group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <SidebarTrigger className="-ml-1" /><Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb><BreadcrumbList><BreadcrumbItem className="hidden md:block"><BreadcrumbLink href="/home">TalenzoX</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbLink href="/experiment">Experiment</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>Video Playlist</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
        </header>
        <main className="relative z-10 mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-6 overflow-y-auto p-6 pb-10 scrollbar-none">
          <section className="flex shrink-0 flex-col items-start justify-between gap-4 rounded-2xl border bg-white p-6 shadow-xs md:flex-row md:items-center dark:bg-card">
            <div className="flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20"><FlaskConical className="h-6 w-6" /></div><div><div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-bold tracking-tight">Experiment Discovery Playlist</h1><span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary"><Sparkles className="h-3 w-3" /> Ages: 7 to 12</span></div><p className="mt-1 text-sm text-muted-foreground">Short visual lessons to spark your next hands-on experiment.</p></div></div>
            <div className="text-right"><p className="text-xs text-muted-foreground">Completed</p><p className="text-sm font-semibold">{lessons.filter((lesson) => lesson.completed).length} / {lessons.length} Lessons</p></div>
          </section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{lessons.map((lesson) => <motion.article key={lesson.id} whileHover={{ y: -2 }} transition={{ duration: .18 }} className="group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card/80 shadow-xs backdrop-blur-xs transition-all duration-200 hover:border-primary/40 hover:shadow-md"><button onClick={() => setActiveLesson(lesson)} className="relative aspect-video w-full cursor-pointer overflow-hidden bg-muted text-left"><Image src={lesson.image} alt={lesson.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" /><div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" /><div className="absolute left-2 right-2 top-2 flex items-center justify-between"><span className="rounded-md border border-white/10 bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">{lesson.category}</span><span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-black/60 px-2 py-0.5 text-[10px] text-white"><Clock className="h-3 w-3" /> {lesson.duration}</span></div><div className="absolute inset-0 flex items-center justify-center"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-md shadow-black/40"><Play className="ml-0.5 h-4 w-4 fill-current" /></span></div><div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white/90"><span className="rounded border border-white/10 bg-black/60 px-1.5 py-0.5">Video lesson</span><span className="rounded border border-white/10 bg-black/60 px-1.5 py-0.5">{lesson.lessons} discoveries</span></div></button><div className="flex flex-1 flex-col justify-between p-3.5"><div><h2 className="line-clamp-1 text-sm font-semibold tracking-tight transition-colors group-hover:text-primary">{lesson.title}</h2><p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{lesson.description}</p></div><div className="mt-3 flex items-center justify-between border-t pt-2.5"><span className="text-[11px] font-medium text-muted-foreground">{lesson.duration}</span><Button size="sm" variant={lesson.completed ? "outline" : "default"} onClick={() => setActiveLesson(lesson)} className="h-7 gap-1.5 rounded-lg px-2.5 text-xs"><Play className="h-3 w-3 fill-current" />{lesson.completed ? "Review" : "Start"}<ArrowRight className="h-3 w-3" /></Button></div></div></motion.article>)}</div>
        </main>
        <AnimatePresence>{activeLesson && <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md" onClick={() => setActiveLesson(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label={activeLesson.title}><motion.div onClick={(event) => event.stopPropagation()} initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .92 }} className="w-full max-w-3xl overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-2xl"><div className="flex items-center justify-between border-b bg-muted/30 px-5 py-3.5"><div><span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{activeLesson.category}</span><h2 className="mt-2 text-base font-semibold">{activeLesson.title}</h2></div><button onClick={() => setActiveLesson(null)} className="rounded-full bg-muted/60 p-2 text-muted-foreground hover:text-foreground" aria-label="Close lesson"><X className="h-5 w-5" /></button></div><div className="relative aspect-video bg-black"><Image src={activeLesson.image} alt="" fill className="object-cover opacity-70" sizes="100vw" /><div className="absolute inset-0 flex items-center justify-center"><span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground"><Play className="ml-1 h-7 w-7 fill-current" /></span></div></div><div className="flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center"><div><p className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5 text-primary" /> {activeLesson.duration} <span>â€¢</span> {activeLesson.lessons} structured discoveries</p><p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{activeLesson.description}</p></div><div className="flex w-full shrink-0 gap-2 sm:w-auto"><Button variant={activeLesson.completed ? "default" : "outline"} size="sm" onClick={() => toggleCompleted(activeLesson.id)} className="gap-1.5 rounded-xl">{activeLesson.completed ? <><Check className="h-4 w-4" /> Completed</> : <><CheckCircle2 className="h-4 w-4" /> Mark complete</>}</Button>{activeLesson.href ? <Link href={activeLesson.href} className={buttonVariants({ size: "sm", className: "gap-1.5 rounded-xl" })}>Try it <ArrowRight className="h-4 w-4" /></Link> : <Button size="sm" variant="secondary" onClick={() => setActiveLesson(null)} className="rounded-xl">Done</Button>}</div></div></motion.div></motion.div>}</AnimatePresence>
      </SidebarInset>
    </SidebarProvider>
  );
}

