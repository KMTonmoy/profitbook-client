"use client";

import * as React from "react";
import { Plus, Printer } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { PurchaseTable } from "@/components/purchases/purchase-table";
import { AddPurchaseForm } from "@/components/purchases/add-purchase-form";
import { Button } from "@/components/ui/button";
import {
  suppliers as initialSuppliers,
  products as initialProducts,
  businessSettings,
} from "@/lib/mock-data";
import type { Supplier, Product } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

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

const seed: Purchase[] = [
  {
    id: "pur1",
    purchaseNumber: "PUR-2024-0042",
    supplierId: "s1",
    supplierName: "Rahman Traders",
    agentName: "Md. Karim",
    agentPhone: "+8801711100001",
    date: "2024-06-17",
    items: [
      {
        id: "l1",
        productName: "Rice 25kg",
        quantity: 50,
        unit: "bag",
        unitPrice: 1650,
      },
      {
        id: "l2",
        productName: "Soybean Oil 5L",
        quantity: 30,
        unit: "bottle",
        unitPrice: 780,
      },
    ],
    subtotal: 105900,
    discount: 900,
    additionalCost: 0,
    total: 105000,
    paid: 80000,
    due: 25000,
    status: "partial",
  },
  {
    id: "pur2",
    purchaseNumber: "PUR-2024-0041",
    supplierId: "s3",
    supplierName: "Chittagong Suppliers",
    agentName: "Rakib Hossain",
    agentPhone: "+8801711100003",
    date: "2024-06-15",
    items: [
      {
        id: "l1",
        productName: "LED Bulb 12W",
        quantity: 200,
        unit: "pcs",
        unitPrice: 145,
      },
    ],
    subtotal: 29000,
    discount: 0,
    additionalCost: 500,
    total: 29500,
    paid: 29500,
    due: 0,
    status: "paid",
  },
];

export default function PurchasesPage() {
  const [open, setOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Purchase | null>(null);
  const [purchases, setPurchases] = React.useState<Purchase[]>(seed);
  const [suppliers, setSuppliers] =
    React.useState<Supplier[]>(initialSuppliers);
  const [products] = React.useState<Product[]>(initialProducts);

  const handleAdd = (purchase: Purchase, newSupplier?: Supplier) => {
    setPurchases((prev) => [purchase, ...prev]);
    if (newSupplier) {
      setSuppliers((prev) => [newSupplier, ...prev]);
    }
  };

  const handleUpdate = (purchase: Purchase) => {
    setPurchases((prev) =>
      prev.map((p) => (p.id === purchase.id ? purchase : p)),
    );
  };

  const handleDelete = (id: string) => {
    setPurchases((prev) => prev.filter((p) => p.id !== id));
  };

  const openCreate = () => {
    setEditTarget(null);
    setOpen(true);
  };

  const openEdit = (purchase: Purchase) => {
    setEditTarget(purchase);
    setOpen(true);
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
        <td>${p.date}</td>
        <td class="num">${formatCurrency(p.total)}</td>
        <td class="num">${formatCurrency(p.paid)}</td>
        <td class="num">${formatCurrency(p.due)}</td>
        <td class="capitalize">${esc(p.status)}</td>
      </tr>`,
      )
      .join("");

    const totals = purchases.reduce(
      (a, p) => ({
        total: a.total + p.total,
        paid: a.paid + p.paid,
        due: a.due + p.due,
      }),
      { total: 0, paid: 0, due: 0 },
    );

    const html = `<!doctype html>
<html><head><meta charset="utf-8" /><title>Purchase Report</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; color:#000; background:#fff; margin:0 auto; padding:16mm; width:210mm; min-height:297mm; font-size:12px; }
  h1 { font-size:20px; margin:0 0 4px; }
  .header { border-bottom:2px solid #000; padding-bottom:12px; margin-bottom:8px; }
  .meta { font-size:11px; color:#444; }
  .report-title { margin-top:12px; font-size:14px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; }
  table { width:100%; border-collapse:collapse; margin-top:8px; }
  th,td { border:1px solid #000; padding:6px 10px; font-size:11px; text-align:left; }
  th { text-transform:uppercase; font-size:10px; font-weight:600; }
  td.num,th.num { text-align:right; font-variant-numeric:tabular-nums; }
  td.ctr,th.ctr { text-align:center; }
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
      <td class="num">${formatCurrency(totals.total)}</td>
      <td class="num">${formatCurrency(totals.paid)}</td>
      <td class="num">${formatCurrency(totals.due)}</td>
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

      <PurchaseTable
        purchases={purchases}
        onDelete={handleDelete}
        onEdit={openEdit}
      />

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
