"use client";

import React from "react";
import Image from "next/image";

interface GoPremiumProps {
  onGetAccess?: () => void;
}

export function GoPremium({ onGetAccess }: GoPremiumProps) {
  return (
    <div className="bg-[#151722] rounded-3xl p-5 sm:p-6 text-white relative overflow-hidden shadow-xl min-h-[160px] flex flex-col justify-between">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-2 relative z-10">
        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#c8f53a] to-white flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full border-2 border-[#151722] border-t-transparent -rotate-45" />
        </div>
        <span className="text-xs font-extrabold text-white tracking-wide">TalenzoX</span>
      </div>

      {/* Card Content (Left Column) */}
      <div className="relative z-10 max-w-[58%]">
        <h3 className="text-xl font-black text-white leading-tight">Go Premium</h3>
        <p className="text-[11px] text-gray-300 mt-1 font-medium leading-normal">
          Explore 25k+ courses with lifetime membership
        </p>
        <button
          onClick={onGetAccess}
          className="mt-3.5 bg-[#d4f938] hover:bg-[#c5ec2d] text-[#12141c] font-black text-xs px-4 py-2 rounded-full transition-all duration-150 shadow-md shadow-[#d4f938]/20 cursor-pointer active:scale-95 inline-block"
        >
          Get Access
        </button>
      </div>

      {/* Absolutely Positioned Pro Image (Keeps card compact while image is large) */}
      <div className="absolute right-5 bottom-3 w-32 h-32 sm:w-38 sm:h-38 pointer-events-none flex items-center justify-center">
        <Image
          src="/dashboard/dashboard_pro.png"
          alt="TalenzoX Pro"
          width={240}
          height={240}
          className="w-full h-full object-contain drop-shadow-2xl"
          priority
        />
      </div>
    </div>
  );
}
