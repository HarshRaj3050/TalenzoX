"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { AppSidebar } from "@/app/(main)/_components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Inner Dashboard Components
import { DashboardHeader } from "./_components/dashboard-header";
import { DailyActivity } from "./_components/daily-activity";
import { HoursActivity } from "./_components/hours-activity";
import { DailySchedule } from "./_components/daily-schedule";
import { CoursesTaking } from "./_components/courses-taking";
import { CalendarWidget } from "./_components/calendar-widget";
import { AssignmentsWidget } from "./_components/assignments-widget";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type UserProfile = {
  full_name?: string;
  email?: string;
  id?: string;
  [key: string]: unknown;
};

export default function Page() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const getUser = async () => {
      try {
        const { data } = await api.get("/getUser");
        const parsedData = typeof data === "string" ? JSON.parse(data) : data;

        if (isMounted) {
          setUser(parsedData as UserProfile | null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        if (isMounted) {
          setUser(null);
        }
      }
    };

    getUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const userName = user?.full_name?.split(" ")[0] || "Taylor";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f8f9fc]">
        {/* Navigation Bar (Preserved) */}

        <SidebarTrigger className="-ml-1 absolute top-8 left-8 p-4 bg-white z-11 shadow-sm cursor-pointer" />

        {/* Dashboard Inner Side Container */}
        <div className="flex-1 p-4 sm:p-6 lg:p-4 flex flex-col gap-6 lg:gap-8 max-w-375 w-full mx-auto">
          {/* Header (Welcome + Search + Profile Avatar) */}

          <DashboardHeader
            userName={userName}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <div className="w-full">
            <div className="relative overflow-hidden max-h-60 min-h-60 rounded-[30px] border border-white/50 bg-[#8ed9ff] shadow-[0_20px_45px_-20px_rgba(12,34,54,0.45)] flex items-center p-6 sm:p-8">
              <div className="absolute inset-0">
                <Image
                  src="/dashboard/dashboard_behaviour.png"
                  alt="behaviour test"
                  className="h-full w-full object-cover object-top"
                  fill
                  priority
                />
              </div>
              <div className="relative z-10 w-full h-60 top-10">
                <div className="absolute lg:left-100 left-0 top-0 flex flex-col items-center">
                  <p className="text-2xl sm:text-5xl  font-bold text-[#00084f]">
                    Behaviour Test
                  </p>
                  <p className="text-2xl sm:text-2xl font-bold text-[#00084f]">
                    Small choices. A kinder you!
                  </p>
                  <p className="text-2xl sm:text-lg font-bold text-[#a09f9f]">
                    Let&apos;s see how you handle different situation.
                  </p>
                  <Link
                    href="/behaviour_test"
                    className="bg-[#ff0099] px-6 py-2 rounded-full mt-2 text-white cursor-pointer flex gap-1 items-center shadow-[0_5px_0_#c90078] hover:translate-y-[2px] hover:shadow-[0_3px_0_#c90078] transition-all"
                  >
                    Start Test{" "}
                    <span>
                      <ArrowRight />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Core Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Left 8 Cols (Daily Activity, Activity Chart, Daily Schedule, Enrolled Courses) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* 1. Daily Activity */}
              <DailyActivity />

              {/* 2. Middle Row: Hours Activity + Daily Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-7">
                  <HoursActivity />
                </div>
                <div className="md:col-span-5">
                  <DailySchedule />
                </div>
              </div>

              {/* 3. Course You're Taking */}
              <CoursesTaking onAddCourse={() => setIsModalOpen(true)} />
            </div>

            {/* Right 4 Cols (Go Premium, Calendar, Assignments) */}
            <div className="lg:col-span-4 flex flex-col gap-6 ">
              {/* 2. Calendar Widget */}
              <CalendarWidget />

              {/* 3. Assignments Widget */}
              <AssignmentsWidget onAddAssignment={() => setIsModalOpen(true)} />
            </div>
          </div>
        </div>

        {/* Action Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#d4f938] text-black flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#141721]">
                  TalenzoX Premium
                </h3>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  Unlock 25,000+ top industry courses, 1-on-1 mentorship,
                  certified credentials, and offline access.
                </p>

                <div className="mt-6 flex flex-col gap-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full bg-[#151722] hover:bg-black text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Start 14-Day Free Trial
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    Maybe Later
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </SidebarInset>
    </SidebarProvider>
  );
}
