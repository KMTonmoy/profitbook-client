"use client";

import * as React from "react";
import { Plus, Download } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { SalesTable } from "@/components/sales/sales-table";
import { AddSaleForm } from "@/components/sales/add-sale-form";
import { InvoicePreview } from "@/components/sales/invoice-preview";
import { ExportSalesDialog } from "@/components/sales/export-sales-dialog";
import { Button } from "@/components/ui/button";
import {
  sales as initialSales,
  customers as initialCustomers,
  products as initialProducts,
} from "@/lib/mock-data";
import type { Sale, Customer, Product } from "@/lib/types";

export default function SalesPage() {
  const [open, setOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Sale | null>(null);
  const [viewSale, setViewSale] = React.useState<Sale | null>(null);
  const [exportOpen, setExportOpen] = React.useState(false);
  const [sales, setSales] = React.useState<Sale[]>(initialSales);
  const [customers, setCustomers] =
    React.useState<Customer[]>(initialCustomers);
  const [products, setProducts] = React.useState<Product[]>(initialProducts);

  const handleCreate = (sale: Sale, updatedProducts: Product[]) => {
    setSales((prev) => [sale, ...prev]);
    setProducts(updatedProducts);
    setViewSale(sale);
  };

  const handleUpdate = (updated: Sale, updatedProducts: Product[]) => {
    setSales((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setProducts(updatedProducts);
    setViewSale(updated);
  };

  const handleAddCustomer = (customer: Customer) => {
    setCustomers((prev) => [customer, ...prev]);
  };

  const handleDelete = (id: string) => {
    const sale = sales.find((s) => s.id === id);
    if (!sale) return;

    const restored = products.map((p) => {
      const line = sale.items.find((it) => it.productId === p.id);
      if (!line) return p;
      const nextStock = p.currentStock + line.quantity;
      const status: Product["status"] =
        nextStock <= 0
          ? "out-of-stock"
          : nextStock <= 10
            ? "low-stock"
            : "in-stock";
      return { ...p, currentStock: nextStock, status };
    });

    setProducts(restored);
    setSales((prev) => prev.filter((s) => s.id !== id));
  };

  const openCreate = () => {
    setEditTarget(null);
    setOpen(true);
  };

  const openEdit = (sale: Sale) => {
    setEditTarget(sale);
    setOpen(true);
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
          onClick={() => setExportOpen(true)}
        >
          <Download className="h-4 w-4" /> Export
        </Button>
        <Button size="sm" className="h-9 gap-1.5" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Sale
        </Button>
      </PageHeader>

      <SalesTable
        sales={sales}
        onDelete={handleDelete}
        onView={setViewSale}
        onEdit={openEdit}
      />

      <AddSaleForm
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

      <ExportSalesDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        sales={sales}
      />
    </AppShell>
  );
}
