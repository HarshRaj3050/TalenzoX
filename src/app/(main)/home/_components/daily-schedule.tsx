"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  Award,
  Palette,
  Sparkles,
  ChevronRight,
  Plus,
  Trash2,
  X,
  BookOpen,
  Calendar,
  Layers,
} from "lucide-react";

interface ScheduleItem {
  id: string;
  title: string;
  category: string;
  iconBg: string;
  iconColor: string;
  iconName: "grid" | "award" | "palette" | "sparkles" | "book" | "calendar" | "layers";
}

const INITIAL_SCHEDULE: ScheduleItem[] = [
  {
    id: "ds1",
    title: "Design System",
    category: "Lecture - Class",
    iconBg: "bg-[#ffedd5]",
    iconColor: "text-[#ea580c]",
    iconName: "grid",
  },
  {
    id: "ds2",
    title: "Typography",
    category: "Group - Test",
    iconBg: "bg-[#ede9fe]",
    iconColor: "text-[#7c3aed]",
    iconName: "award",
  },
  {
    id: "ds3",
    title: "Color Style",
    category: "Group - Test",
    iconBg: "bg-[#ecfccb]",
    iconColor: "text-[#65a30d]",
    iconName: "palette",
  },
  {
    id: "ds4",
    title: "Visual Design",
    category: "Lecture - Test",
    iconBg: "bg-[#fef3c7]",
    iconColor: "text-[#d97706]",
    iconName: "sparkles",
  },
];

const THEME_OPTIONS = [
  { bg: "bg-[#ffedd5]", color: "text-[#ea580c]", name: "Peach" },
  { bg: "bg-[#ede9fe]", color: "text-[#7c3aed]", name: "Lavender" },
  { bg: "bg-[#ecfccb]", color: "text-[#65a30d]", name: "Lime" },
  { bg: "bg-[#fef3c7]", color: "text-[#d97706]", name: "Amber" },
  { bg: "bg-[#e0e7ff]", color: "text-[#4f46e5]", name: "Indigo" },
  { bg: "bg-[#ffe4e6]", color: "text-[#e11d48]", name: "Rose" },
];

export function DailySchedule() {
  const [scheduleList, setScheduleList] = useState<ScheduleItem[]>(INITIAL_SCHEDULE);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Lecture - Class");
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);

  const getIcon = (name: string, color: string) => {
    switch (name) {
      case "award":
        return <Award className={`w-4 h-4 ${color}`} />;
      case "palette":
        return <Palette className={`w-4 h-4 ${color}`} />;
      case "sparkles":
        return <Sparkles className={`w-4 h-4 ${color}`} />;
      case "book":
        return <BookOpen className={`w-4 h-4 ${color}`} />;
      case "calendar":
        return <Calendar className={`w-4 h-4 ${color}`} />;
      case "layers":
        return <Layers className={`w-4 h-4 ${color}`} />;
      case "grid":
      default:
        return <LayoutGrid className={`w-4 h-4 ${color}`} />;
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const theme = THEME_OPTIONS[selectedThemeIndex];
    const newItem: ScheduleItem = {
      id: `ds_${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory.trim() || "Lecture - Class",
      iconBg: theme.bg,
      iconColor: theme.color,
      iconName: selectedThemeIndex % 2 === 0 ? "grid" : "sparkles",
    };

    setScheduleList((prev) => [...prev, newItem]);
    setNewTitle("");
    setNewCategory("Lecture - Class");
    setIsAdding(false);
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setScheduleList((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between h-full">
      <div>
        {/* Header with Title and Add '+' Button */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-base text-[#141721]">Daily Schedule</h3>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all duration-200 cursor-pointer ${
              isAdding
                ? "bg-gray-200 hover:bg-gray-300 text-gray-700 rotate-45"
                : "bg-[#d4f938] hover:bg-[#c5ec2d] text-[#141721] hover:scale-105"
            }`}
            title={isAdding ? "Close" : "Add Schedule Item"}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Add Item Form Collapsible */}
        <AnimatePresence>
          {isAdding && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddItem}
              className="overflow-hidden mb-3 p-3 bg-gray-50/90 rounded-2xl border border-gray-100 space-y-2.5"
            >
              <div className="flex items-center justify-between pb-1 border-b border-gray-200/60">
                <span className="text-[11px] font-bold text-[#141721]">New Schedule Item</span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="e.g. Interaction Design"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white text-xs px-3 py-1.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#d4f938] text-gray-800 placeholder:text-gray-400"
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Category (e.g. Lecture - Class)"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 bg-white text-xs px-3 py-1.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#d4f938] text-gray-800 placeholder:text-gray-400"
                />
              </div>

              {/* Color Theme Selector */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  {THEME_OPTIONS.map((theme, i) => (
                    <button
                      key={theme.name}
                      type="button"
                      onClick={() => setSelectedThemeIndex(i)}
                      className={`w-5 h-5 rounded-full ${theme.bg} border transition-all ${
                        selectedThemeIndex === i
                          ? "border-[#141721] scale-110 shadow-sm"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      title={theme.name}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="bg-[#151722] hover:bg-black disabled:opacity-40 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  Add Item
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Schedule Items List */}
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {scheduleList.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between p-2 rounded-2xl hover:bg-gray-50/80 transition-all cursor-pointer group relative"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className={`w-9 h-9 rounded-2xl ${item.iconBg} flex items-center justify-center shrink-0`}>
                    {getIcon(item.iconName, item.iconColor)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-[#141721] group-hover:text-black truncate">{item.title}</h4>
                    <p className="text-[10px] text-gray-400 font-medium truncate">{item.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Delete Button (visible on hover or always accessible) */}
                  <button
                    onClick={(e) => handleDeleteItem(item.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-lg transition-all duration-150 cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-gray-300 group-hover:text-black transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {scheduleList.length === 0 && (
            <div className="py-6 text-center text-xs text-gray-400">
              No scheduled activities. Click <span className="font-bold text-[#141721]">+</span> to add one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
