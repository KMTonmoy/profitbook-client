"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { monthlyProfitData } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";

export function ProfitChart() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Profit Overview</CardTitle>
        <p className="mt-1 text-xs text-muted-foreground">
          Monthly revenue, cost and profit — six-month view
        </p>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyProfitData}
              margin={{ top: 10, right: 8, left: -10, bottom: 0 }}
            >
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
                cursor={{
                  fill: "color-mix(in oklab, var(--color-muted) 60%, transparent)",
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, paddingTop: 6 }}
              />
              <Bar
                dataKey="revenue"
                fill="var(--color-chart-2)"
                radius={[6, 6, 0, 0]}
                name="Revenue"
              />
              <Bar
                dataKey="cost"
                fill="var(--color-chart-5)"
                radius={[6, 6, 0, 0]}
                name="Cost"
              />
              <Bar
                dataKey="profit"
                fill="var(--color-chart-1)"
                radius={[6, 6, 0, 0]}
                name="Profit"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
