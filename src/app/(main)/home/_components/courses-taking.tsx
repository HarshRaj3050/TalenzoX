"use client";

import React, { useState } from "react";
import { ChevronDown, Plus, Box, Code2 } from "lucide-react";

interface EnrolledCourse {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  remainingTime: string;
  progress: number;
  iconBg: string;
  icon: React.ReactNode;
}

const ENROLLED_COURSES: EnrolledCourse[] = [
  {
    id: "ec1",
    title: "3D Design Course",
    instructor: "Micheal Andrew",
    instructorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    remainingTime: "8h 45 min",
    progress: 45,
    iconBg: "bg-[#f3e8ff]",
    icon: <Box className="w-5 h-5 text-[#9333ea]" />,
  },
  {
    id: "ec2",
    title: "Development Basics",
    instructor: "Natalia Varnan",
    instructorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    remainingTime: "18h 12 min",
    progress: 75,
    iconBg: "bg-[#ffe4e6]",
    icon: <Code2 className="w-5 h-5 text-[#e11d48]" />,
  },
];

interface CoursesTakingProps {
  onAddCourse?: () => void;
}

export function CoursesTaking({ onAddCourse }: CoursesTakingProps) {
  const [filter, setFilter] = useState("Active");

  return (
    <section className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base text-[#141721]">Course You&apos;re Taking</h3>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter(filter === "Active" ? "All" : "Active")}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 px-3 py-1 rounded-full border border-gray-100 transition-colors cursor-pointer"
          >
            <span>{filter}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onAddCourse}
            className="w-7 h-7 rounded-full bg-[#d4f938] hover:bg-[#c5ec2d] text-[#141721] flex items-center justify-center font-bold shadow-sm transition-transform active:scale-95 cursor-pointer"
            title="Add course"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {ENROLLED_COURSES.map((course) => {
          const circumference = 2 * Math.PI * 14;
          const strokeDashoffset = circumference - (course.progress / 100) * circumference;

          return (
            <div
              key={course.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-3.5 rounded-2xl hover:bg-gray-50/60 border border-transparent hover:border-gray-100 transition-all gap-3"
            >
              {/* Left: Icon + Title + Instructor */}
              <div className="flex items-center gap-3 min-w-[200px]">
                <div className={`w-11 h-11 rounded-2xl ${course.iconBg} flex items-center justify-center shrink-0`}>
                  {course.icon}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#141721]">{course.title}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={course.instructorAvatar}
                      alt={course.instructor}
                      className="w-3.5 h-3.5 rounded-full object-cover"
                    />
                    <span className="text-[11px] text-gray-400 font-medium">{course.instructor}</span>
                  </div>
                </div>
              </div>

              {/* Middle: Remaining Time */}
              <div className="sm:text-center pl-14 sm:pl-0">
                <span className="text-[10px] text-gray-400 font-normal block">Remaining</span>
                <span className="text-xs font-bold text-[#141721]">{course.remainingTime}</span>
              </div>

              {/* Right: Circular Progress Ring */}
              <div className="flex items-center gap-3 pl-14 sm:pl-0">
                <div className="relative w-9 h-9 flex items-center justify-center">
                  <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="transparent"
                      stroke="#f1f3f7"
                      strokeWidth="3.5"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="transparent"
                      stroke="#84cc16"
                      strokeWidth="3.5"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span className="text-xs font-extrabold text-[#141721] w-8">{course.progress}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
