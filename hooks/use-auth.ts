"use client";

import { useSyncExternalStore } from "react";

const SESSION_KEY = "profitbook.session";
const EVENT = "profitbook:auth";

export interface Session {
  username: string;
  loginAt: string;
}

const ENV_USERNAME = process.env.NEXT_PUBLIC_DEMO_USERNAME ?? "Emran";
const ENV_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "Mykey1520";

let cachedRaw: string | null = null;
let cachedSession: Session | null = null;

function readSnapshot(): Session | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(SESSION_KEY);
  if (raw === cachedRaw) return cachedSession;

  cachedRaw = raw;

  if (!raw) {
    cachedSession = null;
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Session;
    cachedSession = parsed?.username ? parsed : null;
  } catch {
    cachedSession = null;
  }
  return cachedSession;
}

function getServerSnapshot(): Session | null {
  return null;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function login(username: string, password: string): Session {
  const okUser = username.trim() === ENV_USERNAME;
  const okPass = password === ENV_PASSWORD;

  if (!okUser || !okPass) {
    throw new Error("Invalid username or password");
  }

  const session: Session = {
    username: ENV_USERNAME,
    loginAt: new Date().toISOString(),
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(EVENT));

  return session;
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event(EVENT));
}

export function useAuth() {
  const session = useSyncExternalStore(
    subscribe,
    readSnapshot,
    getServerSnapshot,
  );

  const ready = typeof window !== "undefined";

  return {
    session,
    ready,
    isAuthenticated: !!session,
  };
}

export const DEMO_CREDENTIALS = {
  username: ENV_USERNAME,
  password: ENV_PASSWORD,
};
