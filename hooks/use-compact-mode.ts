"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "profitbook.compact";
const EVENT = "profitbook:compact";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
}

function getServerSnapshot(): boolean {
  return false;
}

export function useCompactMode() {
  const compact = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setCompact = (value: boolean) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, value ? "true" : "false");
    document.documentElement.classList.toggle("compact", value);
    window.dispatchEvent(new Event(EVENT));
  };

  return { compact, setCompact };
}
