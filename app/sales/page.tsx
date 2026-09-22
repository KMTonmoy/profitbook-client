import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { SalesTable } from "@/components/sales/sales-table";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

export const metadata = { title: "Sales" };

export default function SalesPage() {
  return (
    <AppShell title="Sales" subtitle="Track invoices and payments">
      <PageHeader
        title="Sales"
        description="Manage invoices, customers and payments"
      >
        <Button variant="outline" size="sm" className="h-9 gap-1.5">
          <Download className="h-4 w-4" /> Export
        </Button>
        <Button size="sm" className="h-9 gap-1.5">
          <Plus className="h-4 w-4" /> Add Sale
        </Button>
      </PageHeader>

      <SalesTable />
    </AppShell>
  );
}