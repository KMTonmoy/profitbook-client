import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfitChart } from "@/components/dashboard/profit-chart";
import { DateRangePicker } from "@/components/shared/date-range-picker";
import {
  Receipt,
  TrendingUp,
  Wallet,
  Percent,
  DollarSign,
  CircleDollarSign,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";

export const metadata = { title: "Profit & Loss" };

export default function ProfitLossPage() {
  return (
    <AppShell title="Profit & Loss" subtitle="Financial analytics">
      <PageHeader
        title="Profit & Loss"
        description="Revenue, cost, expenses and profit analysis"
      >
        <DateRangePicker defaultValue="month" />
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Revenue"
          value={formatCurrency(245850)}
          icon={Receipt}
          tone="info"
        />
        <StatCard
          label="COGS"
          value={formatCurrency(177430)}
          icon={CircleDollarSign}
          tone="neutral"
        />
        <StatCard
          label="Gross Profit"
          value={formatCurrency(68420)}
          icon={TrendingUp}
          tone="success"
        />
        <StatCard
          label="Expenses"
          value={formatCurrency(72500)}
          icon={Wallet}
          tone="warning"
        />
        <StatCard
          label="Net Profit"
          value={formatCurrency(-4080)}
          icon={DollarSign}
          tone="destructive"
        />
        <StatCard
          label="Profit Margin"
          value="-1.7%"
          icon={Percent}
          tone="destructive"
        />
      </div>

      <div className="mt-6">
        <ProfitChart />
      </div>

      <Card className="mt-6 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Profit Calculation Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Row label="Revenue" value={formatCurrency(245850)} />
          <Row
            label="− Cost of Goods Sold (COGS)"
            value={formatCurrency(-177430)}
          />
          <div className="flex items-center justify-between border-t pt-3 text-base font-semibold">
            <span>= Gross Profit</span>
            <span className="tabular-nums text-success">
              {formatCurrency(68420)}
            </span>
          </div>
          <Row label="− Business Expenses" value={formatCurrency(-72500)} />
          <div className="flex items-center justify-between border-t pt-3 text-base font-semibold">
            <span>= Net Profit</span>
            <span className="tabular-nums text-destructive">
              {formatCurrency(-4080)}
            </span>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
