"use client";

import * as React from "react";
import { Plus, Printer } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ExpenseTable } from "@/components/expenses/expense-table";
import { AddExpenseForm } from "@/components/expenses/add-expense-form";
import { endpoints } from "@/lib/endpoints";
import { useApi } from "@/hooks/use-api";
import { useBusinessSettingsOrDefault } from "@/hooks/use-business-settings";
import type { Expense } from "@/lib/types";

export default function ExpensesPage() {
  const [open, setOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Expense | null>(null);

  const { settings } = useBusinessSettingsOrDefault();

  const { data, loading, error, refetch } = useApi<Expense[]>("/api/expenses");
  const items = data ?? [];

  const openCreate = () => {
    setEditTarget(null);
    setOpen(true);
  };

  const openEdit = (expense: Expense) => {
    setEditTarget(expense);
    setOpen(true);
  };

  const handleAdd = async (payload: Omit<Expense, "id">) => {
    try {
      await endpoints.expenses.create(payload);
      toast.success("Expense added", {
        description: `${payload.description} · ৳ ${payload.amount.toLocaleString("en-IN")}`,
      });
      refetch();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleUpdate = async (expense: Expense) => {
    try {
      await endpoints.expenses.update(expense.id, expense);
      toast.success("Expense updated", {
        description: expense.description,
      });
      refetch();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await endpoints.expenses.remove(id);
      toast.success("Expense deleted");
      refetch();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handlePrint = () => {
    const w = window.open("", "_blank", "width=1100,height=850");
    if (!w) return;

    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const rows = items
      .map(
        (e, i) => `
      <tr>
        <td class="ctr">${i + 1}</td>
        <td>${esc(e.date ?? "—")}</td>
        <td class="cap">${esc(e.category ?? "—")}</td>
        <td>${esc(e.description ?? "—")}</td>
        <td class="cap">${esc(e.paymentMethod ?? "—")}</td>
        <td class="num">${fmt(e.amount)}</td>
      </tr>`,
      )
      .join("");

    const total = items.reduce((s, e) => s + (e.amount || 0), 0);

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Expenses — ${esc(settings.businessName)}</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    color: #000; background: #fff;
    margin: 0 auto; padding: 16mm;
    width: 210mm; min-height: 297mm; font-size: 12px;
  }
  h1 { font-size: 20px; margin: 0 0 4px; }
  .header { border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 8px; }
  .meta { font-size: 11px; color: #444; }
  .report-title { margin-top: 12px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th, td { border: 1px solid #000; padding: 6px 10px; font-size: 11px; text-align: left; }
  th { text-transform: uppercase; font-size: 10px; font-weight: 600; }
  td.ctr, th.ctr { text-align: center; }
  td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
  td.cap { text-transform: capitalize; }
  tfoot td { font-weight: 700; background: #f5f5f5; }
  .footer { margin-top: 24px; border-top: 1px solid #999; padding-top: 10px; font-size: 10px; color: #555; text-align: center; }
  @media print { body { padding: 12mm; } @page { margin: 12mm; size: A4 portrait; } }
</style>
</head>
<body>
  <div class="header">
    <h1>${esc(settings.businessName)}</h1>
    <div class="meta">${esc(settings.address)}</div>
    <div class="meta">${esc(settings.phone)}</div>
    <div class="report-title">Expense Report</div>
    <div class="meta">${items.length} entries · Generated on ${today}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th class="ctr" style="width:32px">#</th>
        <th>Date</th>
        <th>Category</th>
        <th>Description</th>
        <th>Method</th>
        <th class="num">Amount</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr>
        <td colspan="5">Total Expenses</td>
        <td class="num">${fmt(total)}</td>
      </tr>
    </tfoot>
  </table>

  <div class="footer">${esc(settings.invoiceFooter)}</div>
  <script>window.onload = function(){ window.print(); };</script>
</body>
</html>`;

    w.document.write(html);
    w.document.close();
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
          onClick={handlePrint}
        >
          <Printer className="h-4 w-4" /> Print
        </Button>
        <Button size="sm" className="h-9 gap-1.5" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Expense
        </Button>
      </PageHeader>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load expenses: {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
          Loading expenses…
        </div>
      ) : (
        <ExpenseTable items={items} onDelete={handleDelete} onEdit={openEdit} />
      )}

      <AddExpenseForm
        key={`${open}-${editTarget?.id ?? "new"}`}
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setEditTarget(null);
        }}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        editTarget={editTarget}
      />
    </AppShell>
  );
}

function esc(s: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
  };
  return String(s).replace(/[&<>"]/g, (c) => map[c] ?? c);
}

function fmt(n: number): string {
  return `৳ ${(n ?? 0).toLocaleString("en-IN")}`;
}
