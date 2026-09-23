"use client";

import * as React from "react";

import { AppShell } from "@/components/layout/app-shell";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { SalesPurchaseChart } from "@/components/dashboard/sales-purchase-chart";
import { ProfitChart } from "@/components/dashboard/profit-chart";
import { CategoryDonut } from "@/components/dashboard/category-donut";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { LowStock } from "@/components/dashboard/low-stock";
import { RecentDues } from "@/components/dashboard/recent-dues";
import type { Product, Sale, Due } from "@/lib/types";
import { useApi } from "@/hooks/use-api";

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

export default function DashboardPage() {
  const greeting = "Good morning, Tonmoy";

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
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{greeting}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s your business overview.
        </p>
      </div>

      <KpiGrid summary={summary} loading={loadingSummary} />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesPurchaseChart
            data={chart?.series ?? []}
            loading={loadingChart}
          />
        </div>
        <div className="lg:col-span-1">
          <CategoryDonut />
        </div>
      </div>

      <div className="mt-6">
        <ProfitChart
          monthly={salesReport?.monthly ?? []}
          loading={loadingSales}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LowStock items={lowStock ?? []} loading={loadingLowStock} />
        <RecentDues items={recentDues ?? []} loading={loadingRecentDues} />
      </div>

      <div className="mt-6">
        <RecentSales items={recentSales ?? []} loading={loadingRecentSales} />
      </div>
    </AppShell>
  );
}
