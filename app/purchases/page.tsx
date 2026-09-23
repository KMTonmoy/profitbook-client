"use client";

import * as React from "react";
import { Plus, Printer } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { PurchaseTable } from "@/components/purchases/purchase-table";
import { AddPurchaseForm } from "@/components/purchases/add-purchase-form";
import { Button } from "@/components/ui/button";
import { endpoints } from "@/lib/endpoints";
import { businessSettings } from "@/lib/mock-data";
import type { Supplier, Product } from "@/lib/types";
import { useApi } from "@/hooks/use-api";

export interface PurchaseLine {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface Purchase {
  id: string;
  purchaseNumber: string;
  supplierId: string;
  supplierName: string;
  agentName?: string;
  agentPhone?: string;
  date: string;
  items: PurchaseLine[];
  subtotal: number;
  discount: number;
  additionalCost: number;
  total: number;
  paid: number;
  due: number;
  status: "paid" | "partial" | "due";
}

export default function PurchasesPage() {
  const [open, setOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Purchase | null>(null);

  const {
    data: purchasesData,
    loading,
    error,
    refetch,
  } = useApi<Purchase[]>("/api/purchases");
  const { data: suppliersData, refetch: refetchSuppliers } =
    useApi<Supplier[]>("/api/suppliers");
  const { data: productsData } = useApi<Product[]>("/api/products");

  const purchases = purchasesData ?? [];
  const suppliers = suppliersData ?? [];
  const products = productsData ?? [];

  const openCreate = () => {
    setEditTarget(null);
    setOpen(true);
  };

  const openEdit = (purchase: Purchase) => {
    setEditTarget(purchase);
    setOpen(true);
  };

  const handleAdd = async (purchase: Purchase, newSupplier?: Supplier) => {
    try {
      if (newSupplier) {
        await endpoints.suppliers.create(newSupplier);
        refetchSuppliers();
      }
      await endpoints.purchases.create(purchase);
      toast.success("Purchase saved", {
        description: purchase.purchaseNumber,
      });
      refetch();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleUpdate = async (purchase: Purchase) => {
    try {
      await endpoints.purchases.update(purchase.id, purchase);
      toast.success("Purchase updated", {
        description: purchase.purchaseNumber,
      });
      refetch();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await endpoints.purchases.remove(id);
      toast.success("Purchase deleted");
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

    const rows = purchases
      .map(
        (p, i) => `
      <tr>
        <td class="ctr">${i + 1}</td>
        <td>${esc(p.purchaseNumber)}</td>
        <td>${esc(p.supplierName)}</td>
        <td>${esc(p.agentName ?? "—")}</td>
        <td>${esc(p.date)}</td>
        <td class="num">${fmt(p.total)}</td>
        <td class="num">${fmt(p.paid)}</td>
        <td class="num">${fmt(p.due)}</td>
        <td class="cap">${esc(p.status)}</td>
      </tr>`,
      )
      .join("");

    const totals = purchases.reduce(
      (a, p) => ({
        total: a.total + (p.total || 0),
        paid: a.paid + (p.paid || 0),
        due: a.due + (p.due || 0),
      }),
      { total: 0, paid: 0, due: 0 },
    );

    const html = `<!doctype html>
<html><head><meta charset="utf-8" /><title>Purchase Report</title>
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
    <h1>${esc(businessSettings.businessName)}</h1>
    <div class="meta">${esc(businessSettings.address)}</div>
    <div class="meta">${esc(businessSettings.phone)}</div>
    <div class="report-title">Purchase List</div>
    <div class="meta">${purchases.length} purchases · Generated on ${today}</div>
  </div>
  <table>
    <thead><tr>
      <th class="ctr" style="width:32px">#</th>
      <th>Purchase #</th>
      <th>Supplier</th>
      <th>Agent</th>
      <th>Date</th>
      <th class="num">Total</th>
      <th class="num">Paid</th>
      <th class="num">Due</th>
      <th>Status</th>
    </tr></thead>
    <tbody>${rows}</tbody>
    <tfoot><tr>
      <td colspan="5">Total</td>
      <td class="num">${fmt(totals.total)}</td>
      <td class="num">${fmt(totals.paid)}</td>
      <td class="num">${fmt(totals.due)}</td>
      <td></td>
    </tr></tfoot>
  </table>
  <div class="footer">${esc(businessSettings.invoiceFooter)}</div>
  <script>window.onload=function(){window.print()}</script>
</body></html>`;

    w.document.write(html);
    w.document.close();
  };

  return (
    <AppShell title="Purchases" subtitle="Manage supplier purchases">
      <PageHeader
        title="Purchases"
        description="Track all supplier purchases and dues"
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
          <Plus className="h-4 w-4" /> Add Purchase
        </Button>
      </PageHeader>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load purchases: {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
          Loading purchases…
        </div>
      ) : (
        <PurchaseTable
          purchases={purchases}
          onDelete={handleDelete}
          onEdit={openEdit}
        />
      )}

      <AddPurchaseForm
        key={`${open}-${editTarget?.id ?? "new"}`}
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setEditTarget(null);
        }}
        suppliers={suppliers}
        products={products}
        onSave={handleAdd}
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
