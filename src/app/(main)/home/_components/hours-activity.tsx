"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ChevronDown } from "lucide-react";

interface ActivityBar {
  day: string;
  hours: number;
  label: string;
  date: string;
  emoji: string;
}

const ACTIVITY_DATA: ActivityBar[] = [
  { day: "Su", hours: 4.0, label: "4h 00 min", date: "2 Jan 2023", emoji: "😊" },
  { day: "Mo", hours: 6.2, label: "6h 15 min", date: "3 Jan 2023", emoji: "⚡" },
  { day: "Tu", hours: 3.5, label: "3h 30 min", date: "4 Jan 2023", emoji: "🔥" },
  { day: "We", hours: 8.75, label: "8h 45 min", date: "5 Jan 2023", emoji: "😍" },
  { day: "Th", hours: 5.8, label: "5h 50 min", date: "6 Jan 2023", emoji: "🎯" },
  { day: "Fr", hours: 2.5, label: "2h 30 min", date: "7 Jan 2023", emoji: "☕" },
  { day: "Sa", hours: 5.2, label: "5h 10 min", date: "8 Jan 2023", emoji: "🚀" },
];

export function HoursActivity() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(3); // Wednesday (active)
  const [timeframe, setTimeframe] = useState("Weekly");

  return (
    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="font-bold text-base text-[#141721]">Hours Activity</h3>
          <button
            onClick={() => setTimeframe(timeframe === "Weekly" ? "Monthly" : "Weekly")}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 px-3 py-1 rounded-full border border-gray-100 transition-colors cursor-pointer"
          >
            <span>{timeframe}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#16a34a] font-semibold mb-6">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+3% Increase than last week</span>
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="relative pt-8 pb-1">
        {/* Y-Axis guide lines */}
        <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none text-[10px] text-gray-300">
          <div className="flex items-center gap-2">
            <span className="w-4">8h</span>
            <div className="flex-1 border-b border-dashed border-gray-100" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4">6h</span>
            <div className="flex-1 border-b border-dashed border-gray-100" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4">4h</span>
            <div className="flex-1 border-b border-dashed border-gray-100" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4">2h</span>
            <div className="flex-1 border-b border-dashed border-gray-100" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4">1h</span>
            <div className="flex-1 border-b border-dashed border-gray-100" />
          </div>
        </div>

        {/* Bars */}
        <div className="grid grid-cols-7 gap-2 items-end h-36 pl-6 pr-2 relative z-10">
          {ACTIVITY_DATA.map((item, idx) => {
            const isSelected = selectedDayIndex === idx;
            const heightPercent = Math.min(100, (item.hours / 9.5) * 100);

            return (
              <div
                key={item.day}
                className="flex flex-col items-center justify-end h-full group cursor-pointer relative"
                onClick={() => setSelectedDayIndex(idx)}
              >
                {/* Active Tooltip */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-9 z-30 bg-[#161824] text-white text-[10px] font-bold px-2.5 py-1 rounded-xl whitespace-nowrap shadow-lg flex items-center gap-1"
                  >
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                    <span className="text-gray-400 font-normal">• {item.date}</span>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#161824] rotate-45" />
                  </motion.div>
                )}

                {/* Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`w-2.5 sm:w-3 rounded-full transition-all duration-300 ${
                    isSelected
                      ? "bg-[#d4f938] shadow-md shadow-[#d4f938]/50 ring-2 ring-[#d4f938]/20"
                      : "bg-[#181a24] hover:bg-[#2c3044]"
                  }`}
                />

                {/* Day label */}
                <span
                  className={`text-[11px] font-bold mt-3 transition-colors ${
                    isSelected ? "text-[#141721]" : "text-gray-400"
                  }`}
                >
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
