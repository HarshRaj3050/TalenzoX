"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Loading from "./loading";

export default function HomeTemplate({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsReady(true);
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    isReady ? <>{children}</> : <Loading />
  );
}
