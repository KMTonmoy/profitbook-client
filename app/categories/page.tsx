"use client";

import * as React from "react";
import { Plus, Printer } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  categories as initialCategories,
  businessSettings,
} from "@/lib/mock-data";
import type { Category } from "@/lib/types";
import { AddCategoryForm } from "@/components/categories/add-category-form";
import { CategoryTable } from "@/components/categories/category-table";

export default function CategoriesPage() {
  const [open, setOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Category | null>(null);
  const [items, setItems] = React.useState<Category[]>(initialCategories);

  const handleAdd = (data: Omit<Category, "id">) => {
    const category: Category = {
      ...data,
      id: `cat-${crypto.randomUUID()}`,
    };
    setItems((prev) => [category, ...prev]);
  };

  const handleUpdate = (category: Category) => {
    setItems((prev) => prev.map((c) => (c.id === category.id ? category : c)));
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((c) => c.id !== id));
  };

  const openCreate = () => {
    setEditTarget(null);
    setOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditTarget(c);
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

    const rows = items
      .map(
        (c, i) => `
      <tr>
        <td class="ctr">${i + 1}</td>
        <td>${esc(c.name)}</td>
        <td>
          <span style="display:inline-block;width:12px;height:12px;border:1px solid #000;background:${esc(c.color ?? "#e5e7eb")};margin-right:6px;vertical-align:middle"></span>
          ${esc(c.color ?? "—")}
        </td>
      </tr>`,
      )
      .join("");

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Categories — ${esc(businessSettings.businessName)}</title>
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
    <div class="report-title">Category List</div>
    <div class="meta">${items.length} categories</div>
    <div class="meta">Generated on ${today}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th class="ctr" style="width:32px">#</th>
        <th>Category Name</th>
        <th>Color</th>
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
    <AppShell title="Categories" subtitle="Manage product categories">
      <PageHeader
        title="Categories"
        description="Organize your products into categories"
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
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </PageHeader>

      <CategoryTable items={items} onDelete={handleDelete} onEdit={openEdit} />

      <AddCategoryForm
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
