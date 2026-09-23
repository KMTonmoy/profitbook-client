"use client";

import * as React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { useApi } from "@/hooks/use-api";

interface CategorySlice {
  id: string;
  name: string;
  color: string;
  value: number;
}

export function CategoryDonut() {
  const { data, loading, error } = useApi<CategorySlice[]>(
    "/api/dashboard/sales-by-category",
  );

  const slices = (data ?? []).filter((c) => c.value > 0);

  const total = slices.reduce((s, c) => s + c.value, 0);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Sales by Category</CardTitle>
        <p className="mt-1 text-xs text-muted-foreground">
          Distribution across product categories
        </p>
      </CardHeader>
      <CardContent className="pt-2">
        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
            Failed to load: {error}
          </div>
        )}

        {loading ? (
          <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
            Loading…
          </div>
        ) : slices.length === 0 ? (
          <div className="flex h-[220px] flex-col items-center justify-center gap-1 text-center">
            <p className="text-sm text-muted-foreground">
              No sales by category yet.
            </p>
            <p className="text-xs text-muted-foreground">
              Record a sale to see the distribution.
            </p>
          </div>
        ) : (
          <>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
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
                  <Pie
                    data={slices}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={82}
                    paddingAngle={3}
                    stroke="var(--color-background)"
                    strokeWidth={2}
                  >
                    {slices.map((c) => (
                      <Cell key={c.id} fill={c.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <ul className="mt-3 space-y-2">
              {slices.map((c) => {
                const pct = total > 0 ? (c.value / total) * 100 : 0;
                return (
                  <li key={c.id} className="flex items-center gap-3 text-xs">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: c.color }}
                    />
                    <span className="flex-1 text-muted-foreground">
                      {c.name}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      {pct.toFixed(0)}%
                    </span>
                    <span className="w-20 text-right font-medium tabular-nums">
                      {formatCurrency(c.value)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
