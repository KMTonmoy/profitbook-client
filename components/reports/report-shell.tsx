"use client";

import * as React from "react";
import { ArrowLeft, Download, Printer } from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { formatCurrency } from "@/lib/format";

export interface ReportKpi {
  label: string;
  value: string | number;
  tone?: "success" | "warning" | "destructive" | "info" | "primary" | "neutral";
}

interface Props {
  title: string;
  description: string;
  icon: LucideIcon;
  kpis: ReportKpi[];
  onPrint?: () => void;
  onExport?: () => void;
  children: React.ReactNode;
}

const toneClass: Record<NonNullable<ReportKpi["tone"]>, string> = {
  success: "text-success",
  warning: "text-[color-mix(in_oklab,var(--color-warning)_70%,black)]",
  destructive: "text-destructive",
  info: "text-info",
  primary: "text-primary",
  neutral: "",
};

export function ReportShell({
  title,
  description,
  icon: Icon,
  kpis,
  onPrint,
  onExport,
  children,
}: Props) {
  return (
    <AppShell title={title} subtitle={description}>
      <PageHeader title={title} description={description}>
        <Link href="/reports">
          <Button variant="ghost" size="sm" className="h-9 gap-1.5">
            <ArrowLeft className="h-4 w-4" /> All reports
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1.5"
          onClick={onExport}
        >
          <Download className="h-4 w-4" /> Export
        </Button>
        <Button size="sm" className="h-9 gap-1.5" onClick={onPrint}>
          <Printer className="h-4 w-4" /> Print
        </Button>
      </PageHeader>

      {/* KPI row */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {k.label}
                  </p>
                  <p
                    className={`mt-1.5 text-lg font-semibold tabular-nums ${
                      k.tone ? toneClass[k.tone] : ""
                    }`}
                  >
                    {k.value}
                  </p>
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">{children}</div>
    </AppShell>
  );
}

/* Shared helpers */

export function formatValue(k: ReportKpi) {
  if (typeof k.value === "string") return k.value;
  return formatCurrency(k.value);
}