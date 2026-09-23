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
import { endpoints } from "@/lib/endpoints";
import { useBusinessSettingsOrDefault } from "@/hooks/use-business-settings";
import { formatCurrency, formatDate } from "@/lib/format";

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

export interface StatementData {
  range: { from: string; to: string };
  business: {
    openingBalance: number;
    totalSales: number;
    totalPurchase: number;
    totalExpenses: number;
    totalCollection: number;
    totalDue: number;
    grossProfit: number;
    netProfit: number;
    closingBalance: number;
  };
  sales: {
    count: number;
    amount: number;
    paid: number;
    due: number;
    returned: number;
  };
  purchases: {
    count: number;
    cost: number;
    paid: number;
    due: number;
    returned: number;
  };
  expenses: {
    total: number;
    byCategory: { category: string; amount: number }[];
  };
  profit: {
    revenue: number;
    cogs: number;
    grossProfit: number;
    expenses: number;
    netProfit: number;
    margin: number;
  };
  stock: {
    openingValue: number;
    purchasedValue: number;
    soldValue: number;
    currentValue: number;
  };
  due: { opening: number; newDue: number; collected: number; closing: number };
}

interface PrintBusinessInfo {
  businessName: string;
  address: string;
  phone: string;
  email?: string;
  invoiceFooter: string;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

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

function isoDate(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
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

const EMPTY: StatementData = {
  range: { from: "", to: "" },
  business: {
    openingBalance: 0,
    totalSales: 0,
    totalPurchase: 0,
    totalExpenses: 0,
    totalCollection: 0,
    totalDue: 0,
    grossProfit: 0,
    netProfit: 0,
    closingBalance: 0,
  },
  sales: { count: 0, amount: 0, paid: 0, due: 0, returned: 0 },
  purchases: { count: 0, cost: 0, paid: 0, due: 0, returned: 0 },
  expenses: { total: 0, byCategory: [] },
  profit: {
    revenue: 0,
    cogs: 0,
    grossProfit: 0,
    expenses: 0,
    netProfit: 0,
    margin: 0,
  },
  stock: { openingValue: 0, purchasedValue: 0, soldValue: 0, currentValue: 0 },
  due: { opening: 0, newDue: 0, collected: 0, closing: 0 },
};

export const StatementView = React.forwardRef<StatementHandle>(
  function StatementView(_props, ref) {
    const { settings } = useBusinessSettingsOrDefault();

    const [preset, setPreset] = React.useState<RangePreset>("month");
    const [customFrom, setCustomFrom] = React.useState(() => {
      const d = new Date();
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-01`;
    });
    const [customTo, setCustomTo] = React.useState(todayISO());

    const [data, setData] = React.useState<StatementData>(EMPTY);
    const [error, setError] = React.useState<string | null>(null);
    const [version, setVersion] = React.useState(0);
    const [fetchedFor, setFetchedFor] = React.useState<string | null>(null);

    const range = React.useMemo(
      () => rangeForPreset(preset, customFrom, customTo),
      [preset, customFrom, customTo],
    );
    const fromIso = isoDate(range.from);
    const toIso = isoDate(range.to);
    const key = `${fromIso}|${toIso}|${version}`;
    const isLoading = fetchedFor !== key;

    React.useEffect(() => {
      let cancelled = false;

      endpoints.statements
        .generate(fromIso, toIso)
        .then((res) => {
          if (cancelled) return;
          setData(res as StatementData);
          setError(null);
          setFetchedFor(key);
        })
        .catch((err: Error) => {
          if (cancelled) return;
          setError(err.message);
          setData(EMPTY);
          setFetchedFor(key);
        });

      return () => {
        cancelled = true;
      };
    }, [fromIso, toIso, key]);

    React.useImperativeHandle(ref, () => ({
      print: () => {
        if (isLoading) {
          toast.error("Statement is still loading");
          return;
        }
        openPrintWindow(data, settings);
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

            <button
              type="button"
              onClick={() => setVersion((v) => v + 1)}
              className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <CalendarRange className="h-4 w-4" />
              {isLoading ? "Loading…" : "Auto-updates · click to refresh"}
            </button>
          </CardContent>
        </Card>

        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            Failed to load statement: {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-xl border p-12 text-center text-sm text-muted-foreground">
            Loading statement…
          </div>
        ) : (
          <StatementOutput data={data} />
        )}
      </div>
    );
  },
);

function StatementOutput({ data }: { data: StatementData }) {
  const b = data.business;

  return (
    <div className="space-y-6">
      <Section title="Business Summary">
        <Grid
          items={[
            { label: "Opening Balance", value: b.openingBalance },
            { label: "Total Sales", value: b.totalSales, tone: "info" },
            { label: "Total Purchase", value: b.totalPurchase },
            {
              label: "Total Expenses",
              value: b.totalExpenses,
              tone: "warning",
            },
            {
              label: "Total Collection",
              value: b.totalCollection,
              tone: "success",
            },
            { label: "Total Due", value: b.totalDue, tone: "destructive" },
            { label: "Gross Profit", value: b.grossProfit, tone: "success" },
            {
              label: "Net Profit",
              value: b.netProfit,
              tone: b.netProfit >= 0 ? "success" : "destructive",
            },
            {
              label: "Closing Balance",
              value: b.closingBalance,
              tone: "success",
            },
          ]}
        />
      </Section>

      <Section title="Sales Summary">
        <Grid
          items={[
            { label: "Number of Sales", value: data.sales.count, raw: true },
            { label: "Total Sales Amount", value: data.sales.amount },
            { label: "Paid", value: data.sales.paid, tone: "success" },
            { label: "Due", value: data.sales.due, tone: "destructive" },
            { label: "Sales Return", value: data.sales.returned },
          ]}
        />
      </Section>

      <Section title="Purchase Summary">
        <Grid
          items={[
            {
              label: "Number of Purchases",
              value: data.purchases.count,
              raw: true,
            },
            { label: "Total Purchase Cost", value: data.purchases.cost },
            { label: "Paid", value: data.purchases.paid, tone: "success" },
            { label: "Due", value: data.purchases.due, tone: "destructive" },
            { label: "Purchase Return", value: data.purchases.returned },
          ]}
        />
      </Section>

      <Section title="Expense Summary">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Grid
            items={[
              {
                label: "Total Expenses",
                value: data.expenses.total,
                tone: "destructive",
              },
            ]}
          />
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Breakdown by Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-1">
              {data.expenses.byCategory.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No expenses in this period.
                </p>
              ) : (
                data.expenses.byCategory.map((e) => (
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
            <Row label="Revenue" value={data.profit.revenue} />
            <Row label="Cost of Goods Sold (COGS)" value={-data.profit.cogs} />
            <div className="flex items-center justify-between border-t pt-3 text-base font-semibold">
              <span>Gross Profit</span>
              <span className="tabular-nums text-success">
                {formatCurrency(data.profit.grossProfit)}
              </span>
            </div>
            <Row label="Business Expenses" value={-data.profit.expenses} />
            <div className="flex items-center justify-between border-t pt-3 text-base font-semibold">
              <span>Net Profit</span>
              <span
                className={`tabular-nums ${
                  data.profit.netProfit >= 0
                    ? "text-success"
                    : "text-destructive"
                }`}
              >
                {formatCurrency(data.profit.netProfit)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-muted-foreground">Profit Margin</span>
              <span className="font-semibold tabular-nums">
                {data.profit.margin.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section title="Stock Summary">
        <Grid
          items={[
            { label: "Opening Stock Value", value: data.stock.openingValue },
            {
              label: "Purchased Stock Value",
              value: data.stock.purchasedValue,
            },
            { label: "Sold Stock Value", value: data.stock.soldValue },
            {
              label: "Current Stock Value",
              value: data.stock.currentValue,
              tone: "success",
            },
          ]}
        />
      </Section>

      <Section title="Due Summary">
        <Grid
          items={[
            { label: "Opening Due", value: data.due.opening },
            { label: "New Due", value: data.due.newDue, tone: "destructive" },
            {
              label: "Due Collected",
              value: data.due.collected,
              tone: "success",
            },
            { label: "Closing Due", value: data.due.closing, tone: "warning" },
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

function openPrintWindow(data: StatementData, biz: PrintBusinessInfo) {
  const w = window.open("", "_blank", "width=1100,height=850");
  if (!w) return;

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const fmt = (n: number) =>
    `৳ ${Math.abs(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const row = (label: string, value: string) =>
    `<tr><td>${esc(label)}</td><td class="num">${esc(value)}</td></tr>`;

  const block = (title: string, rows: string) =>
    `<h2>${esc(title)}</h2><table><tbody>${rows}</tbody></table>`;

  const rangeLabel = `${formatDate(data.range.from)} → ${formatDate(
    data.range.to,
  )}`;

  const html = `<!doctype html>
<html><head><meta charset="utf-8" /><title>Statement — ${esc(
    biz.businessName,
  )}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    color:#000; background:#fff; margin:0 auto; padding:16mm;
    width:210mm; min-height:297mm; font-size:12px; }
  h1 { font-size:20px; margin:0 0 4px; }
  h2 { font-size:13px; text-transform:uppercase; letter-spacing:0.06em;
       border-bottom:1px solid #000; padding-bottom:4px; margin:22px 0 8px; }
  .meta { font-size:11px; color:#444; margin-bottom:4px; }
  .header { border-bottom:2px solid #000; padding-bottom:12px; }
  table { width:100%; border-collapse:collapse; margin-top:4px; }
  th, td { border:1px solid #000; padding:6px 10px; font-size:11px; }
  td.num { text-align:right; font-variant-numeric:tabular-nums; }
  .footer { margin-top:24px; border-top:1px solid #999; padding-top:10px;
            font-size:10px; color:#555; text-align:center; }
  @media print { body { padding:12mm; } @page { margin:12mm; size:A4 portrait; } }
</style></head><body>
  <div class="header">
    <h1>${esc(biz.businessName)}</h1>
    <div class="meta">${esc(biz.address)}</div>
    <div class="meta">${esc(biz.phone)}</div>
    ${biz.email ? `<div class="meta">${esc(biz.email)}</div>` : ""}
    <div class="meta" style="margin-top:6px">
      <strong>Business Statement</strong> · ${esc(rangeLabel)}
    </div>
    <div class="meta">Generated on ${today}</div>
  </div>

  ${block(
    "Business Summary",
    [
      row("Opening Balance", fmt(data.business.openingBalance)),
      row("Total Sales", fmt(data.business.totalSales)),
      row("Total Purchase", fmt(data.business.totalPurchase)),
      row("Total Expenses", fmt(data.business.totalExpenses)),
      row("Total Collection", fmt(data.business.totalCollection)),
      row("Total Due", fmt(data.business.totalDue)),
      row("Gross Profit", fmt(data.business.grossProfit)),
      row("Net Profit", fmt(data.business.netProfit)),
      row("Closing Balance", fmt(data.business.closingBalance)),
    ].join(""),
  )}

  ${block(
    "Sales Summary",
    [
      row("Number of Sales", String(data.sales.count)),
      row("Total Sales Amount", fmt(data.sales.amount)),
      row("Paid", fmt(data.sales.paid)),
      row("Due", fmt(data.sales.due)),
      row("Sales Return", fmt(data.sales.returned)),
    ].join(""),
  )}

  ${block(
    "Purchase Summary",
    [
      row("Number of Purchases", String(data.purchases.count)),
      row("Total Purchase Cost", fmt(data.purchases.cost)),
      row("Paid", fmt(data.purchases.paid)),
      row("Due", fmt(data.purchases.due)),
      row("Purchase Return", fmt(data.purchases.returned)),
    ].join(""),
  )}

  ${block(
    "Expense Summary",
    [
      row("Total Expenses", fmt(data.expenses.total)),
      ...data.expenses.byCategory.map((e) =>
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
      row("Revenue", fmt(data.profit.revenue)),
      row("COGS", fmt(data.profit.cogs)),
      row("Gross Profit", fmt(data.profit.grossProfit)),
      row("Business Expenses", fmt(data.profit.expenses)),
      row("Net Profit", fmt(data.profit.netProfit)),
      row("Profit Margin", `${data.profit.margin.toFixed(1)}%`),
    ].join(""),
  )}

  ${block(
    "Stock Summary",
    [
      row("Opening Stock Value", fmt(data.stock.openingValue)),
      row("Purchased Stock Value", fmt(data.stock.purchasedValue)),
      row("Sold Stock Value", fmt(data.stock.soldValue)),
      row("Current Stock Value", fmt(data.stock.currentValue)),
    ].join(""),
  )}

  ${block(
    "Due Summary",
    [
      row("Opening Due", fmt(data.due.opening)),
      row("New Due", fmt(data.due.newDue)),
      row("Due Collected", fmt(data.due.collected)),
      row("Closing Due", fmt(data.due.closing)),
    ].join(""),
  )}

  <div class="footer">${esc(biz.invoiceFooter)}</div>
  <script>window.onload = function(){ window.print(); };</script>
</body></html>`;

  w.document.write(html);
  w.document.close();
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
