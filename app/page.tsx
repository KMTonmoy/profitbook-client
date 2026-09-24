"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { SalesPurchaseChart } from "@/components/dashboard/sales-purchase-chart";
import { ProfitChart } from "@/components/dashboard/profit-chart";
import { CategoryDonut } from "@/components/dashboard/category-donut";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { LowStock } from "@/components/dashboard/low-stock";
import { RecentDues } from "@/components/dashboard/recent-dues";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  KpiSkeleton,
  ChartSkeleton,
  TableSkeleton,
  ListSkeleton,
} from "@/components/skeletons";
import { useApi } from "@/hooks/use-api";
import type { Product, Sale, Due } from "@/lib/types";

interface Summary {
  totalSales: number;
  totalPurchase: number;
  totalProfit: number;
  stockValue: number;
  totalDue: number;
  cashBalance: number;
  totalSalesChange: number;
  totalProfitChange: number;
  recentSalesCount: number;
  lowStockCount: number;
  dueCustomersCount: number;
}

interface ChartPoint {
  name: string;
  sales: number;
  purchases: number;
  profit: number;
}

const IDLE_TIMEOUT_MS = 60_000;

export default function DashboardPage() {
  const greeting = "Good morning, Tonmoy";
  const pathname = usePathname();

  const [showFinancials, setShowFinancials] = React.useState(false);
  const reveal = () => setShowFinancials(true);

  React.useEffect(() => {
    if (!showFinancials) return;

    const hide = () => setShowFinancials(false);
    const onVisibility = () => {
      if (document.visibilityState === "hidden") hide();
    };

    window.addEventListener("blur", hide);
    document.addEventListener("visibilitychange", onVisibility);

    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    const resetIdle = () => {
      if (idleTimer) clearTimeout(idleTimer);
      if (IDLE_TIMEOUT_MS > 0) {
        idleTimer = setTimeout(hide, IDLE_TIMEOUT_MS);
      }
    };
    resetIdle();
    window.addEventListener("mousemove", resetIdle);
    window.addEventListener("keydown", resetIdle);
    window.addEventListener("scroll", resetIdle, { passive: true });
    window.addEventListener("click", resetIdle);

    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      window.removeEventListener("blur", hide);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("keydown", resetIdle);
      window.removeEventListener("scroll", resetIdle);
      window.removeEventListener("click", resetIdle);
      hide();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFinancials, pathname]);

  const { data: summary, loading: loadingSummary } = useApi<Summary>(
    "/api/dashboard/summary",
  );

  const { data: chart, loading: loadingChart } = useApi<{
    series: ChartPoint[];
  }>("/api/dashboard/charts?range=30d");

  const { data: salesReport, loading: loadingSales } = useApi<{
    revenue: number;
    cogs: number;
    grossProfit: number;
    expenses: number;
    netProfit: number;
    margin: number;
    monthly: { month: string; revenue: number; cost: number; profit: number }[];
  }>("/api/reports/profit");

  const { data: recentSales, loading: loadingRecentSales } = useApi<Sale[]>(
    "/api/dashboard/recent-sales",
  );

  const { data: lowStock, loading: loadingLowStock } = useApi<Product[]>(
    "/api/dashboard/low-stock",
  );

  const { data: recentDues, loading: loadingRecentDues } = useApi<Due[]>(
    "/api/dashboard/recent-dues",
  );

  return (
    <AppShell title="Dashboard" subtitle="Here's your business overview.">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{greeting}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s your business overview.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-10 shrink-0 gap-2 px-4"
          onClick={() => (showFinancials ? setShowFinancials(false) : reveal())}
        >
          {showFinancials ? (
            <>
              <EyeOff className="h-4 w-4" />
              Hide Financials
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Show Financials
            </>
          )}
        </Button>
      </div>

      {showFinancials ? (
        <>
          {loadingSummary ? <KpiSkeleton /> : <KpiGrid summary={summary} />}

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {loadingChart ? (
                <ChartSkeleton />
              ) : (
                <SalesPurchaseChart data={chart?.series ?? []} />
              )}
            </div>
            <div className="lg:col-span-1">
              <CategoryDonut />
            </div>
          </div>

          <div className="mt-6">
            {loadingSales ? (
              <ChartSkeleton height="h-[300px]" bars={6} />
            ) : (
              <ProfitChart monthly={salesReport?.monthly ?? []} />
            )}
          </div>

          <div className="mt-6">
            {loadingRecentSales ? (
              <TableSkeleton rows={6} cols={7} />
            ) : (
              <RecentSales items={recentSales ?? []} />
            )}
          </div>
        </>
      ) : (
        <PublicOverview
          lowStock={lowStock ?? []}
          recentDues={recentDues ?? []}
          summary={summary}
          loadingSummary={loadingSummary}
          loadingLowStock={loadingLowStock}
          loadingRecentDues={loadingRecentDues}
        />
      )}
    </AppShell>
  );
}

function PublicOverview({
  lowStock,
  recentDues,
  summary,
  loadingSummary,
  loadingLowStock,
  loadingRecentDues,
}: {
  lowStock: Product[];
  recentDues: Due[];
  summary: Summary | null;
  loadingSummary: boolean;
  loadingLowStock: boolean;
  loadingRecentDues: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Lock className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Financial data is hidden</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Sales, purchases, profit, cash balance and invoices are not
              visible on this screen. Click{" "}
              <strong className="text-foreground">Show Financials</strong> to
              reveal them.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CountCard
          label="Recent Sales"
          value={summary?.recentSalesCount}
          description="In the last 30 days"
          loading={loadingSummary}
        />
        <CountCard
          label="Customers with Due"
          value={summary?.dueCustomersCount}
          description="Need follow-up"
          loading={loadingSummary}
        />
        <CountCard
          label="Low Stock Items"
          value={summary?.lowStockCount}
          description="Need restocking"
          loading={loadingSummary}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {loadingLowStock ? (
          <ListSkeleton rows={5} />
        ) : (
          <LowStock items={lowStock} />
        )}
        {loadingRecentDues ? (
          <ListSkeleton rows={5} />
        ) : (
          <RecentDues items={recentDues} />
        )}
      </div>
    </div>
  );
}

function CountCard({
  label,
  value,
  description,
  loading,
}: {
  label: string;
  value?: number;
  description: string;
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {loading ? (
        <>
          <Skeleton className="mt-2 h-7 w-16" />
          <Skeleton className="mt-2 h-3 w-28" />
        </>
      ) : (
        <>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {value ?? 0}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </>
      )}
    </div>
  );
}
