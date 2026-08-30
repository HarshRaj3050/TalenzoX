"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DailyChallenge } from "./practice-data";

interface KidChallengeBannerProps {
  challenge: DailyChallenge;
  index?: number;
}

export function KidChallengeBanner({ challenge, index = 0 }: KidChallengeBannerProps) {
  const tryItButton = (
    <Button size="sm" className="shrink-0 gap-1.5 text-xs h-8 rounded-xl cursor-pointer">
      Try It <ArrowRight className="h-3 w-3" />
    </Button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className={`rounded-xl border bg-gradient-to-r ${challenge.color} p-5 shadow-xs hover:shadow-md hover:border-primary/30 transition-all duration-200`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          {/* Emoji Icon */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background/60 border text-2xl shadow-xs">
            {challenge.emoji}
          </div>

          {/* Content */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                <Sparkles className="h-2.5 w-2.5" /> {challenge.badge}
              </span>
              <span className="inline-flex items-center rounded-full border border-border/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground bg-background/50">
                {challenge.ageRange}
              </span>
            </div>
            <h3 className="text-sm font-bold leading-snug text-foreground">{challenge.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
              {challenge.description}
            </p>
          </div>
        </div>

        {challenge.href ? (
          <Link href={challenge.href} className="shrink-0">
            {tryItButton}
          </Link>
        ) : (
          <div className="shrink-0">{tryItButton}</div>
        )}
      </div>
    </motion.div>
  );
}
