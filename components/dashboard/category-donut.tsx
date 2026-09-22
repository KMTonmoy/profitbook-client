"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categorySales } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";

const total = categorySales.reduce((s, c) => s + c.value, 0);

export function CategoryDonut() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Sales by Category</CardTitle>
        <p className="mt-1 text-xs text-muted-foreground">
          Distribution across product categories
        </p>
      </CardHeader>
      <CardContent className="pt-2">
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
                data={categorySales}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={82}
                paddingAngle={3}
                stroke="var(--color-background)"
                strokeWidth={2}
              >
                {categorySales.map((c) => (
                  <Cell key={c.name} fill={c.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="mt-3 space-y-2">
          {categorySales.map((c) => {
            const pct = (c.value / total) * 100;
            return (
              <li key={c.name} className="flex items-center gap-3 text-xs">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: c.color }}
                />
                <span className="flex-1 text-muted-foreground">{c.name}</span>
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
      </CardContent>
    </Card>
  );
}