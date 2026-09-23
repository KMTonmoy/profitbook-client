"use client";

import { BarChart3 } from "lucide-react";

import { ReportShell } from "@/components/reports/report-shell";
import { ReportsChart } from "@/components/reports/reports-chart";
import { ReportTable } from "@/components/reports/report-table";
import { productPerformance } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";

export default function ProductPerformancePage() {
  const totalProfit = productPerformance.reduce((s, p) => s + p.profit, 0);
  const totalRevenue = productPerformance.reduce(
    (s, p) => s + p.salesRevenue,
    0,
  );
  const avgMargin =
    productPerformance.reduce((s, p) => s + p.margin, 0) /
    Math.max(1, productPerformance.length);

  return (
    <ReportShell
      title="Product Performance"
      description="Sales, cost and margin per product"
      icon={BarChart3}
      kpis={[
        { label: "Products", value: productPerformance.length },
        { label: "Revenue", value: formatCurrency(totalRevenue), tone: "info" },
        {
          label: "Profit",
          value: formatCurrency(totalProfit),
          tone: "success",
        },
        { label: "Avg Margin", value: `${avgMargin.toFixed(1)}%` },
      ]}
      onPrint={() => window.print()}
      onExport={() => {}}
    >
      <ReportsChart
        title="Profit by product"
        data={productPerformance}
        xKey="name"
        series={[
          { key: "profit", label: "Profit", color: "var(--color-chart-1)" },
        ]}
      />
      <ReportTable
        columns={[
          { key: "name", header: "Product" },
          { key: "sold", header: "Sold", align: "right" },
          { key: "stock", header: "Stock", align: "right" },
          {
            key: "salesRevenue",
            header: "Revenue",
            align: "right",
            render: (p) => formatCurrency(p.salesRevenue),
          },
          {
            key: "purchaseCost",
            header: "Cost",
            align: "right",
            render: (p) => formatCurrency(p.purchaseCost),
          },
          {
            key: "profit",
            header: "Profit",
            align: "right",
            render: (p) => (
              <span className="text-success">{formatCurrency(p.profit)}</span>
            ),
          },
          {
            key: "margin",
            header: "Margin",
            align: "right",
            render: (p) => `${p.margin.toFixed(1)}%`,
          },
        ]}
        rows={productPerformance}
        rowKey={(p) => p.id}
        mapRow={(p) => ({ ...p })}
      />
    </ReportShell>
  );
}
