"use client";

import * as React from "react";

import { useAuth } from "@/hooks/use-auth";
import { LoginScreen } from "@/components/auth/login-screen";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { ready, isAuthenticated } = useAuth();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <>{children}</>;
}
