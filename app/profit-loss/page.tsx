"use client";

import * as React from "react";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/shared/date-range-picker";
import { formatCurrency } from "@/lib/format";
import {
  Receipt,
  TrendingUp,
  Wallet,
  Percent,
  DollarSign,
  CircleDollarSign,
} from "lucide-react";
import { useApi } from "@/hooks/use-api";

interface ProfitReport {
  revenue: number;
  cogs: number;
  grossProfit: number;
  expenses: number;
  netProfit: number;
  margin: number;
  monthly: { month: string; revenue: number; cost: number; profit: number }[];
}

export default function ProfitLossPage() {
  const { data, loading, error } = useApi<ProfitReport>("/api/reports/profit");

  const report: ProfitReport = data ?? {
    revenue: 0,
    cogs: 0,
    grossProfit: 0,
    expenses: 0,
    netProfit: 0,
    margin: 0,
    monthly: [],
  };

  const netTone = report.netProfit >= 0 ? "success" : "destructive";
  const marginTone = report.margin >= 0 ? "success" : "destructive";

  return (
    <AppShell title="Profit & Loss" subtitle="Financial analytics">
      <PageHeader
        title="Profit & Loss"
        description="Revenue, cost, expenses and profit analysis"
      >
        <DateRangePicker defaultValue="month" />
      </PageHeader>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load profit report: {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
          Loading profit data…
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <StatCard
              label="Revenue"
              value={formatCurrency(report.revenue)}
              icon={Receipt}
              tone="info"
            />
            <StatCard
              label="COGS"
              value={formatCurrency(report.cogs)}
              icon={CircleDollarSign}
              tone="neutral"
            />
            <StatCard
              label="Gross Profit"
              value={formatCurrency(report.grossProfit)}
              icon={TrendingUp}
              tone="success"
            />
            <StatCard
              label="Expenses"
              value={formatCurrency(report.expenses)}
              icon={Wallet}
              tone="warning"
            />
            <StatCard
              label="Net Profit"
              value={formatCurrency(report.netProfit)}
              icon={DollarSign}
              tone={netTone}
            />
            <StatCard
              label="Profit Margin"
              value={`${report.margin.toFixed(1)}%`}
              icon={Percent}
              tone={marginTone}
            />
          </div>

          <div className="mt-6">
            <MonthlyChart data={report.monthly} />
          </div>

          <Card className="mt-6 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Profit Calculation Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Revenue" value={formatCurrency(report.revenue)} />
              <Row
                label="− Cost of Goods Sold (COGS)"
                value={formatCurrency(-report.cogs)}
              />
              <div className="flex items-center justify-between border-t pt-3 text-base font-semibold">
                <span>= Gross Profit</span>
                <span className="tabular-nums text-success">
                  {formatCurrency(report.grossProfit)}
                </span>
              </div>
              <Row
                label="− Business Expenses"
                value={formatCurrency(-report.expenses)}
              />
              <div className="flex items-center justify-between border-t pt-3 text-base font-semibold">
                <span>= Net Profit</span>
                <span
                  className={`tabular-nums ${
                    report.netProfit >= 0 ? "text-success" : "text-destructive"
                  }`}
                >
                  {formatCurrency(report.netProfit)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-muted-foreground">Profit Margin</span>
                <span className="font-semibold tabular-nums">
                  {report.margin.toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function MonthlyChart({
  data,
}: {
  data: { month: string; revenue: number; cost: number; profit: number }[];
}) {
  if (!data.length) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-8 text-center text-sm text-muted-foreground">
          No monthly data yet — record some sales to see the trend.
        </CardContent>
      </Card>
    );
  }

  const max = Math.max(
    ...data.flatMap((d) => [d.revenue, d.cost, d.profit]),
    1,
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Monthly Profit Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((row) => (
            <div key={row.month} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">{row.month}</span>
                <span className="text-muted-foreground">
                  Revenue {formatCurrency(row.revenue)} · Cost{" "}
                  {formatCurrency(row.cost)} · Profit{" "}
                  <span className="text-success">
                    {formatCurrency(row.profit)}
                  </span>
                </span>
              </div>
              <div className="flex h-2 gap-0.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="bg-[var(--color-chart-2)]"
                  style={{ width: `${(row.revenue / max) * 100}%` }}
                />
                <div
                  className="bg-[var(--color-chart-5)]"
                  style={{ width: `${(row.cost / max) * 100}%` }}
                />
                <div
                  className="bg-[var(--color-chart-1)]"
                  style={{ width: `${(row.profit / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--color-chart-2)]" />
            Revenue
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--color-chart-5)]" />
            Cost
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--color-chart-1)]" />
            Profit
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
