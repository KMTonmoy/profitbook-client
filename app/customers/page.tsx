"use client";

import * as React from "react";
import { Plus, Printer } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { CustomerTable } from "@/components/customers/customer-table";
import { Button } from "@/components/ui/button";
import { endpoints } from "@/lib/endpoints";
import { businessSettings } from "@/lib/mock-data";
import type { Customer } from "@/lib/types";
import { useApi } from "@/hooks/use-api";
import { AddCustomerForm } from "@/components/customers/add-customer-form";

export default function CustomersPage() {
  const [open, setOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Customer | null>(null);

  const { data, loading, error, refetch } =
    useApi<Customer[]>("/api/customers");
  const items = data ?? [];

  const openCreate = () => {
    setEditTarget(null);
    setOpen(true);
  };

  const openEdit = (customer: Customer) => {
    setEditTarget(customer);
    setOpen(true);
  };

  const handleAdd = async (payload: Omit<Customer, "id">) => {
    try {
      await endpoints.customers.create(payload);
      toast.success("Customer added");
      refetch();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleUpdate = async (customer: Customer) => {
    try {
      await endpoints.customers.update(customer.id, customer);
      toast.success("Customer updated");
      refetch();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await endpoints.customers.remove(id);
      toast.success("Customer deleted");
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
        (c, i) => `
      <tr>
        <td class="ctr">${i + 1}</td>
        <td>${esc(c.name)}</td>
        <td>${esc(c.phone)}</td>
        <td>${esc(c.address ?? "—")}</td>
        <td class="num">${fmt(c.totalPurchases)}</td>
        <td class="num">${fmt(c.totalPaid)}</td>
        <td class="num">${fmt(c.totalDue)}</td>
      </tr>`,
      )
      .join("");

    const totals = items.reduce(
      (a, c) => ({
        purchases: a.purchases + (c.totalPurchases || 0),
        paid: a.paid + (c.totalPaid || 0),
        due: a.due + (c.totalDue || 0),
      }),
      { purchases: 0, paid: 0, due: 0 },
    );

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Customers — ${esc(businessSettings.businessName)}</title>
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
  .report-title {
    margin-top: 12px; font-size: 14px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th, td {
    border: 1px solid #000;
    padding: 6px 10px;
    font-size: 11px;
    text-align: left;
  }
  th { text-transform: uppercase; font-size: 10px; font-weight: 600; }
  td.ctr, th.ctr { text-align: center; }
  td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
  tfoot td { font-weight: 700; background: #f5f5f5; }
  .footer {
    margin-top: 24px; border-top: 1px solid #999; padding-top: 10px;
    font-size: 10px; color: #555; text-align: center;
  }
  @media print { body { padding: 12mm; } @page { margin: 12mm; size: A4 portrait; } }
</style>
</head>
<body>
  <div class="header">
    <h1>${esc(businessSettings.businessName)}</h1>
    <div class="meta">${esc(businessSettings.address)}</div>
    <div class="meta">${esc(businessSettings.phone)}</div>
    <div class="report-title">Customer List</div>
    <div class="meta">${items.length} customers</div>
    <div class="meta">Generated on ${today}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th class="ctr" style="width:32px">#</th>
        <th>Customer</th>
        <th>Phone</th>
        <th>Address</th>
        <th class="num">Purchases</th>
        <th class="num">Paid</th>
        <th class="num">Due</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr>
        <td colspan="4">Total</td>
        <td class="num">${fmt(totals.purchases)}</td>
        <td class="num">${fmt(totals.paid)}</td>
        <td class="num">${fmt(totals.due)}</td>
      </tr>
    </tfoot>
  </table>

  <div class="footer">${esc(businessSettings.invoiceFooter)}</div>
  <script>window.onload = function(){ window.print(); };</script>
</body>
</html>`;

    w.document.write(html);
    w.document.close();
  };

  return (
    <AppShell title="Customers" subtitle="Manage your customers">
      <PageHeader
        title="Customers"
        description="Track purchases, payments and dues per customer"
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
          <Plus className="h-4 w-4" /> Add Customer
        </Button>
      </PageHeader>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load customers: {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
          Loading customers…
        </div>
      ) : (
        <CustomerTable
          items={items}
          onDelete={handleDelete}
          onEdit={openEdit}
        />
      )}

      <AddCustomerForm
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
