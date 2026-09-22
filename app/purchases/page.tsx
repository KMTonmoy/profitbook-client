import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const metadata = { title: "Purchases" };

export default function PurchasesPage() {
  return (
    <AppShell title="Purchases" subtitle="Manage supplier purchases">
      <PageHeader
        title="Purchases"
        description="Track all supplier purchases and dues"
      >
        <Button size="sm" className="h-9 gap-1.5">
          <Plus className="h-4 w-4" /> Add Purchase
        </Button>
      </PageHeader>
      {/* PurchasesTable component follows the same pattern as SalesTable / ExpenseTable */}
    </AppShell>
  );
}
