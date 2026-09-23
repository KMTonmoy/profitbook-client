"use client";

import {
  Receipt,
  ShoppingCart,
  TrendingUp,
  Package,
  CreditCard,
  Wallet,
} from "lucide-react";

import { StatCard } from "@/components/shared/stat-card";
import { formatCurrency } from "@/lib/format";

interface Summary {
  totalSales: number;
  totalPurchase: number;
  totalProfit: number;
  stockValue: number;
  totalDue: number;
  cashBalance: number;
  totalSalesChange: number;
  totalProfitChange: number;
}

interface Props {
  summary: Summary | null;
  loading?: boolean;
}

export function KpiGrid({ summary, loading }: Props) {
  const s = summary ?? {
    totalSales: 0,
    totalPurchase: 0,
    totalProfit: 0,
    stockValue: 0,
    totalDue: 0,
    cashBalance: 0,
    totalSalesChange: 0,
    totalProfitChange: 0,
  };

  const value = (n: number) => (loading ? "…" : formatCurrency(n));

  const items = [
    {
      label: "Total Sales",
      value: value(s.totalSales),
      icon: Receipt,
      tone: "success" as const,
      change: s.totalSalesChange,
      changeLabel: "vs previous 30 days",
    },
    {
      label: "Total Purchase",
      value: value(s.totalPurchase),
      icon: ShoppingCart,
      tone: "info" as const,
    },
    {
      label: "Total Profit",
      value: value(s.totalProfit),
      icon: TrendingUp,
      tone: "primary" as const,
      change: s.totalProfitChange,
      changeLabel: "vs previous 30 days",
    },
    {
      label: "Stock Value",
      value: value(s.stockValue),
      icon: Package,
      tone: "neutral" as const,
    },
    {
      label: "Total Due",
      value: value(s.totalDue),
      icon: CreditCard,
      tone: "warning" as const,
    },
    {
      label: "Cash Balance",
      value: value(s.cashBalance),
      icon: Wallet,
      tone: "success" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {items.map((d) => (
        <StatCard key={d.label} {...d} />
      ))}
    </div>
  );
}
