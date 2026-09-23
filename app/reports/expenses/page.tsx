"use client";

import { Wallet } from "lucide-react";

import { ReportShell } from "@/components/reports/report-shell";
import { ReportsChart } from "@/components/reports/reports-chart";
import { ReportTable } from "@/components/reports/report-table";
import { expenses } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/format";

export default function ExpenseReportPage() {
  const total = expenses.reduce((s, e) => s + e.amount, 0);

  const categoryMap = new Map<string, number>();
  expenses.forEach((e) => {
    categoryMap.set(e.category, (categoryMap.get(e.category) ?? 0) + e.amount);
  });
  const byCategory = Array.from(categoryMap.entries()).map(
    ([category, amount]) => ({ category, amount }),
  );

  return (
    <ReportShell
      title="Expense Report"
      description="Expense breakdown by category"
      icon={Wallet}
      kpis={[
        { label: "Entries", value: expenses.length },
        {
          label: "Total Expenses",
          value: formatCurrency(total),
          tone: "destructive",
        },
        { label: "Categories", value: byCategory.length },
        {
          label: "Avg / Entry",
          value: formatCurrency(total / Math.max(1, expenses.length)),
        },
      ]}
      onPrint={() => window.print()}
      onExport={() => {}}
    >
      <ReportsChart
        title="Expenses by category"
        data={byCategory as unknown as Record<string, unknown>[]}
        xKey="category"
        series={[
          { key: "amount", label: "Amount", color: "var(--color-chart-3)" },
        ]}
      />
      <ReportTable
        columns={[
          { key: "date", header: "Date", render: (e) => formatDate(e.date) },
          { key: "category", header: "Category" },
          { key: "description", header: "Description" },
          { key: "paymentMethod", header: "Method" },
          {
            key: "amount",
            header: "Amount",
            align: "right",
            render: (e) => formatCurrency(e.amount),
          },
        ]}
        rows={expenses}
        rowKey={(e) => e.id}
        mapRow={(e) => ({ ...e })}
      />
    </ReportShell>
  );
}
