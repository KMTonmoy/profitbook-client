"use client";

import * as React from "react";
import { Plus, Printer } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { ProductTable } from "@/components/products/product-table";
import { AddProductForm } from "@/components/products/add-product-form";
import { Button } from "@/components/ui/button";
import { endpoints } from "@/lib/endpoints";
import { useApi } from "@/hooks/use-api";
import { useBusinessSettingsOrDefault } from "@/hooks/use-business-settings";
import type { Product, Category, Supplier } from "@/lib/types";

export default function ProductsPage() {
  const [open, setOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Product | null>(null);

  const { settings } = useBusinessSettingsOrDefault();

  const {
    data: productsData,
    loading,
    error,
    refetch,
  } = useApi<Product[]>("/api/products");
  const { data: categoriesData } = useApi<Category[]>("/api/categories");
  const { data: suppliersData } = useApi<Supplier[]>("/api/suppliers");

  const items = productsData ?? [];
  const categories = categoriesData ?? [];
  const suppliers = suppliersData ?? [];

  const openCreate = () => {
    setEditTarget(null);
    setOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditTarget(product);
    setOpen(true);
  };

  const handleAdd = async (product: Product) => {
    try {
      await endpoints.products.create(product);
      refetch();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleUpdate = async (product: Product) => {
    try {
      await endpoints.products.update(product.id, product);
      refetch();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await endpoints.products.remove(id);
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
      .map((p, i) => {
        const cat = categories.find((c) => c.id === p.categoryId)?.name ?? "—";
        const profit = (p.sellingPrice || 0) - (p.purchasePrice || 0);
        const margin =
          (p.sellingPrice || 0) > 0
            ? ((profit / p.sellingPrice) * 100).toFixed(1)
            : "0.0";
        return `
      <tr>
        <td class="ctr">${i + 1}</td>
        <td>${esc(p.name)}</td>
        <td>${esc(p.sku)}</td>
        <td>${esc(cat)}</td>
        <td class="num">${fmt(p.purchasePrice)}</td>
        <td class="num">${fmt(p.sellingPrice)}</td>
        <td class="num">${p.currentStock ?? 0} ${esc(p.unit ?? "")}</td>
        <td class="num">${fmt(profit)}</td>
        <td class="num">${margin}%</td>
      </tr>`;
      })
      .join("");

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Product List — ${esc(settings.businessName)}</title>
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
  .footer { margin-top: 24px; border-top: 1px solid #999; padding-top: 10px; font-size: 10px; color: #555; text-align: center; }
  @media print { body { padding: 12mm; } @page { margin: 12mm; size: A4 portrait; } }
</style>
</head>
<body>
  <div class="header">
    <h1>${esc(settings.businessName)}</h1>
    <div class="meta">${esc(settings.address)}</div>
    <div class="meta">${esc(settings.phone)}</div>
    <div class="report-title">Product List</div>
    <div class="meta">${items.length} products · Generated on ${today}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th class="ctr" style="width:32px">#</th>
        <th>Product</th>
        <th>SKU</th>
        <th>Category</th>
        <th class="num">Purchase</th>
        <th class="num">Selling</th>
        <th class="num">Stock</th>
        <th class="num">Profit/Unit</th>
        <th class="num">Margin</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="footer">${esc(settings.invoiceFooter)}</div>
  <script>window.onload = function(){ window.print(); };</script>
</body>
</html>`;

    w.document.write(html);
    w.document.close();
  };

  return (
    <AppShell title="Products" subtitle="Manage your product catalog">
      <PageHeader
        title="Products"
        description="Manage your complete product catalog, pricing and stock"
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
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </PageHeader>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load products: {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
          Loading products…
        </div>
      ) : (
        <ProductTable
          items={items}
          categories={categories}
          suppliers={suppliers}
          onDelete={handleDelete}
          onEdit={openEdit}
        />
      )}

      <AddProductForm
        key={`${open}-${editTarget?.id ?? "new"}`}
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setEditTarget(null);
        }}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        editTarget={editTarget}
        categories={categories}
        suppliers={suppliers}
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
