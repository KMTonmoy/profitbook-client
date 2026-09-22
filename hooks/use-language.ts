"use client";

import { useSyncExternalStore } from "react";
import { toast } from "sonner";

const STORAGE_KEY = "profitbook.lang";
const EVENT = "profitbook:lang";
export type Language = "en" | "bn";

function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function getSnapshot(): Language {
  if (typeof window === "undefined") return "en";
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "bn" ? "bn" : "en";
}

function getServerSnapshot(): Language {
  return "en";
}

export function useLanguage() {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLanguage = (next: Language, options?: { silent?: boolean }) => {
    if (typeof window === "undefined") return;

    const current = getSnapshot();
    if (current === next) return;

    // 1. Save to localStorage
    localStorage.setItem(STORAGE_KEY, next);

    // 2. Set the Google Translate cookie for both plain and hostname domain
    const cookieValue = next === "en" ? "/en/en" : "/en/bn";
    document.cookie = `googtrans=${cookieValue};path=/`;
    document.cookie = `googtrans=${cookieValue};path=/;domain=${window.location.hostname}`;
    document.cookie = `googtrans=${cookieValue};path=/;domain=.${window.location.hostname}`;

    // 3. Try to switch the widget immediately (best effort)
    try {
      const select =
        document.querySelector<HTMLSelectElement>(".goog-te-combo");
      if (select) {
        select.value = next === "en" ? "" : next;
        select.dispatchEvent(new Event("change"));
      }
    } catch {
      // ignore — reload will finish the job
    }

    // 4. Toast then full reload so the entire app repaints in the new language
    if (!options?.silent) {
      toast.success(
        next === "bn" ? "ভাষা পরিবর্তন হচ্ছে…" : "Changing language…",
      );
    }

    setTimeout(() => {
      window.location.reload();
    }, 350);
  };

  return { lang, setLanguage };
}
