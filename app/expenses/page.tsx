import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { ExpenseTable } from "@/components/expenses/expense-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const metadata = { title: "Expenses" };

export default function ExpensesPage() {
  return (
    <AppShell title="Expenses" subtitle="Track business expenses">
      <PageHeader title="Expenses" description="Record and manage all business expenses">
        <Button size="sm" className="h-9 gap-1.5">
          <Plus className="h-4 w-4" /> Add Expense
        </Button>
      </PageHeader>
      <ExpenseTable />
    </AppShell>
  );
}