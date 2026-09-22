"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { salesPurchaseChart } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";

const ranges = ["7d", "30d", "6m", "1y"] as const;
const labels: Record<(typeof ranges)[number], string> = {
  "7d": "7 Days",
  "30d": "30 Days",
  "6m": "6 Months",
  "1y": "1 Year",
};

export function SalesPurchaseChart() {
  const [range, setRange] = React.useState<(typeof ranges)[number]>("7d");
  const data = salesPurchaseChart[range];

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
        <div>
          <CardTitle className="text-base">Sales & Purchase Overview</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Revenue vs purchase cost vs profit
          </p>
        </div>
        <div className="flex items-center gap-0.5 rounded-lg border bg-muted/40 p-0.5">
          {ranges.map((r) => (
            <Button
              key={r}
              variant="ghost"
              size="sm"
              onClick={() => setRange(r)}
              className={cn(
                "h-7 rounded-md px-2.5 text-xs font-medium",
                range === r
                  ? "bg-background text-foreground shadow-sm hover:bg-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {labels[r]}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 8, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gSales" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-chart-1)"
                    stopOpacity={0.28}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-chart-1)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="gPurchases" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-chart-2)"
                    stopOpacity={0.22}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-chart-2)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="gProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-chart-3)"
                    stopOpacity={0.25}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-chart-3)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                minTickGap={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                tickFormatter={(value) =>
                  `${(Number(value) / 1000).toFixed(0)}k`
                }
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 10,
                  fontSize: 12,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                }}
                formatter={(value) => formatCurrency(Number(value ?? 0))}
              />

              <Area
                type="monotone"
                dataKey="sales"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                fill="url(#gSales)"
                name="Sales"
              />
              <Area
                type="monotone"
                dataKey="purchases"
                stroke="var(--color-chart-2)"
                strokeWidth={2}
                fill="url(#gPurchases)"
                name="Purchases"
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="var(--color-chart-3)"
                strokeWidth={2}
                fill="url(#gProfit)"
                name="Profit"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
          <LegendDot color="var(--color-chart-1)" label="Sales" />
          <LegendDot color="var(--color-chart-2)" label="Purchases" />
          <LegendDot color="var(--color-chart-3)" label="Profit" />
        </div>
      </CardContent>
    </Card>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
