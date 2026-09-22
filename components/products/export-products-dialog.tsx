"use client";

import * as React from "react";
import { Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/mock-data";
import type { Product } from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  products: Product[];
}

const formatCurrency = (n: number) =>
  `৳ ${Math.abs(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export function ExportProductsDialog({ open, onOpenChange, products }: Props) {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const handlePrint = () => {
    const w = window.open("", "_blank", "width=1100,height=800");
    if (!w) return;

    const rows = products
      .map((p, i) => {
        const cat = categories.find((c) => c.id === p.categoryId)?.name ?? "—";
        const profit = p.sellingPrice - p.purchasePrice;
        const margin =
          p.sellingPrice > 0
            ? ((profit / p.sellingPrice) * 100).toFixed(1)
            : "0.0";
        return `
          <tr>
            <td>${i + 1}</td>
            <td>${escapeHtml(p.name)}</td>
            <td>${escapeHtml(p.sku)}</td>
            <td>${escapeHtml(cat)}</td>
            <td class="num">${formatCurrency(p.purchasePrice)}</td>
            <td class="num">${formatCurrency(p.sellingPrice)}</td>
            <td class="num">${p.currentStock} ${escapeHtml(p.unit)}</td>
            <td class="num">${formatCurrency(profit)}</td>
            <td class="num">${margin}%</td>
          </tr>`;
      })
      .join("");

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Products - ProfitBook</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    color: #000;
    background: #fff;
    margin: 0 auto;
    padding: 16mm;
    font-size: 12px;
    width: 210mm;
    min-height: 297mm;
  }
  h1 { font-size: 18px; margin: 0 0 4px; }
  .meta { font-size: 11px; color: #333; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; }
  th, td {
    border: 1px solid #000;
    padding: 6px 8px;
    text-align: left;
    vertical-align: top;
  }
  th {
    background: #fff;
    font-weight: 600;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }
  td.num { text-align: right; font-variant-numeric: tabular-nums; }
  .footer { margin-top: 16px; font-size: 10px; color: #333; }
  @media print {
    body { padding: 12mm; }
    @page { margin: 12mm; size: A4 portrait; }
  }
</style>
</head>
<body>
  <h1>Product List — ProfitBook</h1>
  <div class="meta">
    Total products: <strong>${products.length}</strong> &nbsp;·&nbsp; Generated on ${today}
  </div>
  <table>
    <thead>
      <tr>
        <th style="width:32px">#</th>
        <th>Product Name</th>
        <th>SKU</th>
        <th>Category</th>
        <th class="num">Purchase Price</th>
        <th class="num">Selling Price</th>
        <th class="num">Stock</th>
        <th class="num">Profit/Unit</th>
        <th class="num">Margin</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
  <div class="footer">
    ProfitBook — Business Management &amp; Accounting
  </div>
  <script>
    window.onload = function () { window.print(); };
  </script>
</body>
</html>`;

    w.document.write(html);
    w.document.close();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[95vh] w-[95vw] max-w-[820px] overflow-y-auto p-0 sm:max-w-[820px]"
        style={{ width: "min(95vw, 820px)" }}
      >
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>Export Products</DialogTitle>
          <DialogDescription>
            A4 preview. Click Print to save as PDF or send to a printer.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/40 p-3 sm:p-6">
          <div
            id="products-print"
            className="mx-auto bg-white p-8 text-black shadow-md"
            style={{
              width: "100%",
              maxWidth: "210mm",
              minHeight: "297mm",
            }}
          >
            <div className="border-b pb-3">
              <h1 className="text-lg font-semibold">
                Product List — ProfitBook
              </h1>
              <p className="mt-1 text-xs text-neutral-600">
                Total products: <strong>{products.length}</strong> · Generated
                on {today}
              </p>
            </div>

            <table className="mt-4 w-full border-collapse text-[12px]">
              <thead>
                <tr>
                  {[
                    "#",
                    "Product Name",
                    "SKU",
                    "Category",
                    "Purchase Price",
                    "Selling Price",
                    "Stock",
                    "Profit/Unit",
                    "Margin",
                  ].map((h, idx) => (
                    <th
                      key={h}
                      className={`border border-black px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wide ${
                        idx >= 4 ? "text-right" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => {
                  const cat =
                    categories.find((c) => c.id === p.categoryId)?.name ?? "—";
                  const profit = p.sellingPrice - p.purchasePrice;
                  const margin =
                    p.sellingPrice > 0
                      ? ((profit / p.sellingPrice) * 100).toFixed(1)
                      : "0.0";
                  return (
                    <tr key={p.id}>
                      <td className="border border-black px-2 py-1.5">
                        {i + 1}
                      </td>
                      <td className="border border-black px-2 py-1.5">
                        {p.name}
                      </td>
                      <td className="border border-black px-2 py-1.5">
                        {p.sku}
                      </td>
                      <td className="border border-black px-2 py-1.5">{cat}</td>
                      <td className="border border-black px-2 py-1.5 text-right tabular-nums">
                        {formatCurrency(p.purchasePrice)}
                      </td>
                      <td className="border border-black px-2 py-1.5 text-right tabular-nums">
                        {formatCurrency(p.sellingPrice)}
                      </td>
                      <td className="border border-black px-2 py-1.5 text-right tabular-nums">
                        {p.currentStock} {p.unit}
                      </td>
                      <td className="border border-black px-2 py-1.5 text-right tabular-nums">
                        {formatCurrency(profit)}
                      </td>
                      <td className="border border-black px-2 py-1.5 text-right tabular-nums">
                        {margin}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <p className="mt-4 border-t pt-3 text-[10px] text-neutral-600">
              ProfitBook — Business Management &amp; Accounting
            </p>
          </div>
        </div>

        <div className="no-print flex flex-wrap items-center justify-end gap-2 border-t px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button className="gap-1.5" onClick={handlePrint}>
            <Printer className="h-4 w-4" /> Print / Save as PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}