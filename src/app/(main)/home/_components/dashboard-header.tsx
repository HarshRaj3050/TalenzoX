"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

interface DashboardHeaderProps {
  userName?: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function DashboardHeader({
  userName = "Username",
  searchQuery,
  onSearchChange,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141721] flex items-center gap-2">
          Welcome back {userName}
        </h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search anything"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-full border border-gray-200/80 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-[#d4f938] focus:border-transparent transition-all placeholder:text-gray-400"
          />
        </div>

        {/* User Avatar */}
        <div className="relative shrink-0 cursor-pointer">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full p-[2px] bg-gradient-to-tr from-[#c084fc] to-[#f472b6] shadow-sm hover:scale-105 transition-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://plus.unsplash.com/premium_photo-1677252438411-9a930d7a5168?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="User Avatar"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#10b981] border-2 border-white rounded-full" />
        </div>
      </div>
    </header>
  );
}
