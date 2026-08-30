"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Practice } from "./practice-data";

interface ScenarioCardProps {
  item: Practice;
}

const difficultyColors: Record<Practice["difficulty"], string> = {
  Beginner: "text-emerald-600 dark:text-emerald-400",
  Intermediate: "text-amber-600 dark:text-amber-400",
  Advanced: "text-rose-600 dark:text-rose-400",
};

export function ScenarioCard({ item }: ScenarioCardProps) {
  const IconComponent = item.icon;
  return (
    <div className="flex flex-col justify-between rounded-xl border bg-card p-5 shadow-xs transition-all hover:border-primary/50 hover:shadow-sm">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-foreground">
            <IconComponent className="h-4 w-4" />
          </div>
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
            {item.xp}
          </span>
        </div>
        <div className="mt-3">
          <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
            {item.type}
          </span>
          <h3 className="text-sm font-semibold mt-1 leading-snug">{item.title}</h3>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            {item.prompt}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t pt-3.5">
        <span className={`text-xs font-medium ${difficultyColors[item.difficulty]}`}>
          {item.difficulty}
        </span>
        <Button size="sm" variant="outline" className="gap-1 text-xs h-7 px-2.5 rounded-lg cursor-pointer">
          Practice <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
