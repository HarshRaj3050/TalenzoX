/* eslint-disable react/no-unescaped-entities */
"use client";

import Image from "next/image";
import { ArrowRight, Bell } from "lucide-react";
import { Balsamiq_Sans } from "next/font/google";
import Link from "next/link";

const balsamiq = Balsamiq_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

interface DashboardHeaderProps {
  userName?: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function DashboardHeader({
  userName = "Username",
}: DashboardHeaderProps) {
  return (
    <header className="relative overflow-hidden max-h-60 min-h-60 rounded-[30px] border border-white/50 bg-[#8ed9ff] shadow-[0_20px_45px_-20px_rgba(12,34,54,0.45)]">
      <div className="absolute inset-0">
        <Image
          src="/dashboard/dashboard_nav.png"
          alt="Welcome kids illustration"
          fill
          priority
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 bg-linear-to-r from-[#8ed9ff]/20 via-[#8ed9ff]/5 to-[#8ed9ff]/5" />

      <div className="relative z-10 flex flex-col gap-5 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/80 text-slate-700 shadow-[0_6px_20px_-10px_rgba(15,23,42,0.5)] transition hover:scale-[1.02]"
          >
            <Bell className="h-4 w-4" />
          </button>

          <div className="relative shrink-0 cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/70 bg-gradient-to-tr from-[#c084fc] to-[#f472b6] shadow-[0_6px_20px_-10px_rgba(15,23,42,0.5)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://plus.unsplash.com/premium_photo-1677252438411-9a930d7a5168?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="User Avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#10b981]" />
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-end  ">
          <div className="max-w-xl absolute left-[25vw] top-10">
            <h1
              className={`${balsamiq.className} text-3xl font-black leading-[0.9] tracking-[-0.04em] text-[#00084f] drop-shadow-[0_4px_10px_rgba(34,58,89,0.16)] sm:text-5xl lg:text-6xl`}
            >
              Welcome back,
              <span className="mt-1 block pl-25 text-[#aa00ff]">
                {userName}!
              </span>
            </h1>
            <p
              className={`${balsamiq.className} hidden mt-3 pl-5 max-w-md text-base font-bold text-[#121212] sm:text-lg`}
            >
              Ready to learn something amazing today?
            </p>
          </div>

          <div className="hidden absolute right-2 top-24 w-85 rounded-[28px] bg-white/80 shadow-[0_12px_30px_-15px_rgba(15,23,42,0.45)] backdrop-blur-sm lg:block">
            <div className="relative flex items-center justify-between overflow-hidden">
              <div className="pl-5 py-4">
                <p className={`${balsamiq.className} text-[1.05rem] leading-[1.1] font-bold text-[#2a3e53]`}>
                  "Every skill you learn
                  <span className="block text-[#8a7dff]">
                    today builds a brighter
                  </span>
                  tomorrow!"
                </p>

                <Link href="/ai-assistant">
                  <button
                    type="button"
                    className={`${balsamiq.className} mt-3 inline-flex items-center gap-2 rounded-full bg-linear-to-r cursor-pointer from-[#7c6cf8] to-[#8f7af5] px-3 py-1.5 text-sm text-white shadow-[0_10px_18px_-10px_rgba(124,108,248,0.9)] transition hover:brightness-105`}
                  >
                    Chat with AI Buddy <ArrowRight  />
                    <span className="h-3 "></span>
                  </button>
                </Link>
              </div>

              <div className="h-35 w-35 shrink-0 absolute right-0">
                <Image
                  src="/dashboard/dashboard_robo.png"
                  alt="AI robot illustration"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
