"use client";

import { Package } from "lucide-react";

import { ReportShell } from "@/components/reports/report-shell";
import { ReportTable } from "@/components/reports/report-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { products, categories } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";

export default function StockReportPage() {
  const totalQty = products.reduce((s, p) => s + p.currentStock, 0);
  const totalValue = products.reduce(
    (s, p) => s + p.currentStock * p.purchasePrice,
    0,
  );
  const low = products.filter((p) => p.status !== "in-stock").length;

  return (
    <ReportShell
      title="Stock Report"
      description="Inventory value, movement and valuation"
      icon={Package}
      kpis={[
        { label: "Products", value: products.length },
        { label: "Units", value: totalQty },
        {
          label: "Stock Value",
          value: formatCurrency(totalValue),
          tone: "success",
        },
        { label: "Low/Out", value: low, tone: "destructive" },
      ]}
      onPrint={() => window.print()}
      onExport={() => {}}
    >
      <ReportTable
        columns={[
          { key: "name", header: "Product" },
          { key: "sku", header: "SKU" },
          {
            key: "category",
            header: "Category",
            render: (p) =>
              categories.find((c) => c.id === p.categoryId)?.name ?? "—",
          },
          {
            key: "stock",
            header: "Stock",
            align: "right",
            render: (p) => `${p.currentStock} ${p.unit}`,
          },
          {
            key: "value",
            header: "Value",
            align: "right",
            render: (p) => formatCurrency(p.currentStock * p.purchasePrice),
          },
          {
            key: "status",
            header: "Status",
            render: (p) => <StatusBadge status={p.status} />,
          },
        ]}
        rows={products}
        rowKey={(p) => p.id}
        mapRow={(p) => ({ ...p })}
      />
    </ReportShell>
  );
}
