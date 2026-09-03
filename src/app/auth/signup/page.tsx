/* eslint-disable @next/next/no-img-element */
"use client"

import { SignupForm } from "@/components/auth/signup-form"
import { siteConfig } from "@/config/site"
import { MarqueeDemo } from "@/components/ui/marquee-demo";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  return (
    <div className="grid h-svh overflow-hidden lg:grid-cols-[45%_55%]">
      {/* Left Side */}
      <div className="flex h-full flex-col gap-4 overflow-y-auto p-6 md:p-10 scrollbar-hide bg-[#FAF9F6]">
        <div className="flex justify-center gap-2 md:justify-start">
          <a
            href={siteConfig.url}
            className="flex items-center gap-1.5 font-medium text-black"
          >
            <div className="flex size-7 items-center justify-center rounded-md">
              <img src="/TalenzoX_logo.png" alt="logo" width={35} />
            </div>
            <span className="text-[17px]">{siteConfig.name}</span>
            
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center ">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="relative hidden h-svh bg-muted lg:block">
        {/* right box */}
        <div className="relative hidden overflow-hidden lg:block">
        {/* Background */}
        <div className="relative h-dvh w-full bg-blue-700">
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at 70% 20%, rgba(90,70,200,0.85), transparent 70%),
                radial-gradient(ellipse 70% 60% at 20% 80%, rgba(40,120,220,0.75), transparent 70%),
                radial-gradient(ellipse 65% 55% at 60% 65%, rgba(0,180,255,0.55), transparent 70%),
                radial-gradient(ellipse 65% 40% at 50% 60%, rgba(180,60,200,0.45), transparent 70%),
                linear-gradient(180deg, #0f172a 0%, #1e3a8a 100%)
              `,
            }}
          />


          {/* Heading */}
          <div className="absolute left-1/2 top-[32%] w-full -translate-x-1/2 -translate-y-1/2 px-8 ">
            <div className="z-10 flex min-h-30 items-center justify-center">
              <div
                className={cn(
                  "group rounded-full border border-black/5 bg-neutral-100/30 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-white/45 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
                )}
              >
                <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                  <span className="text-white/80">✨ Introducing TalenzoX</span>
                  <ChevronRight className="ml-1 size-3 text-white/80 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                </AnimatedShinyText>
              </div>
            </div>

            <div className="w-full flex items-center justify-center mb-4">
              <span>
                <img src="/TalenzoX_logo_white.png" alt="" width={100} />
              </span>
            </div>

            <h1 className="text-center font-sora text-[58px] font-bold leading-tight tracking-wide text-white/80">
              “Action Today,
              <br />
              <span>Success Tomorrow.”</span>
            </h1>
          </div>

          {/* Bottom Marquee */}
          <div className="absolute bottom-2 w-full">
            <MarqueeDemo />
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}