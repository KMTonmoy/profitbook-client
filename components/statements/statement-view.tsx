"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/shared/date-range-picker";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { formatCurrency } from "@/lib/format";

export function StatementView() {
  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <p className="text-sm font-medium">Reporting period</p>
            <p className="text-xs text-muted-foreground">
              Choose a quick preset or a custom range
            </p>
          </div>
          <DateRangePicker defaultValue="month" />
        </CardContent>
      </Card>

      {/* Business Summary */}
      <Section title="Business Summary">
        <SummaryGrid
          items={[
            { label: "Opening Balance", value: 142000 },
            { label: "Total Sales", value: 245850 },
            { label: "Total Purchase", value: 162000 },
            { label: "Total Expenses", value: 72500 },
            { label: "Total Collection", value: 218000 },
            { label: "Total Due", value: 15200, tone: "warning" },
            { label: "Gross Profit", value: 68420, tone: "success" },
            { label: "Net Profit", value: -4080, tone: "destructive" },
            { label: "Closing Balance", value: 183450, tone: "success" },
          ]}
        />
      </Section>

      <Section title="Sales Summary">
        <SummaryGrid
          items={[
            { label: "Number of Sales", value: 154, raw: true },
            { label: "Total Sales Amount", value: 245850 },
            { label: "Paid", value: 218000, tone: "success" },
            { label: "Due", value: 15200, tone: "destructive" },
            { label: "Sales Return", value: 2600, raw: true },
          ]}
        />
      </Section>

      <Section title="Purchase Summary">
        <SummaryGrid
          items={[
            { label: "Number of Purchases", value: 42, raw: true },
            { label: "Total Purchase Cost", value: 162000 },
            { label: "Paid", value: 148000, tone: "success" },
            { label: "Due", value: 14000, tone: "destructive" },
            { label: "Purchase Return", value: 0, raw: true },
          ]}
        />
      </Section>

      <Section title="Expense Summary">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SummaryGrid
            items={[
              { label: "Total Expenses", value: 72500, tone: "destructive" },
            ]}
          />
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Breakdown by Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-1">
              {[
                { label: "Rent", value: 25000 },
                { label: "Salary", value: 32000 },
                { label: "Electricity", value: 4500 },
                { label: "Transport", value: 3800 },
                { label: "Marketing", value: 5000 },
                { label: "Packaging", value: 2200 },
              ].map((e) => (
                <div
                  key={e.label}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">{e.label}</span>
                  <span className="font-medium tabular-nums">
                    {formatCurrency(e.value)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section title="Profit Summary">
        <Card className="shadow-sm">
          <CardContent className="space-y-3 p-5 text-sm">
            <Row label="Revenue" value={245850} />
            <Row label="Cost of Goods Sold (COGS)" value={-177430} />
            <div className="flex items-center justify-between border-t pt-3 text-base font-semibold">
              <span>Gross Profit</span>
              <span className="tabular-nums text-success">
                {formatCurrency(68420)}
              </span>
            </div>
            <Row label="Business Expenses" value={-72500} />
            <div className="flex items-center justify-between border-t pt-3 text-base font-semibold">
              <span>Net Profit</span>
              <span className="tabular-nums text-destructive">
                {formatCurrency(-4080)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-muted-foreground">Profit Margin</span>
              <span className="font-semibold">-1.7%</span>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section title="Stock Summary">
        <SummaryGrid
          items={[
            { label: "Opening Stock Value", value: 412000 },
            { label: "Purchased Stock Value", value: 162000 },
            { label: "Sold Stock Value", value: 145500 },
            { label: "Current Stock Value", value: 428500, tone: "success" },
          ]}
        />
      </Section>

      <Section title="Due Summary">
        <SummaryGrid
          items={[
            { label: "Opening Due", value: 18400 },
            { label: "New Due", value: 12800 },
            { label: "Due Collected", value: 16000, tone: "success" },
            { label: "Closing Due", value: 15200, tone: "warning" },
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

function SummaryGrid({
  items,
}: {
  items: {
    label: string;
    value: number;
    tone?: "success" | "warning" | "destructive";
    raw?: boolean;
  }[];
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
