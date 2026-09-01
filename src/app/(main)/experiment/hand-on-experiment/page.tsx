/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { AppSidebar } from "@/app/(main)/_components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState<{
    title: string;
    src: string;
  } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const iframeContainerRef = useRef<HTMLDivElement | null>(null);
  const loadingTimerRef = useRef<number | null>(null);
  const loadingStartedAtRef = useRef<number>(0);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
      if (loadingTimerRef.current) {
        window.clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
      return;
    }

    setIsLoading(true);
    loadingStartedAtRef.current = Date.now();

    if (loadingTimerRef.current) {
      window.clearTimeout(loadingTimerRef.current);
    }

    const timer = window.setTimeout(() => {
      setIsLoading(false);
      loadingTimerRef.current = null;
    }, 4000);
    loadingTimerRef.current = timer;

    return () => {
      if (loadingTimerRef.current) {
        window.clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
    };
  }, [isOpen, selectedExperiment?.src]);

  const finishLoading = () => {
    if (!loadingTimerRef.current) {
      setIsLoading(false);
      return;
    }

    const elapsed = Date.now() - loadingStartedAtRef.current;
    const remaining = Math.max(0, 4000 - elapsed);

    window.clearTimeout(loadingTimerRef.current);
    loadingTimerRef.current = window.setTimeout(() => {
      setIsLoading(false);
      loadingTimerRef.current = null;
    }, remaining);
  };

  const toggleFullscreen = async () => {
    if (!iframeContainerRef.current) return;

    try {
      const element = iframeContainerRef.current;

      if (document.fullscreenElement === element) {
        await document.exitFullscreen();
      } else {
        await element.requestFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen toggle failed:", error);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative flex h-screen max-h-screen flex-col overflow-hidden bg-transparent">
        <header className="relative z-10 flex h-16 shrink-0 items-center gap-2 border-b-2 border-black bg-white px-4 transition-[width,height] ease-linear dark:bg-background group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/home">TalenzoX</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/experiment">Experiment</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Hands-on Experiment</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="relative z-10 mx-auto w-full flex-1 overflow-y-auto">
          <div className="min-h-full  bg-white p-6 text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Hands-on Experiments
              </h1>
              <div className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700">
                1 experiment ready
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedExperiment({
                    title: "My Solar System",
                    src: "https://phet.colorado.edu/sims/html/my-solar-system/latest/my-solar-system_en.html",
                  });
                  setIsOpen(false);
                  requestAnimationFrame(() => setIsOpen(true));
                }}
                className="group relative overflow-hidden rounded-3xl border border-violet-200 bg-linear-to-br from-violet-600 via-indigo-600 to-sky-600 p-[1px] text-left shadow-lg shadow-violet-500/20 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/25"
              >
                <div className="h-full rounded-[calc(1.5rem-1px)] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_45%),linear-gradient(135deg,#0f172a,#111827_40%,#312e81)] p-6">
                  <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-violet-100">
                    Physics Lab
                  </div>

                  <h2 className="text-2xl font-semibold text-white">
                    My Solar System
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-6 text-slate-200">
                    Explore orbital motion, gravity, and planetary dynamics in
                    an interactive simulation.
                  </p>

                  <div className="mt-6 flex items-center justify-between text-violet-100">
                    <span className="font-medium">Open experiment</span>
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg transition group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedExperiment({
                    title: "Density",
                    src: "https://phet.colorado.edu/sims/html/density/latest/density_en.html",
                  });
                  setIsOpen(false);
                  requestAnimationFrame(() => setIsOpen(true));
                }}
                className="group relative overflow-hidden rounded-3xl border border-emerald-200 bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-600 p-[1px] text-left shadow-lg shadow-emerald-500/20 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/25"
              >
                <div className="h-full rounded-[calc(1.5rem-1px)] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_45%),linear-gradient(135deg,#042f2e,#0f172a_35%,#0f766e)] p-6">
                  <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-100">
                    Chemistry Lab
                  </div>

                  <h2 className="text-2xl font-semibold text-white">Density</h2>
                  <p className="mt-3 max-w-md text-sm leading-6 text-slate-200">
                    Investigate how different materials and liquids behave based
                    on density and buoyancy.
                  </p>

                  <div className="mt-6 flex items-center justify-between text-emerald-100">
                    <span className="font-medium">Open game</span>
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg transition group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedExperiment({
                    title: "Gravity and Orbits",
                    src: "https://phet.colorado.edu/sims/html/gravity-and-orbits/latest/gravity-and-orbits_en.html",
                  });
                  setIsOpen(false);
                  requestAnimationFrame(() => setIsOpen(true));
                }}
                className="group relative overflow-hidden rounded-3xl border border-amber-200 bg-linear-to-br from-amber-400 via-orange-500 to-rose-500 p-[1px] text-left shadow-lg shadow-amber-500/20 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/25"
              >
                <div className="h-full rounded-[calc(1.5rem-1px)] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_45%),linear-gradient(135deg,#451a03,#0f172a_35%,#9a5b00)] p-6">
                  <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-100">
                    Space Lab
                  </div>

                  <h2 className="text-2xl font-semibold text-white">
                    Gravity and Orbits
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-6 text-slate-200">
                    Explore how gravity shapes orbits and planetary motion in a
                    dynamic space environment.
                  </p>

                  <div className="mt-6 flex items-center justify-between text-amber-100">
                    <span className="font-medium">Open game</span>
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg transition group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedExperiment({
                    title: "Balancing Act",
                    src: "https://phet.colorado.edu/sims/html/balancing-act/latest/balancing-act_en.html",
                  });
                  setIsOpen(false);
                  requestAnimationFrame(() => setIsOpen(true));
                }}
                className="group relative overflow-hidden rounded-3xl border border-pink-200 bg-linear-to-br from-pink-500 via-fuchsia-500 to-violet-600 p-[1px] text-left shadow-lg shadow-pink-500/20 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/25"
              >
                <div className="h-full rounded-[calc(1.5rem-1px)] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_45%),linear-gradient(135deg,#4c0519,#0f172a_35%,#7e22ce)] p-6">
                  <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-pink-100">
                    Mechanics Lab
                  </div>

                  <h2 className="text-2xl font-semibold text-white">
                    Balancing Act
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-6 text-slate-200">
                    Test balance, torque, and force using masses and distances in
                    a hands-on physics challenge.
                  </p>

                  <div className="mt-6 flex items-center justify-between text-pink-100">
                    <span className="font-medium">Open game</span>
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg transition group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {isOpen && (
              <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-600">
                      Experiment
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-slate-900">
                      {selectedExperiment?.title ?? "My Solar System"}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700 transition hover:bg-violet-100"
                    >
                      {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div
                  ref={iframeContainerRef}
                  className="relative h-[70vh] min-h-130 overflow-hidden rounded-2xl bg-slate-950 p-2"
                >
                  {isLoading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950">
                      <div className="flex flex-col items-center gap-3 text-slate-200">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-600 border-t-violet-400" />
                        <p className="text-sm font-medium">
                          Loading simulation...
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="w-full h-full relative">
                    {/* don't remove the absolute div */}
                    <div className="absolute bg-white w-[12.8vh] h-[5.1vh] rounded-sm bottom-0 right-3 flex items-center justify-center">
                        <p className="font-extrabold text-center text-lg pb-1">TalenzoX</p>
                    </div>
                    <iframe
                      src={selectedExperiment?.src ?? "https://phet.colorado.edu/sims/html/my-solar-system/latest/my-solar-system_en.html"}
                      width="100%"
                      height="620"
                      allow="fullscreen"
                      allowFullScreen
                      title={selectedExperiment?.title ?? "My Solar System simulation"}
                      className="block w-full h-full rounded-2xl border-0"
                      onLoad={finishLoading}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
