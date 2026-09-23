"use client";

import * as React from "react";
import { Printer } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { StockMovementTable } from "@/components/stock/stock-movement-table";
import { businessSettings } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";
import { Package, Boxes, Wallet, AlertTriangle, XCircle } from "lucide-react";
import type { Product, StockMovement } from "@/lib/types";
import { useApi } from "@/hooks/use-api";

export default function StockPage() {
  const {
    data: productsData,
    loading: loadingProducts,
    error: productsError,
  } = useApi<Product[]>("/api/products");

  const {
    data: movementsData,
    loading: loadingMovements,
    error: movementsError,
  } = useApi<StockMovement[]>("/api/stock-movements");

  const products = productsData ?? [];
  const movements = movementsData ?? [];

  const totalQty = products.reduce((s, p) => s + (p.currentStock || 0), 0);
  const totalValue = products.reduce(
    (s, p) => s + (p.currentStock || 0) * (p.purchasePrice || 0),
    0,
  );
  const low = products.filter((p) => p.status === "low-stock").length;
  const out = products.filter((p) => p.status === "out-of-stock").length;

  const error = productsError || movementsError;
  const loading = loadingProducts || loadingMovements;

  const handlePrint = () => {
    const w = window.open("", "_blank", "width=1100,height=850");
    if (!w) return;

    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const rows = movements
      .map(
        (m, i) => `
      <tr>
        <td class="ctr">${i + 1}</td>
        <td>${esc(m.date ?? "—")}</td>
        <td>${esc(m.productName ?? "—")}</td>
        <td class="cap">${esc(m.type ?? "—")}</td>
        <td class="num">${m.quantity >= 0 ? "+" : ""}${m.quantity ?? 0}</td>
        <td class="num">${m.previousStock ?? 0}</td>
        <td class="num">${m.newStock ?? 0}</td>
        <td>${esc(m.reference ?? "—")}</td>
      </tr>`,
      )
      .join("");

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Stock Movements — ${esc(businessSettings.businessName)}</title>
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
  .kpis { display: flex; gap: 12px; margin-top: 12px; }
  .kpi { flex: 1; border: 1px solid #000; padding: 8px 10px; }
  .kpi-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: #444; }
  .kpi-value { font-size: 14px; font-weight: 600; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  th, td { border: 1px solid #000; padding: 6px 10px; font-size: 11px; text-align: left; }
  th { text-transform: uppercase; font-size: 10px; font-weight: 600; }
  td.ctr, th.ctr { text-align: center; }
  td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
  td.cap { text-transform: capitalize; }
  .footer { margin-top: 24px; border-top: 1px solid #999; padding-top: 10px; font-size: 10px; color: #555; text-align: center; }
  @media print { body { padding: 12mm; } @page { margin: 12mm; size: A4 portrait; } }
</style>
</head>
<body>
  <div class="header">
    <h1>${esc(businessSettings.businessName)}</h1>
    <div class="meta">${esc(businessSettings.address)}</div>
    <div class="meta">${esc(businessSettings.phone)}</div>
    <div class="report-title">Stock Movements Report</div>
    <div class="meta">${movements.length} movements · Generated on ${today}</div>
  </div>

  <div class="kpis">
    <div class="kpi">
      <div class="kpi-label">Products</div>
      <div class="kpi-value">${products.length}</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">Total Qty</div>
      <div class="kpi-value">${totalQty.toLocaleString()}</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">Stock Value</div>
      <div class="kpi-value">${fmt(totalValue)}</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">Low Stock</div>
      <div class="kpi-value">${low}</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">Out of Stock</div>
      <div class="kpi-value">${out}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th class="ctr" style="width:32px">#</th>
        <th>Date</th>
        <th>Product</th>
        <th>Type</th>
        <th class="num">Qty</th>
        <th class="num">Previous</th>
        <th class="num">New</th>
        <th>Reference</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="footer">${esc(businessSettings.invoiceFooter)}</div>
  <script>window.onload = function(){ window.print(); };</script>
</body>
</html>`;

    w.document.write(html);
    w.document.close();
  };

  return (
    <AppShell title="Stock" subtitle="Inventory levels and movements">
      <PageHeader
        title="Stock Management"
        description="Track stock levels across all products"
      >
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1.5"
          onClick={handlePrint}
        >
          <Printer className="h-4 w-4" /> Print
        </Button>
      </PageHeader>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load stock data: {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Total Products"
          value={loading ? "…" : products.length}
          icon={Package}
          tone="primary"
        />
        <StatCard
          label="Total Quantity"
          value={loading ? "…" : totalQty.toLocaleString()}
          icon={Boxes}
          tone="info"
        />
        <StatCard
          label="Stock Value"
          value={loading ? "…" : formatCurrency(totalValue)}
          icon={Wallet}
          tone="success"
        />
        <StatCard
          label="Low Stock"
          value={loading ? "…" : low}
          icon={AlertTriangle}
          tone="warning"
        />
        <StatCard
          label="Out of Stock"
          value={loading ? "…" : out}
          icon={XCircle}
          tone="destructive"
        />
      </div>

      <div className="mt-6">
        <StockMovementTable items={movements} loading={loadingMovements} />
      </div>
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
