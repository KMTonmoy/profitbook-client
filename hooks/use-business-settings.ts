"use client";

import { useSyncExternalStore } from "react";
import { api } from "@/lib/api";
import type { BusinessSettings } from "@/lib/types";

/* ---------------- external store ---------------- */

let cache: BusinessSettings | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((cb) => cb());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): {
  settings: BusinessSettings | null;
  loading: boolean;
} {
  return snapshot;
}

function getServerSnapshot(): {
  settings: BusinessSettings | null;
  loading: boolean;
} {
  return { settings: null, loading: true };
}

let snapshot = { settings: null as BusinessSettings | null, loading: true };

function setSnapshot(next: {
  settings: BusinessSettings | null;
  loading: boolean;
}) {
  snapshot = next;
  emit();
}

/* ---------------- fetch / save ---------------- */

let inflight: Promise<BusinessSettings> | null = null;

export async function loadBusinessSettings(): Promise<BusinessSettings> {
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const settings = await api.get<BusinessSettings>("/api/settings");
      cache = settings;
      setSnapshot({ settings, loading: false });
      return settings;
    } catch (err) {
      setSnapshot({ settings: cache, loading: false });
      throw err;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

export async function saveBusinessSettings(
  patch: Partial<BusinessSettings>,
): Promise<BusinessSettings> {
  const saved = await api.put<BusinessSettings>("/api/settings", patch);
  cache = saved;
  setSnapshot({ settings: saved, loading: false });
  return saved;
}

/* ---------------- hook ---------------- */

export function useBusinessSettings() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Kick off an initial fetch on first mount if we don't have a cache yet.
  // No setState — the fetch updates the store, which notifies subscribers.
  if (typeof window !== "undefined" && !cache && !inflight) {
    loadBusinessSettings().catch(() => {});
  }

  return { settings: state.settings, loading: state.loading };
}

export const DEFAULT_SETTINGS: BusinessSettings = {
  businessName: "ProfitBook",
  ownerName: "Owner",
  phone: "",
  address: "",
  email: "",
  invoicePrefix: "INV",
  paymentTerms: 15,
  invoiceFooter: "Thank you for your business!",
  currency: "BDT",
  theme: "light",
};

export function useBusinessSettingsOrDefault() {
  const { settings, loading } = useBusinessSettings();
  return { settings: settings ?? DEFAULT_SETTINGS, loading };
}
