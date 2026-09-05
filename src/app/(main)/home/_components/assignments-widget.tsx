"use client";

import React from "react";
import { Plus } from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  time: string;
  status: string;
  statusBg: string;
  iconBg: string;
  dotColor: string;
}

const ASSIGNMENTS: Assignment[] = [
  {
    id: "as1",
    title: "Methods of data",
    time: "02 July, 10:30 AM",
    status: "In progress",
    statusBg: "bg-[#e8edff] text-[#4f46e5]",
    iconBg: "bg-[#e0e7ff]",
    dotColor: "bg-[#6366f1]",
  },
  {
    id: "as2",
    title: "Market Research",
    time: "14 June, 12:45 AM",
    status: "Completed",
    statusBg: "bg-[#ecfdf5] text-[#059669]",
    iconBg: "bg-[#d1fae5]",
    dotColor: "bg-[#10b981]",
  },
  {
    id: "as3",
    title: "Data Collection",
    time: "12 May, 11:00 AM",
    status: "Upcoming",
    statusBg: "bg-[#fff7ed] text-[#ea580c]",
    iconBg: "bg-[#ffedd5]",
    dotColor: "bg-[#f97316]",
  },
];

interface AssignmentsWidgetProps {
  onAddAssignment?: () => void;
}

export function AssignmentsWidget({ onAddAssignment }: AssignmentsWidgetProps) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base text-[#141721]">Assignments</h3>
        <button
          onClick={onAddAssignment}
          className="w-6 h-6 rounded-full bg-[#d4f938] hover:bg-[#c5ec2d] text-[#141721] flex items-center justify-center font-bold shadow-sm transition-transform active:scale-95 cursor-pointer"
          title="Add assignment"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3.5">
        {ASSIGNMENTS.map((assignment) => (
          <div
            key={assignment.id}
            className="flex items-center justify-between p-2 rounded-2xl hover:bg-gray-50/70 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-2xl ${assignment.iconBg} flex items-center justify-center shrink-0 relative`}>
                <div className={`w-2.5 h-2.5 rounded-full ${assignment.dotColor}`} />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#141721]">{assignment.title}</h4>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">{assignment.time}</p>
              </div>
            </div>

            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${assignment.statusBg}`}>
              {assignment.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
