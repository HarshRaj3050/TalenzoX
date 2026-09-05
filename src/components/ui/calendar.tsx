"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CalendarProps {
  className?: string
  classNames?: Record<string, string>
  showOutsideDays?: boolean
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  initialMonth?: Date
  mode?: "single"
}

function isSameDay(d1?: Date | null, d2?: Date | null) {
  if (!d1 || !d2) return false
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  selected,
  onSelect,
  initialMonth,
}: CalendarProps) {
  const today = React.useMemo(() => new Date(), [])

  const [currentMonth, setCurrentMonth] = React.useState<Date>(() => {
    if (initialMonth) return initialMonth
    if (selected) return new Date(selected.getFullYear(), selected.getMonth(), 1)
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })

  // Sync currentMonth if initialMonth or selected changes externally
  React.useEffect(() => {
    if (selected) {
      setCurrentMonth(new Date(selected.getFullYear(), selected.getMonth(), 1))
    }
  }, [selected])

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    )
  }

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    )
  }

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  // First day of current month (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const days: {
    date: Date
    isCurrentMonth: boolean
    dayNumber: number
    isToday: boolean
  }[] = []

  // Trailing days from previous month
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, daysInPrevMonth - i)
    days.push({
      date: d,
      isCurrentMonth: false,
      dayNumber: daysInPrevMonth - i,
      isToday: isSameDay(d, today),
    })
  }

  // Days of current month
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const d = new Date(year, month, day)
    days.push({
      date: d,
      isCurrentMonth: true,
      dayNumber: day,
      isToday: isSameDay(d, today),
    })
  }

  // Leading days from next month to complete the grid (5 or 6 rows = 35 or 42 cells)
  const totalCells = Math.ceil(days.length / 7) * 7
  const nextMonthDaysNeeded = totalCells - days.length
  for (let day = 1; day <= nextMonthDaysNeeded; day++) {
    const d = new Date(year, month + 1, day)
    days.push({
      date: d,
      isCurrentMonth: false,
      dayNumber: day,
      isToday: isSameDay(d, today),
    })
  }

  return (
    <div className={cn("p-1 w-full", className)}>
      {/* Month & Year Navigation Header */}
      <div className={cn("flex items-center justify-between mb-4 px-1", classNames?.nav)}>
        <button
          type="button"
          onClick={prevMonth}
          className={cn(
            "p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors cursor-pointer",
            classNames?.nav_button_previous
          )}
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className={cn("font-extrabold text-xs text-[#141721] tracking-wide", classNames?.caption_label)}>
          {monthNames[month]}, {year}
        </span>

        <button
          type="button"
          onClick={nextMonth}
          className={cn(
            "p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors cursor-pointer",
            classNames?.nav_button_next
          )}
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekdays Row */}
      <div className={cn("grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400 mb-2", classNames?.head_row)}>
        <span>S</span>
        <span>M</span>
        <span>T</span>
        <span>W</span>
        <span>T</span>
        <span>F</span>
        <span>S</span>
      </div>

      {/* Days Table */}
      <div className={cn("grid grid-cols-7 gap-1 text-center text-xs font-semibold", classNames?.table)}>
        {days.map((item, index) => {
          const isSelected = isSameDay(item.date, selected)
          const disabled = !item.isCurrentMonth && !showOutsideDays

          if (disabled) return <div key={index} />

          return (
            <button
              key={index}
              type="button"
              onClick={() => {
                onSelect?.(item.date)
                if (!item.isCurrentMonth) {
                  setCurrentMonth(new Date(item.date.getFullYear(), item.date.getMonth(), 1))
                }
              }}
              className={cn(
                "h-7 w-7 mx-auto rounded-full flex items-center justify-center transition-all cursor-pointer select-none",
                !item.isCurrentMonth
                  ? "text-gray-300 font-normal hover:text-gray-400"
                  : isSelected
                    ? "bg-[#d4f938] text-[#141721] font-extrabold shadow-sm ring-2 ring-[#d4f938]/30"
                    : item.isToday
                      ? "text-[#141721] bg-gray-100/90 font-bold border border-gray-200"
                      : "text-[#141721] hover:bg-gray-100 font-medium",
                classNames?.day
              )}
            >
              {item.dayNumber}
            </button>
          )
        })}
      </div>
    </div>
  )
}
