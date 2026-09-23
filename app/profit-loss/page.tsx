"use client";

import * as React from "react";
import { Printer } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/shared/date-range-picker";
import { useApi } from "@/hooks/use-api";
import { useBusinessSettingsOrDefault } from "@/hooks/use-business-settings";
import { formatCurrency } from "@/lib/format";
import {
  Receipt,
  TrendingUp,
  Wallet,
  Percent,
  DollarSign,
  CircleDollarSign,
} from "lucide-react";

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
  const { settings } = useBusinessSettingsOrDefault();
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

  const handlePrint = () => {
    const w = window.open("", "_blank", "width=1100,height=850");
    if (!w) return;

    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const monthlyRows = report.monthly
      .map(
        (m) => `
      <tr>
        <td>${esc(m.month)}</td>
        <td class="num">${fmt(m.revenue)}</td>
        <td class="num">${fmt(m.cost)}</td>
        <td class="num">${fmt(m.profit)}</td>
      </tr>`,
      )
      .join("");

    const monthlyTotals = report.monthly.reduce(
      (a, m) => ({
        revenue: a.revenue + (m.revenue || 0),
        cost: a.cost + (m.cost || 0),
        profit: a.profit + (m.profit || 0),
      }),
      { revenue: 0, cost: 0, profit: 0 },
    );

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Profit & Loss — ${esc(settings.businessName)}</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    color: #000; background: #fff;
    margin: 0 auto; padding: 16mm;
    width: 210mm; min-height: 297mm; font-size: 12px;
  }
  h1 { font-size: 20px; margin: 0 0 4px; }
  h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em;
       border-bottom: 1px solid #000; padding-bottom: 4px; margin: 22px 0 8px; }
  .header { border-bottom: 2px solid #000; padding-bottom: 12px; }
  .meta { font-size: 11px; color: #444; }
  .report-title { margin-top: 12px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th, td { border: 1px solid #000; padding: 6px 10px; font-size: 11px; text-align: left; }
  th { text-transform: uppercase; font-size: 10px; font-weight: 600; }
  td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
  tfoot td { font-weight: 700; background: #f5f5f5; }
  .footer { margin-top: 24px; border-top: 1px solid #999; padding-top: 10px; font-size: 10px; color: #555; text-align: center; }
  @media print { body { padding: 12mm; } @page { margin: 12mm; size: A4 portrait; } }
</style>
</head>
<body>
  <div class="header">
    <h1>${esc(settings.businessName)}</h1>
    <div class="meta">${esc(settings.address)}</div>
    <div class="meta">${esc(settings.phone)}</div>
    <div class="report-title">Profit &amp; Loss Report</div>
    <div class="meta">Generated on ${today}</div>
  </div>

  <h2>Summary</h2>
  <table>
    <tbody>
      <tr><td>Revenue</td><td class="num">${fmt(report.revenue)}</td></tr>
      <tr><td>Cost of Goods Sold (COGS)</td><td class="num">${fmt(report.cogs)}</td></tr>
      <tr><td><strong>Gross Profit</strong></td><td class="num"><strong>${fmt(report.grossProfit)}</strong></td></tr>
      <tr><td>Business Expenses</td><td class="num">${fmt(report.expenses)}</td></tr>
      <tr><td><strong>Net Profit</strong></td><td class="num"><strong>${fmt(report.netProfit)}</strong></td></tr>
      <tr><td>Profit Margin</td><td class="num">${report.margin.toFixed(1)}%</td></tr>
    </tbody>
  </table>

  ${
    report.monthly.length
      ? `<h2>Monthly Breakdown</h2>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th class="num">Revenue</th>
              <th class="num">Cost</th>
              <th class="num">Profit</th>
            </tr>
          </thead>
          <tbody>${monthlyRows}</tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td class="num">${fmt(monthlyTotals.revenue)}</td>
              <td class="num">${fmt(monthlyTotals.cost)}</td>
              <td class="num">${fmt(monthlyTotals.profit)}</td>
            </tr>
          </tfoot>
        </table>`
      : ""
  }

  <div class="footer">${esc(settings.invoiceFooter)}</div>
  <script>window.onload = function(){ window.print(); };</script>
</body>
</html>`;

    w.document.write(html);
    w.document.close();
  };

  return (
    <AppShell title="Profit & Loss" subtitle="Financial analytics">
      <PageHeader
        title="Profit & Loss"
        description="Revenue, cost, expenses and profit analysis"
      >
        <DateRangePicker defaultValue="month" />
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1.5"
          onClick={handlePrint}
        >
          <Printer className="h-4 w-4" /> Print
        </Button>
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

function esc(s: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
  };
  return String(s).replace(/[&<>"]/g, (c) => map[c] ?? c);
}

function fmt(n: number): string {
  return `৳ ${(n ?? 0).toLocaleString("en-IN")}`;
}
