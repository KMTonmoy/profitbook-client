"use client";

import * as React from "react";
import { MoreHorizontal, Eye, Pencil, Trash2, Package } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchInput } from "@/components/shared/search-input";
import { FilterDropdown } from "@/components/shared/filter-dropdown";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { categories, suppliers } from "@/lib/mock-data";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

interface Props {
  items: Product[];
  onDelete: (id: string) => void;
}

export function ProductTable({ items, onDelete }: Props) {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState<string>("all");
  const [stockFilter, setStockFilter] = React.useState<string>("all");
  const [supplierFilter, setSupplierFilter] = React.useState<string>("all");
  const [deleteTarget, setDeleteTarget] = React.useState<Product | null>(null);

  const filtered = React.useMemo(() => {
    return items.filter((p) => {
      if (
        search &&
        !`${p.name} ${p.sku}`.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (category !== "all" && p.categoryId !== category) return false;
      if (stockFilter !== "all" && p.status !== stockFilter) return false;
      if (supplierFilter !== "all" && p.supplierId !== supplierFilter)
        return false;
      return true;
    });
  }, [items, search, category, stockFilter, supplierFilter]);

  const columns: Column<Product>[] = [
    {
      key: "product",
      header: "Product",
      cell: (p) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
            <Package className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{p.name}</p>
            <p className="text-xs text-muted-foreground">{p.sku}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (p) => {
        const c = categories.find((x) => x.id === p.categoryId);
        return (
          <span className="inline-flex items-center gap-1.5 text-xs">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: c?.color }}
            />
            {c?.name ?? "—"}
          </span>
        );
      },
    },
    {
      key: "purchase",
      header: "Purchase",
      align: "right",
      cell: (p) => (
        <span className="tabular-nums text-muted-foreground">
          {formatCurrency(p.purchasePrice)}
        </span>
      ),
    },
    {
      key: "selling",
      header: "Selling",
      align: "right",
      cell: (p) => (
        <span className="font-medium tabular-nums">
          {formatCurrency(p.sellingPrice)}
        </span>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      align: "right",
      cell: (p) => (
        <span className="tabular-nums">
          {p.currentStock}{" "}
          <span className="text-xs text-muted-foreground">{p.unit}</span>
        </span>
      ),
    },
    {
      key: "value",
      header: "Value",
      align: "right",
      cell: (p) => (
        <span className="tabular-nums text-muted-foreground">
          {formatCurrency(p.currentStock * p.purchasePrice)}
        </span>
      ),
    },
    {
      key: "profit",
      header: "Profit/unit",
      align: "right",
      cell: (p) => {
        const profit = p.sellingPrice - p.purchasePrice;
        const margin = p.sellingPrice > 0 ? (profit / p.sellingPrice) * 100 : 0;
        return (
          <div className="text-right">
            <p className="text-sm font-medium tabular-nums text-success">
              {formatCurrency(profit)}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {margin.toFixed(1)}%
            </p>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (p) => <StatusBadge status={p.status} />,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (p) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" /> View
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDeleteTarget(p)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search products…"
          />
          <div className="flex flex-wrap items-center gap-2">
            <FilterDropdown
              label="Category"
              value={category}
              onChange={setCategory}
              options={[
                { label: "All Categories", value: "all" },
                ...categories.map((c) => ({ label: c.name, value: c.id })),
              ]}
            />
            <FilterDropdown
              label="Stock"
              value={stockFilter}
              onChange={setStockFilter}
              options={[
                { label: "All", value: "all" },
                { label: "In Stock", value: "in-stock" },
                { label: "Low Stock", value: "low-stock" },
                { label: "Out of Stock", value: "out-of-stock" },
              ]}
            />
            <FilterDropdown
              label="Supplier"
              value={supplierFilter}
              onChange={setSupplierFilter}
              options={[
                { label: "All Suppliers", value: "all" },
                ...suppliers.map((s) => ({ label: s.name, value: s.id })),
              ]}
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(p) => p.id}
          emptyTitle="No products found"
          emptyDescription="Try adjusting your filters or add a new product."
        />
      </CardContent>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete this product?"
        description={`${deleteTarget?.name} will be permanently removed from your catalog.`}
        confirmLabel="Delete product"
        onConfirm={() => {
          if (deleteTarget) {
            onDelete(deleteTarget.id);
            toast.success("Product deleted", {
              description: deleteTarget.name,
            });
          }
          setDeleteTarget(null);
        }}
      />
    </Card>
  );
}
