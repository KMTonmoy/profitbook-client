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
import { formatCurrency } from "@/lib/format";

interface Series {
  key: string;
  label: string;
  color: string;
}

interface Props {
  title: string;
  data: Record<string, unknown>[];
  xKey: string;
  series: Series[];
}

export function ReportsChart({ title, data, xKey, series }: Props) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey={xKey}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                tickFormatter={(v) => `${(Number(v) / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 10,
                  fontSize: 12,
                }}
                formatter={(value) => formatCurrency(Number(value ?? 0))}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              {series.map((s) => (
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  fill={s.color}
                  radius={[6, 6, 0, 0]}
                  name={s.label}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}