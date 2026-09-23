"use client";

import * as React from "react";
import { CalendarRange } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/format";
import { businessSettings } from "@/lib/mock-data";
import { sales as allSales, expenses as allExpenses } from "@/lib/mock-data";

export interface StatementHandle {
  print: () => void;
}

type RangePreset =
  | "today"
  | "yesterday"
  | "week"
  | "month"
  | "last-month"
  | "year"
  | "last-year"
  | "custom";

const PRESETS: { label: string; value: RangePreset }[] = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "Last Month", value: "last-month" },
  { label: "This Year", value: "year" },
  { label: "Last Year", value: "last-year" },
  { label: "Custom Range", value: "custom" },
];

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function rangeForPreset(p: RangePreset, customFrom: string, customTo: string) {
  const now = new Date();
  let from: Date;
  let to: Date = now;

  switch (p) {
    case "today":
      from = startOfDay(now);
      to = endOfDay(now);
      break;
    case "yesterday": {
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      from = startOfDay(y);
      to = endOfDay(y);
      break;
    }
    case "week": {
      const day = now.getDay();
      const diff = day === 0 ? 6 : day - 1;
      const monday = new Date(now);
      monday.setDate(now.getDate() - diff);
      from = startOfDay(monday);
      to = endOfDay(now);
      break;
    }
    case "month":
      from = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
      to = endOfDay(now);
      break;
    case "last-month": {
      const firstOfThis = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastOfPrev = new Date(firstOfThis);
      lastOfPrev.setDate(0);
      from = startOfDay(
        new Date(lastOfPrev.getFullYear(), lastOfPrev.getMonth(), 1),
      );
      to = endOfDay(lastOfPrev);
      break;
    }
    case "year":
      from = startOfDay(new Date(now.getFullYear(), 0, 1));
      to = endOfDay(now);
      break;
    case "last-year":
      from = startOfDay(new Date(now.getFullYear() - 1, 0, 1));
      to = endOfDay(new Date(now.getFullYear() - 1, 11, 31));
      break;
    case "custom":
      from = customFrom ? startOfDay(new Date(customFrom)) : startOfDay(now);
      to = customTo ? endOfDay(new Date(customTo)) : endOfDay(now);
      break;
  }
  return { from, to };
}

interface StatementData {
  rangeLabel: string;
  from: string;
  to: string;
  openingBalance: number;
  totalSales: number;
  totalPurchase: number;
  totalExpenses: number;
  totalCollection: number;
  totalDue: number;
  grossProfit: number;
  netProfit: number;
  closingBalance: number;

  salesCount: number;
  salesPaid: number;
  salesDue: number;

  purchaseCount: number;
  purchasePaid: number;
  purchaseDue: number;

  expensesByCategory: { category: string; amount: number }[];

  cogs: number;
  profitMargin: number;

  openingStockValue: number;
  purchasedStockValue: number;
  soldStockValue: number;
  currentStockValue: number;

  openingDue: number;
  newDue: number;
  dueCollected: number;
  closingDue: number;
}

function computeStatement(from: Date, to: Date, label: string): StatementData {
  const inRange = (d: string) => {
    const x = new Date(d);
    return x >= from && x <= to;
  };

  const salesInRange = allSales.filter((s) => inRange(s.date));
  const expensesInRange = allExpenses.filter((e) => inRange(e.date));

  const totalSales = salesInRange.reduce((s, x) => s + x.total, 0);
  const totalSalesPaid = salesInRange.reduce((s, x) => s + x.paid, 0);
  const totalSalesDue = salesInRange.reduce((s, x) => s + x.due, 0);
  const totalProfit = salesInRange.reduce((s, x) => s + x.profit, 0);
  const totalExpenses = expensesInRange.reduce((s, x) => s + x.amount, 0);

  const cogs = Math.max(0, totalSales - totalProfit);
  const grossProfit = totalProfit;
  const netProfit = grossProfit - totalExpenses;
  const profitMargin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;

  const expenseByCat = expensesInRange.reduce<Record<string, number>>(
    (acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + e.amount;
      return acc;
    },
    {},
  );

  const openingStockValue = 412000;
  const currentStockValue = openingStockValue;

  const openingDue = 18400;
  const newDue = totalSalesDue;
  const dueCollected = 0;
  const closingDue = Math.max(0, openingDue + newDue - dueCollected);

  const openingBalance = 142000;
  const closingBalance = openingBalance + totalSalesPaid - totalExpenses;

  return {
    rangeLabel: label,
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
    openingBalance,
    totalSales,
    totalPurchase: cogs,
    totalExpenses,
    totalCollection: totalSalesPaid,
    totalDue: totalSalesDue,
    grossProfit,
    netProfit,
    closingBalance,

    salesCount: salesInRange.length,
    salesPaid: totalSalesPaid,
    salesDue: totalSalesDue,

    purchaseCount: salesInRange.length,
    purchasePaid: cogs,
    purchaseDue: 0,

    expensesByCategory: Object.entries(expenseByCat)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount),

    cogs,
    profitMargin,

    openingStockValue,
    purchasedStockValue: cogs,
    soldStockValue: cogs,
    currentStockValue,

    openingDue,
    newDue,
    dueCollected,
    closingDue,
  };
}

export const StatementView = React.forwardRef<StatementHandle>(
  function StatementView(_props, ref) {
    const [preset, setPreset] = React.useState<RangePreset>("month");
    const [customFrom, setCustomFrom] = React.useState(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .slice(0, 10),
    );
    const [customTo, setCustomTo] = React.useState(
      new Date().toISOString().slice(0, 10),
    );

    const data = React.useMemo(() => {
      const { from, to } = rangeForPreset(preset, customFrom, customTo);
      const label = `${
        PRESETS.find((p) => p.value === preset)?.label ?? "Custom"
      } · ${formatDate(from.toISOString().slice(0, 10))} → ${formatDate(
        to.toISOString().slice(0, 10),
      )}`;
      return computeStatement(from, to, label);
    }, [preset, customFrom, customTo]);

    React.useImperativeHandle(ref, () => ({
      print: () => {
        const w = window.open("", "_blank", "width=1100,height=850");
        if (!w) {
          toast.error("Pop-up blocked — please allow pop-ups for printing");
          return;
        }
        w.document.write(buildStatementHTML(data));
        w.document.close();
        toast.success("Opening print dialog…");
      },
    }));

    return (
      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardContent className="flex flex-col gap-4 p-4 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-wrap items-end gap-4">
              <div className="w-48">
                <Label className="mb-2 block text-sm">Range</Label>
                <Select
                  value={preset}
                  onValueChange={(v) => setPreset(String(v) as RangePreset)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select range">
                      {PRESETS.find((p) => p.value === preset)?.label ??
                        "Select range"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {PRESETS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {preset === "custom" && (
                <>
                  <div>
                    <Label className="mb-2 block text-sm">From</Label>
                    <Input
                      type="date"
                      className="h-11 w-40"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block text-sm">To</Label>
                    <Input
                      type="date"
                      className="h-11 w-40"
                      value={customTo}
                      onChange={(e) => setCustomTo(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarRange className="h-4 w-4" />
              Auto-updates with the selected range
            </div>
          </CardContent>
        </Card>

        <StatementOutput data={data} />
      </div>
    );
  },
);

function StatementOutput({ data }: { data: StatementData }) {
  return (
    <div className="space-y-6">
      <Section title="Business Summary">
        <Grid
          items={[
            { label: "Opening Balance", value: data.openingBalance },
            { label: "Total Sales", value: data.totalSales, tone: "info" },
            { label: "Total Purchase", value: data.totalPurchase },
            {
              label: "Total Expenses",
              value: data.totalExpenses,
              tone: "warning",
            },
            {
              label: "Total Collection",
              value: data.totalCollection,
              tone: "success",
            },
            { label: "Total Due", value: data.totalDue, tone: "destructive" },
            { label: "Gross Profit", value: data.grossProfit, tone: "success" },
            {
              label: "Net Profit",
              value: data.netProfit,
              tone: data.netProfit >= 0 ? "success" : "destructive",
            },
            {
              label: "Closing Balance",
              value: data.closingBalance,
              tone: "success",
            },
          ]}
        />
      </Section>

      <Section title="Sales Summary">
        <Grid
          items={[
            { label: "Number of Sales", value: data.salesCount, raw: true },
            { label: "Total Sales Amount", value: data.totalSales },
            { label: "Paid", value: data.salesPaid, tone: "success" },
            { label: "Due", value: data.salesDue, tone: "destructive" },
            { label: "Sales Return", value: 0 },
          ]}
        />
      </Section>

      <Section title="Purchase Summary">
        <Grid
          items={[
            {
              label: "Number of Purchases",
              value: data.purchaseCount,
              raw: true,
            },
            { label: "Total Purchase Cost", value: data.totalPurchase },
            { label: "Paid", value: data.purchasePaid, tone: "success" },
            { label: "Due", value: data.purchaseDue, tone: "destructive" },
            { label: "Purchase Return", value: 0 },
          ]}
        />
      </Section>

      <Section title="Expense Summary">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Grid
            items={[
              {
                label: "Total Expenses",
                value: data.totalExpenses,
                tone: "destructive",
              },
            ]}
          />
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Breakdown by Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-1">
              {data.expensesByCategory.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No expenses in this period.
                </p>
              ) : (
                data.expensesByCategory.map((e) => (
                  <div
                    key={e.category}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="capitalize text-muted-foreground">
                      {e.category}
                    </span>
                    <span className="font-medium tabular-nums">
                      {formatCurrency(e.amount)}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section title="Profit Summary">
        <Card className="shadow-sm">
          <CardContent className="space-y-3 p-5 text-sm">
            <Row label="Revenue" value={data.totalSales} />
            <Row label="Cost of Goods Sold (COGS)" value={-data.cogs} />
            <div className="flex items-center justify-between border-t pt-3 text-base font-semibold">
              <span>Gross Profit</span>
              <span className="tabular-nums text-success">
                {formatCurrency(data.grossProfit)}
              </span>
            </div>
            <Row label="Business Expenses" value={-data.totalExpenses} />
            <div className="flex items-center justify-between border-t pt-3 text-base font-semibold">
              <span>Net Profit</span>
              <span
                className={`tabular-nums ${
                  data.netProfit >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {formatCurrency(data.netProfit)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-muted-foreground">Profit Margin</span>
              <span className="font-semibold">
                {data.profitMargin.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section title="Stock Summary">
        <Grid
          items={[
            { label: "Opening Stock Value", value: data.openingStockValue },
            { label: "Purchased Stock Value", value: data.purchasedStockValue },
            { label: "Sold Stock Value", value: data.soldStockValue },
            {
              label: "Current Stock Value",
              value: data.currentStockValue,
              tone: "success",
            },
          ]}
        />
      </Section>

      <Section title="Due Summary">
        <Grid
          items={[
            { label: "Opening Due", value: data.openingDue },
            { label: "New Due", value: data.newDue, tone: "destructive" },
            {
              label: "Due Collected",
              value: data.dueCollected,
              tone: "success",
            },
            { label: "Closing Due", value: data.closingDue, tone: "warning" },
          ]}
        />
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}

type Tone = "success" | "warning" | "destructive" | "info";

function Grid({
  items,
}: {
  items: { label: string; value: number; tone?: Tone; raw?: boolean }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <div key={it.label} className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">{it.label}</p>
          <p className="mt-1.5 text-lg font-semibold tabular-nums">
            {it.raw ? (
              it.value
            ) : (
              <span
                className={
                  it.tone === "success"
                    ? "text-success"
                    : it.tone === "destructive"
                      ? "text-destructive"
                      : it.tone === "warning"
                        ? "text-[color-mix(in_oklab,var(--color-warning)_70%,black)]"
                        : it.tone === "info"
                          ? "text-info"
                          : ""
                }
              >
                {formatCurrency(it.value)}
              </span>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{formatCurrency(value)}</span>
    </div>
  );
}

/* ---------------------------- print HTML ---------------------------- */

function buildStatementHTML(data: StatementData) {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const fmt = (n: number) =>
    `৳ ${Math.abs(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const row = (label: string, value: string) => `
    <tr>
      <td>${escapeHtml(label)}</td>
      <td class="num">${escapeHtml(value)}</td>
    </tr>`;

  const block = (title: string, rows: string) => `
    <h2>${escapeHtml(title)}</h2>
    <table><tbody>${rows}</tbody></table>`;

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Statement — ${escapeHtml(businessSettings.businessName)}</title>
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
  .meta { font-size: 11px; color: #444; margin-bottom: 4px; }
  .header { border-bottom: 2px solid #000; padding-bottom: 12px; }
  table { width: 100%; border-collapse: collapse; margin-top: 4px; }
  th, td { border: 1px solid #000; padding: 6px 10px; font-size: 11px; }
  td.num { text-align: right; font-variant-numeric: tabular-nums; }
  .footer { margin-top: 24px; border-top: 1px solid #999; padding-top: 10px;
            font-size: 10px; color: #555; text-align: center; }
  @media print { body { padding: 12mm; } @page { margin: 12mm; size: A4 portrait; } }
</style>
</head>
<body>
  <div class="header">
    <h1>${escapeHtml(businessSettings.businessName)}</h1>
    <div class="meta">${escapeHtml(businessSettings.address)}</div>
    <div class="meta">${escapeHtml(businessSettings.phone)}</div>
    <div class="meta" style="margin-top:6px">
      <strong>Business Statement</strong> · ${escapeHtml(data.rangeLabel)}
    </div>
    <div class="meta">Generated on ${today}</div>
  </div>

  ${block(
    "Business Summary",
    [
      row("Opening Balance", fmt(data.openingBalance)),
      row("Total Sales", fmt(data.totalSales)),
      row("Total Purchase", fmt(data.totalPurchase)),
      row("Total Expenses", fmt(data.totalExpenses)),
      row("Total Collection", fmt(data.totalCollection)),
      row("Total Due", fmt(data.totalDue)),
      row("Gross Profit", fmt(data.grossProfit)),
      row("Net Profit", fmt(data.netProfit)),
      row("Closing Balance", fmt(data.closingBalance)),
    ].join(""),
  )}

  ${block(
    "Sales Summary",
    [
      row("Number of Sales", String(data.salesCount)),
      row("Total Sales Amount", fmt(data.totalSales)),
      row("Paid", fmt(data.salesPaid)),
      row("Due", fmt(data.salesDue)),
      row("Sales Return", fmt(0)),
    ].join(""),
  )}

  ${block(
    "Purchase Summary",
    [
      row("Number of Purchases", String(data.purchaseCount)),
      row("Total Purchase Cost", fmt(data.totalPurchase)),
      row("Paid", fmt(data.purchasePaid)),
      row("Due", fmt(data.purchaseDue)),
      row("Purchase Return", fmt(0)),
    ].join(""),
  )}

  ${block(
    "Expense Summary",
    [
      row("Total Expenses", fmt(data.totalExpenses)),
      ...data.expensesByCategory.map((e) =>
        row(
          e.category.charAt(0).toUpperCase() + e.category.slice(1),
          fmt(e.amount),
        ),
      ),
    ].join(""),
  )}

  ${block(
    "Profit Summary",
    [
      row("Revenue", fmt(data.totalSales)),
      row("COGS", fmt(data.cogs)),
      row("Gross Profit", fmt(data.grossProfit)),
      row("Business Expenses", fmt(data.totalExpenses)),
      row("Net Profit", fmt(data.netProfit)),
      row("Profit Margin", `${data.profitMargin.toFixed(1)}%`),
    ].join(""),
  )}

  ${block(
    "Stock Summary",
    [
      row("Opening Stock Value", fmt(data.openingStockValue)),
      row("Purchased Stock Value", fmt(data.purchasedStockValue)),
      row("Sold Stock Value", fmt(data.soldStockValue)),
      row("Current Stock Value", fmt(data.currentStockValue)),
    ].join(""),
  )}

  ${block(
    "Due Summary",
    [
      row("Opening Due", fmt(data.openingDue)),
      row("New Due", fmt(data.newDue)),
      row("Due Collected", fmt(data.dueCollected)),
      row("Closing Due", fmt(data.closingDue)),
    ].join(""),
  )}

  <div class="footer">${escapeHtml(businessSettings.invoiceFooter)}</div>
  <script>window.onload = function(){ window.print(); };</script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
