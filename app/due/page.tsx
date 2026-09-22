import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { DueTable } from "@/components/due/due-table";
import { CreditCard, AlertCircle, Calendar, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/format";

export const metadata = { title: "Due / Credit" };

export default function DuePage() {
  return (
    <AppShell title="Due / Credit" subtitle="Manage receivables">
      <PageHeader title="Due Management" description="Track outstanding customer dues and recoveries" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Receivable" value={formatCurrency(9100)} icon={CreditCard} tone="warning" />
        <StatCard label="Overdue" value={formatCurrency(3500)} icon={AlertCircle} tone="destructive" />
        <StatCard label="Due Today" value={formatCurrency(0)} icon={Calendar} tone="info" />
        <StatCard label="Collected This Month" value={formatCurrency(16000)} icon={CheckCircle2} tone="success" />
      </div>

      <div className="mt-6">
        <DueTable />
      </div>
    </AppShell>
  );
}