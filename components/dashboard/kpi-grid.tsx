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

export function KpiGrid() {
  const data = [
    {
      label: "Total Sales",
      value: formatCurrency(245850),
      icon: Receipt,
      tone: "success" as const,
      change: 12.4,
      changeLabel: "from last month",
    },
    {
      label: "Total Purchase",
      value: formatCurrency(162000),
      icon: ShoppingCart,
      tone: "info" as const,
      change: -4.2,
      changeLabel: "from last month",
    },
    {
      label: "Total Profit",
      value: formatCurrency(68420),
      icon: TrendingUp,
      tone: "primary" as const,
      change: 8.7,
      changeLabel: "from last month",
    },
    {
      label: "Stock Value",
      value: formatCurrency(428500),
      icon: Package,
      tone: "neutral" as const,
      change: 3.1,
      changeLabel: "from last month",
    },
    {
      label: "Total Due",
      value: formatCurrency(15200),
      icon: CreditCard,
      tone: "warning" as const,
      change: 6.2,
      changeLabel: "from last month",
    },
    {
      label: "Cash Balance",
      value: formatCurrency(183450),
      icon: Wallet,
      tone: "success" as const,
      change: 9.4,
      changeLabel: "from last month",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {data.map((d) => (
        <StatCard key={d.label} {...d} />
      ))}
    </div>
  );
}