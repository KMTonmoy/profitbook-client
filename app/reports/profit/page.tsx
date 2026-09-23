"use client";

import { TrendingUp } from "lucide-react";

import { ReportShell } from "@/components/reports/report-shell";
import { ReportsChart } from "@/components/reports/reports-chart";
import { ReportTable } from "@/components/reports/report-table";
import { monthlyProfitData } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";

export default function ProfitReportPage() {
  const revenue = monthlyProfitData.reduce((s, x) => s + x.revenue, 0);
  const profit = monthlyProfitData.reduce((s, x) => s + x.profit, 0);
  const expenses = monthlyProfitData.reduce((s, x) => s + x.expenses, 0);
  const net = monthlyProfitData.reduce((s, x) => s + x.netProfit, 0);

  return (
    <ReportShell
      title="Profit Report"
      description="Gross and net profit by period"
      icon={TrendingUp}
      kpis={[
        { label: "Revenue", value: formatCurrency(revenue), tone: "info" },
        {
          label: "Gross Profit",
          value: formatCurrency(profit),
          tone: "success",
        },
        { label: "Expenses", value: formatCurrency(expenses), tone: "warning" },
        {
          label: "Net Profit",
          value: formatCurrency(net),
          tone: net >= 0 ? "success" : "destructive",
        },
      ]}
      onPrint={() => window.print()}
      onExport={() => {}}
    >
      <ReportsChart
        title="Monthly profit breakdown"
        data={monthlyProfitData}
        xKey="name"
        series={[
          { key: "revenue", label: "Revenue", color: "var(--color-chart-2)" },
          { key: "cost", label: "Cost", color: "var(--color-chart-5)" },
          { key: "profit", label: "Profit", color: "var(--color-chart-1)" },
        ]}
      />
      <ReportTable
        columns={[
          { key: "name", header: "Month" },
          {
            key: "revenue",
            header: "Revenue",
            align: "right",
            render: (r) => formatCurrency(r.revenue),
          },
          {
            key: "cost",
            header: "Cost",
            align: "right",
            render: (r) => formatCurrency(r.cost),
          },
          {
            key: "profit",
            header: "Gross",
            align: "right",
            render: (r) => (
              <span className="text-success">{formatCurrency(r.profit)}</span>
            ),
          },
          {
            key: "expenses",
            header: "Expenses",
            align: "right",
            render: (r) => (
              <span className="text-destructive">
                {formatCurrency(r.expenses)}
              </span>
            ),
          },
          {
            key: "netProfit",
            header: "Net",
            align: "right",
            render: (r) => (
              <span
                className={
                  r.netProfit >= 0 ? "text-success" : "text-destructive"
                }
              >
                {formatCurrency(r.netProfit)}
              </span>
            ),
          },
        ]}
        rows={monthlyProfitData}
        rowKey={(r) => r.name}
        mapRow={(r) => ({ ...r })}
      />
    </ReportShell>
  );
}
