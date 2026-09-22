import { AppShell } from "@/components/layout/app-shell";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { SalesPurchaseChart } from "@/components/dashboard/sales-purchase-chart";
import { ProfitChart } from "@/components/dashboard/profit-chart";
import { CategoryDonut } from "@/components/dashboard/category-donut";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { LowStock } from "@/components/dashboard/low-stock";
import { RecentDues } from "@/components/dashboard/recent-dues";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  const greeting = "Good morning, Tonmoy";

  return (
    <AppShell title="Dashboard" subtitle="Here's your business overview.">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{greeting}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s your business overview.
        </p>
      </div>

      <KpiGrid />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesPurchaseChart />
        </div>
        <div className="lg:col-span-1">
          <CategoryDonut />
        </div>
      </div>

      <div className="mt-6">
        <ProfitChart />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LowStock />
        <RecentDues />
      </div>

      <div className="mt-6">
        <RecentSales />
      </div>
    </AppShell>
  );
}
