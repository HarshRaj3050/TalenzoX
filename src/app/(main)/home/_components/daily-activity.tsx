"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CloudSun, Code2, Camera, Star } from "lucide-react";

export interface ActivityCardData {
  id: string;
  title: string;
  lessons: number | string;
  rate: number;
  type: string;
  iconBg: string;
  icon: React.ReactNode;
  href?: string;
}

const ACTIVITIES: ActivityCardData[] = [
  {
    id: "1",
    title: "The Feelings Weather Report",
    lessons: "Interactive",
    rate: 5.0,
    type: "SEL Practice",
    iconBg: "bg-[#ffece4]",
    icon: <CloudSun className="w-5 h-5 text-[#f97316]" />,
    href: "/sel/practice/feelings-weather",
  },
  {
    id: "2",
    title: "Usability Testing",
    lessons: "15 Lessons",
    rate: 5.0,
    type: "UI/UX Design",
    iconBg: "bg-[#effbd0]",
    icon: <Code2 className="w-5 h-5 text-[#65a30d]" />,
  },
  {
    id: "3",
    title: "Photography",
    lessons: "8 Lessons",
    rate: 4.6,
    type: "Art and Design",
    iconBg: "bg-[#f0edff]",
    icon: <Camera className="w-5 h-5 text-[#8b5cf6]" />,
  },
];

export function DailyActivity() {
  return (
    <section>
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-lg font-bold text-[#141721] tracking-tight">Daily Activity</h2>
        <button className="text-xs font-semibold text-gray-400 hover:text-black underline underline-offset-2 transition-colors cursor-pointer">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {ACTIVITIES.map((activity) => {
          const CardContent = (
            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white p-4 rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between cursor-pointer group h-full"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-11 h-11 rounded-2xl ${activity.iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                  {activity.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-[#141721] truncate group-hover:text-black" title={activity.title}>
                    {activity.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{activity.lessons}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-[11px] font-semibold">
                <div>
                  <span className="text-gray-400 font-normal block text-[10px]">Rate</span>
                  <span className="text-[#141721] flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 fill-[#eab308] text-[#eab308]" />
                    {activity.rate.toFixed(1)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 font-normal block text-[10px]">Type</span>
                  <span className="text-[#141721] mt-0.5 block truncate max-w-[95px]">{activity.type}</span>
                </div>
              </div>
            </motion.div>
          );

          return activity.href ? (
            <Link key={activity.id} href={activity.href} className="block">
              {CardContent}
            </Link>
          ) : (
            <div key={activity.id}>{CardContent}</div>
          );
        })}
      </div>
    </section>
  );
}
