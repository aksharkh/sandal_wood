"use client";

import { useEffect, type ReactNode } from "react";
import { useMaison, useShop } from "@/lib/store";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Stores skip auto-hydration so the first client render matches the server.
    useShop.persist.rehydrate();
    useMaison.persist.rehydrate();
  }, []);

  const locale = useShop((s) => s.locale);
  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  return <>{children}</>;
}
