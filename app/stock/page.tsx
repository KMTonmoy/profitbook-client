import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StockMovementTable } from "@/components/stock/stock-movement-table";
import { Package, Boxes, Wallet, AlertTriangle, XCircle } from "lucide-react";
import { products } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";

export const metadata = { title: "Stock" };

export default function StockPage() {
  const totalQty = products.reduce((s, p) => s + p.currentStock, 0);
  const totalValue = products.reduce(
    (s, p) => s + p.currentStock * p.purchasePrice,
    0,
  );
  const low = products.filter((p) => p.status === "low-stock").length;
  const out = products.filter((p) => p.status === "out-of-stock").length;

  return (
    <AppShell title="Stock" subtitle="Inventory levels and movements">
      <PageHeader
        title="Stock Management"
        description="Track stock levels across all products"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Total Products"
          value={products.length}
          icon={Package}
          tone="primary"
        />
        <StatCard
          label="Total Quantity"
          value={totalQty.toLocaleString()}
          icon={Boxes}
          tone="info"
        />
        <StatCard
          label="Stock Value"
          value={formatCurrency(totalValue)}
          icon={Wallet}
          tone="success"
        />
        <StatCard
          label="Low Stock"
          value={low}
          icon={AlertTriangle}
          tone="warning"
        />
        <StatCard
          label="Out of Stock"
          value={out}
          icon={XCircle}
          tone="destructive"
        />
      </div>

      <div className="mt-6">
        <StockMovementTable />
      </div>
    </AppShell>
  );
}
