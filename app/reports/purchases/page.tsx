"use client";

import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { ReportShell } from "@/components/reports/report-shell";
import { ReportTable } from "@/components/reports/report-table";
import { suppliers } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";

export default function PurchasesReportPage() {
  const rows = suppliers.map((s, i) => ({
    id: s.id,
    supplier: s.name,
    orders: 6 + i * 3,
    amount: 22000 + i * 8500,
    paid: 18000 + i * 7200,
    due: 4000 + i * 1300,
  }));

  const total = rows.reduce((a, r) => a + r.amount, 0);
  const paid = rows.reduce((a, r) => a + r.paid, 0);
  const due = rows.reduce((a, r) => a + r.due, 0);

  return (
    <ReportShell
      title="Purchase Report"
      description="Supplier purchases, payments and dues"
      icon={ShoppingCart}
      kpis={[
        { label: "Suppliers", value: rows.length },
        { label: "Purchased", value: formatCurrency(total) },
        { label: "Paid", value: formatCurrency(paid), tone: "success" },
        { label: "Due", value: formatCurrency(due), tone: "destructive" },
      ]}
      onPrint={() => window.print()}
      onExport={() => {
        toast.success("Purchase report exported");
      }}
    >
      <ReportTable
        columns={[
          { key: "supplier", header: "Supplier" },
          { key: "orders", header: "Orders", align: "right" },
          {
            key: "amount",
            header: "Purchased",
            align: "right",
            render: (r) => formatCurrency(r.amount),
          },
          {
            key: "paid",
            header: "Paid",
            align: "right",
            render: (r) => (
              <span className="text-success">{formatCurrency(r.paid)}</span>
            ),
          },
          {
            key: "due",
            header: "Due",
            align: "right",
            render: (r) => (
              <span className="text-destructive">{formatCurrency(r.due)}</span>
            ),
          },
        ]}
        rows={rows}
        rowKey={(r) => r.id}
        mapRow={(r) => ({
          supplier: r.supplier,
          orders: r.orders,
          amount: r.amount,
          paid: r.paid,
          due: r.due,
        })}
      />
    </ReportShell>
  );
}
