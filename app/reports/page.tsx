import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { ReportCard } from "@/components/reports/report-card";
import { DateRangePicker } from "@/components/shared/date-range-picker";
import {
  Receipt, ShoppingCart, TrendingUp, Wallet, Package, Users, BarChart3,
} from "lucide-react";

export const metadata = { title: "Reports" };

const reports = [
  { title: "Sales Report", description: "All invoices, revenue and payment status", icon: Receipt, tone: "success" as const, href: "/reports/sales" },
  { title: "Purchase Report", description: "Supplier purchases, payments and dues", icon: ShoppingCart, tone: "info" as const, href: "/reports/purchases" },
  { title: "Profit Report", description: "Gross and net profit by period", icon: TrendingUp, tone: "primary" as const, href: "/reports/profit" },
  { title: "Expense Report", description: "Expense breakdown by category", icon: Wallet, tone: "warning" as const, href: "/reports/expenses" },
  { title: "Stock Report", description: "Inventory value, movement and valuation", icon: Package, tone: "neutral" as const, href: "/reports/stock" },
  { title: "Customer Due Report", description: "Outstanding balances by customer", icon: Users, tone: "destructive" as const, href: "/reports/dues" },
  { title: "Product Performance", description: "Sales, cost and margin per product", icon: BarChart3, tone: "primary" as const, href: "/reports/products" },
];

export default function ReportsPage() {
  return (
    <AppShell title="Reports" subtitle="Analytics and insights">
      <PageHeader title="Reports" description="Analyze your business from every angle">
        <DateRangePicker defaultValue="month" />
      </PageHeader>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => <ReportCard key={r.title} {...r} />)}
      </div>
    </AppShell>
  );
}