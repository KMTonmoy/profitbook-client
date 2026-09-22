"use client";

import * as React from "react";
import { Plus, Download } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { suppliers as initialSuppliers } from "@/lib/mock-data";
import type { Supplier } from "@/lib/types";
import { AddSupplierForm } from "@/components/suppliers/add-supplier-form";
import { SupplierTable } from "@/components/suppliers/supplier-table";

export default function SuppliersPage() {
  const [open, setOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Supplier | null>(null);
  const [items, setItems] = React.useState<Supplier[]>(initialSuppliers);

  const handleAdd = (data: Omit<Supplier, "id">) => {
    const supplier: Supplier = {
      ...data,
      id: `sup-${crypto.randomUUID()}`,
    };
    setItems((prev) => [supplier, ...prev]);
  };

  const handleUpdate = (supplier: Supplier) => {
    setItems((prev) => prev.map((s) => (s.id === supplier.id ? supplier : s)));
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((s) => s.id !== id));
  };

  const openAdd = () => {
    setEditTarget(null);
    setOpen(true);
  };

  const openEdit = (supplier: Supplier) => {
    setEditTarget(supplier);
    setOpen(true);
  };

  return (
    <AppShell title="Suppliers" subtitle="Manage your suppliers">
      <PageHeader
        title="Suppliers"
        description="Manage companies, agents and contact details"
      >
        <Button variant="outline" size="sm" className="h-9 gap-1.5">
          <Download className="h-4 w-4" /> Export
        </Button>
        <Button size="sm" className="h-9 gap-1.5" onClick={openAdd}>
          <Plus className="h-4 w-4" /> Add Supplier
        </Button>
      </PageHeader>

      <SupplierTable items={items} onEdit={openEdit} onDelete={handleDelete} />

      <AddSupplierForm
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
