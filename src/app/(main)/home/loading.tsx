"use client";

import { useEffect, useState } from "react";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";

const loadingStates = [
  { text: "Loading your dashboard" },
  { text: "Agents are ready to connect" },
  { text: "Preparing your workspace" },
  { text: "Almost ready" },
];

export default function Loading({ onComplete }: { onComplete?: () => void }) {
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isFinished) {
      onComplete?.();
    }
  }, [isFinished, onComplete]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center">
      {!isFinished && (
        <Loader
          loadingStates={loadingStates}
          loading
          duration={500}
          loop={false}
          onComplete={() => {
            setIsFinished(true);
          }}
        />
      )}
    </div>
  );
}
