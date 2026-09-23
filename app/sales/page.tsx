"use client";

import * as React from "react";
import { Plus, Printer } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { SalesTable } from "@/components/sales/sales-table";
import { AddSaleForm } from "@/components/sales/add-sale-form";
import { InvoicePreview } from "@/components/sales/invoice-preview";
import { Button } from "@/components/ui/button";
import { endpoints } from "@/lib/endpoints";
import { useApi } from "@/hooks/use-api";
import { useBusinessSettingsOrDefault } from "@/hooks/use-business-settings";
import type { Sale, Customer, Product } from "@/lib/types";

export default function SalesPage() {
  const [open, setOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Sale | null>(null);
  const [viewSale, setViewSale] = React.useState<Sale | null>(null);

  const { settings } = useBusinessSettingsOrDefault();

  const {
    data: salesData,
    loading,
    error,
    refetch,
  } = useApi<Sale[]>("/api/sales");

  const { data: customersData, refetch: refetchCustomers } =
    useApi<Customer[]>("/api/customers");

  const { data: productsData, refetch: refetchProducts } =
    useApi<Product[]>("/api/products");

  const sales = salesData ?? [];
  const customers = customersData ?? [];
  const products = productsData ?? [];

  const openCreate = () => {
    setEditTarget(null);
    setOpen(true);
  };

  const openEdit = (sale: Sale) => {
    setEditTarget(sale);
    setOpen(true);
  };

  const handleCreate = async (sale: Sale) => {
    try {
      const created = await endpoints.sales.create(sale);
      toast.success("Sale saved", {
        description: created.invoiceNumber ?? sale.invoiceNumber,
      });
      await Promise.all([refetch(), refetchProducts(), refetchCustomers()]);
      setViewSale(created);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleUpdate = async (sale: Sale) => {
    try {
      const updated = await endpoints.sales.update(sale.id, sale);
      toast.success("Sale updated", {
        description: updated.invoiceNumber ?? sale.invoiceNumber,
      });
      await Promise.all([refetch(), refetchProducts(), refetchCustomers()]);
      setViewSale(updated);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await endpoints.sales.remove(id);
      toast.success("Sale deleted");
      await Promise.all([refetch(), refetchProducts(), refetchCustomers()]);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleAddCustomer = async (customer: Customer) => {
    try {
      await endpoints.customers.create(customer);
      toast.success("Customer added", { description: customer.name });
      refetchCustomers();
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

    const rows = sales
      .map(
        (s, i) => `
      <tr>
        <td class="ctr">${i + 1}</td>
        <td>${esc(s.invoiceNumber)}</td>
        <td>${esc(s.customerName)}</td>
        <td>${esc(s.date)}</td>
        <td class="num">${fmt(s.total)}</td>
        <td class="num">${fmt(s.paid)}</td>
        <td class="num">${fmt(s.due)}</td>
        <td class="num">${fmt(s.profit)}</td>
        <td class="cap">${esc(s.status)}</td>
      </tr>`,
      )
      .join("");

    const totals = sales.reduce(
      (a, s) => ({
        total: a.total + (s.total || 0),
        paid: a.paid + (s.paid || 0),
        due: a.due + (s.due || 0),
        profit: a.profit + (s.profit || 0),
      }),
      { total: 0, paid: 0, due: 0, profit: 0 },
    );

    const html = `<!doctype html>
<html><head><meta charset="utf-8" /><title>Sales Report</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    color:#000; background:#fff;
    margin:0 auto; padding:16mm;
    width:210mm; min-height:297mm; font-size:12px;
  }
  h1 { font-size:20px; margin:0 0 4px; }
  .header { border-bottom:2px solid #000; padding-bottom:12px; margin-bottom:8px; }
  .meta { font-size:11px; color:#444; }
  .report-title { margin-top:12px; font-size:14px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; }
  table { width:100%; border-collapse:collapse; margin-top:8px; }
  th,td { border:1px solid #000; padding:6px 10px; font-size:11px; text-align:left; }
  th { text-transform:uppercase; font-size:10px; font-weight:600; }
  td.num,th.num { text-align:right; font-variant-numeric:tabular-nums; }
  td.ctr,th.ctr { text-align:center; }
  td.cap { text-transform: capitalize; }
  tfoot td { font-weight:700; background:#f5f5f5; }
  .footer { margin-top:24px; border-top:1px solid #999; padding-top:10px; font-size:10px; color:#555; text-align:center; }
  @media print { body { padding:12mm; } @page { margin:12mm; size:A4 portrait; } }
</style></head>
<body>
  <div class="header">
    <h1>${esc(settings.businessName)}</h1>
    <div class="meta">${esc(settings.address)}</div>
    <div class="meta">${esc(settings.phone)}</div>
    <div class="report-title">Sales List</div>
    <div class="meta">${sales.length} invoices · Generated on ${today}</div>
  </div>
  <table>
    <thead><tr>
      <th class="ctr" style="width:32px">#</th>
      <th>Invoice</th>
      <th>Customer</th>
      <th>Date</th>
      <th class="num">Total</th>
      <th class="num">Paid</th>
      <th class="num">Due</th>
      <th class="num">Profit</th>
      <th>Status</th>
    </tr></thead>
    <tbody>${rows}</tbody>
    <tfoot><tr>
      <td colspan="4">Total</td>
      <td class="num">${fmt(totals.total)}</td>
      <td class="num">${fmt(totals.paid)}</td>
      <td class="num">${fmt(totals.due)}</td>
      <td class="num">${fmt(totals.profit)}</td>
      <td></td>
    </tr></tfoot>
  </table>
  <div class="footer">${esc(settings.invoiceFooter)}</div>
  <script>window.onload=function(){window.print()}</script>
</body></html>`;

    w.document.write(html);
    w.document.close();
  };

  return (
    <AppShell title="Sales" subtitle="Track invoices and payments">
      <PageHeader
        title="Sales"
        description="Create invoices, track payments and dues"
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
          <Plus className="h-4 w-4" /> Add Sale
        </Button>
      </PageHeader>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load sales: {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
          Loading sales…
        </div>
      ) : (
        <SalesTable
          sales={sales}
          onDelete={handleDelete}
          onView={setViewSale}
          onEdit={openEdit}
        />
      )}

      <AddSaleForm
        key={`${open}-${editTarget?.id ?? "new"}`}
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setEditTarget(null);
        }}
        customers={customers}
        products={products}
        onAddCustomer={handleAddCustomer}
        onSave={handleCreate}
        onUpdate={handleUpdate}
        editTarget={editTarget}
      />

      <InvoicePreview
        open={!!viewSale}
        onOpenChange={(o) => !o && setViewSale(null)}
        sale={viewSale}
        customer={
          viewSale
            ? (customers.find((c) => c.id === viewSale.customerId) ?? null)
            : null
        }
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
