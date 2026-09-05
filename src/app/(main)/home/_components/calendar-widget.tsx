"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export function CalendarWidget() {
  // Automatically defaults to today's real current date
  const [date, setDate] = useState<Date | undefined>(() => new Date());

  return (
    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="w-full"
      />
    </div>
  );
}
