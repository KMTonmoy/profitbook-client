"use client";

import { Users } from "lucide-react";

import { ReportShell } from "@/components/reports/report-shell";
import { ReportTable } from "@/components/reports/report-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { customers, dues } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/format";

export default function DuesReportPage() {
  const totalDue = customers.reduce((s, c) => s + c.totalDue, 0);
  const overdue = dues.filter((d) => d.status === "overdue").length;
  const overdueAmount = dues
    .filter((d) => d.status === "overdue")
    .reduce((s, d) => s + d.due, 0);

  const rows = customers.filter((c) => c.totalDue > 0);

  return (
    <ReportShell
      title="Customer Due Report"
      description="Outstanding balances by customer"
      icon={Users}
      kpis={[
        { label: "Customers", value: rows.length },
        { label: "Total Due", value: formatCurrency(totalDue), tone: "destructive" },
        { label: "Overdue", value: overdue, tone: "destructive" },
        { label: "Overdue Amount", value: formatCurrency(overdueAmount), tone: "warning" },
      ]}
      onPrint={() => window.print()}
      onExport={() => {}}
    >
      <ReportTable
        columns={[
          { key: "name", header: "Customer" },
          { key: "phone", header: "Phone" },
          {
            key: "totalPurchases",
            header: "Purchases",
            align: "right",
            render: (c) => formatCurrency(c.totalPurchases),
          },
          {
            key: "totalPaid",
            header: "Paid",
            align: "right",
            render: (c) => (
              <span className="text-success">{formatCurrency(c.totalPaid)}</span>
            ),
          },
          {
            key: "totalDue",
            header: "Due",
            align: "right",
            render: (c) => (
              <span className="text-destructive">
                {formatCurrency(c.totalDue)}
              </span>
            ),
          },
          {
            key: "lastPurchaseDate",
            header: "Last Purchase",
            render: (c) =>
              c.lastPurchaseDate ? formatDate(c.lastPurchaseDate) : "—",
          },
        ]}
        rows={rows}
        rowKey={(c) => c.id}
        mapRow={(c) => ({ ...c })}
      />
    </ReportShell>
  );
}