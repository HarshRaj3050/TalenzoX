"use client";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";

const loadingStates = [
  { text: "Loading your dashboard" },
  { text: "Preparing your workspace" },
  { text: "Almost ready" },
];

export default function Loading() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center">
      <Loader
        loadingStates={loadingStates}
        loading
        duration={1500}
        loop={false}
      />
    </div>
  );
}
