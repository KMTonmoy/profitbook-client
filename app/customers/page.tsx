import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { CustomerTable } from "@/components/customers/customer-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const metadata = { title: "Customers" };

export default function CustomersPage() {
  return (
    <AppShell title="Customers" subtitle="Manage your customers">
      <PageHeader title="Customers" description="Track purchases, payments and dues per customer">
        <Button size="sm" className="h-9 gap-1.5"><Plus className="h-4 w-4" /> Add Customer</Button>
      </PageHeader>
      <CustomerTable />
    </AppShell>
  );
}