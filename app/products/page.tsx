"use client";

import * as React from "react";
import { Plus, Download } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { ProductTable } from "@/components/products/product-table";
import { AddProductForm } from "@/components/products/add-product-form";
import { Button } from "@/components/ui/button";
import { products as initialProducts } from "@/lib/mock-data";
import type { Product } from "@/lib/types";
import { ExportProductsDialog } from "@/components/products/export-products-dialog";

export default function ProductsPage() {
  const [open, setOpen] = React.useState(false);
  const [exportOpen, setExportOpen] = React.useState(false);
  const [items, setItems] = React.useState<Product[]>(initialProducts);

  const handleAdd = (product: Product) => {
    setItems((prev) => [product, ...prev]);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
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
          onClick={() => setExportOpen(true)}
        >
          <Download className="h-4 w-4" /> Export
        </Button>
        <Button size="sm" className="h-9 gap-1.5" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </PageHeader>

      <ProductTable items={items} onDelete={handleDelete} />

      <AddProductForm open={open} onOpenChange={setOpen} onAdd={handleAdd} />

      <ExportProductsDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        products={items}
      />
    </AppShell>
  );
}
