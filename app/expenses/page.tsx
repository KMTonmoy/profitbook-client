"use client";

import * as React from "react";
import { Plus, Download } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { ExpenseTable } from "@/components/expenses/expense-table";
import { AddExpenseForm } from "@/components/expenses/add-expense-form";
import { Button } from "@/components/ui/button";
import { expenses as initialExpenses } from "@/lib/mock-data";
import type { Expense } from "@/lib/types";
import { ExportExpensesDialog } from "@/components/expenses/export-expenses-dialog";

export default function ExpensesPage() {
  const [open, setOpen] = React.useState(false);
  const [exportOpen, setExportOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Expense | null>(null);
  const [items, setItems] = React.useState<Expense[]>(initialExpenses);

  const handleAdd = (data: Omit<Expense, "id">) => {
    const expense: Expense = {
      ...data,
      id: `exp-${crypto.randomUUID()}`,
    };
    setItems((prev) => [expense, ...prev]);
  };

  const handleUpdate = (expense: Expense) => {
    setItems((prev) => prev.map((e) => (e.id === expense.id ? expense : e)));
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((e) => e.id !== id));
  };

  const openCreate = () => {
    setEditTarget(null);
    setOpen(true);
  };

  const openEdit = (expense: Expense) => {
    setEditTarget(expense);
    setOpen(true);
  };

  return (
    <AppShell title="Expenses" subtitle="Track business expenses">
      <PageHeader
        title="Expenses"
        description="Record and manage all business expenses"
      >
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1.5"
          onClick={() => setExportOpen(true)}
        >
          <Download className="h-4 w-4" /> Export
        </Button>
        <Button size="sm" className="h-9 gap-1.5" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Expense
        </Button>
      </PageHeader>

      <ExpenseTable items={items} onDelete={handleDelete} onEdit={openEdit} />

      <AddExpenseForm
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setEditTarget(null);
        }}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        editTarget={editTarget}
      />

      <ExportExpensesDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        expenses={items}
      />
    </AppShell>
  );
}
