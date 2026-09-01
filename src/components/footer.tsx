"use client";

import { CinematicFooter } from "@/components/ui/motion-footer";

export default function Footer() {
  return (
    <div className="relative w-full bg-background min-h-screen font-sans selection:bg-white/20 overflow-x-hidden">

      {/* 
        MAIN CONTENT AREA 
        We use a high z-index and minimum height to allow the user 
        to scroll down and reveal the footer securely underneath.
      */}
      <main className="relative z-10 w-full min-h-[120vh] bg-background flex flex-col items-center justify-center text-white border-b border-white/10 shadow-md rounded-b-3xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(255,255,255,0.03)_0%,transparent_60%)] pointer-events-none" />

        <div className="w-full md:max-w-[140vh] px-4">
          <div className="relative overflow-hidden rounded-2xl">
            <div className="aspect-video w-full">
              <video
                src="/video/Intro.mp4"
                className="h-full w-full object-cover"
                autoPlay

                loop
                playsInline
                controls={false}
              />
            </div>
          </div>
        </div>

        
      </main>

      {/* The Cinematic Footer is injected here */}
      <CinematicFooter />
      
    </div>
  );
}