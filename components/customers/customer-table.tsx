"use client";

import * as React from "react";
import { Pencil, Trash2, User } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { SearchInput } from "@/components/shared/search-input";
import { DataTable, type Column } from "@/components/shared/data-table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Customer } from "@/lib/types";

interface Props {
  items: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

export function CustomerTable({ items, onEdit, onDelete }: Props) {
  const [search, setSearch] = React.useState("");
  const [deleteTarget, setDeleteTarget] = React.useState<Customer | null>(
    null
  );

  const filtered = items.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      (c.address ?? "").toLowerCase().includes(q)
    );
  });

  const columns: Column<Customer>[] = [
    {
      key: "name",
      header: "Customer",
      cell: (c) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{c.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {c.phone}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "address",
      header: "Address",
      cell: (c) => (
        <span className="text-xs text-muted-foreground">
          {c.address ?? "—"}
        </span>
      ),
    },
    {
      key: "purchases",
      header: "Purchases",
      align: "right",
      cell: (c) => (
        <span className="tabular-nums">
          {formatCurrency(c.totalPurchases ?? 0)}
        </span>
      ),
    },
    {
      key: "paid",
      header: "Paid",
      align: "right",
      cell: (c) => (
        <span className="tabular-nums text-success">
          {formatCurrency(c.totalPaid ?? 0)}
        </span>
      ),
    },
    {
      key: "due",
      header: "Due",
      align: "right",
      cell: (c) => (
        <span
          className={`tabular-nums ${
            (c.totalDue ?? 0) > 0
              ? "text-destructive font-medium"
              : "text-muted-foreground"
          }`}
        >
          {formatCurrency(c.totalDue ?? 0)}
        </span>
      ),
    },
    {
      key: "last",
      header: "Last Purchase",
      cell: (c) =>
        c.lastPurchaseDate ? (
          formatDate(c.lastPurchaseDate)
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "status",
      header: "Status",
      cell: (c) => <StatusBadge status={c.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (c) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(c)}
            aria-label="Edit customer"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
            onClick={() => setDeleteTarget(c)}
            aria-label="Delete customer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Card className="shadow-sm">
        <CardContent className="p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search customers…"
            />
          </div>
          <DataTable
            columns={columns}
            data={filtered}
            keyExtractor={(c) => c.id}
            emptyTitle="No customers yet"
            emptyDescription="Click Add Customer to create your first one."
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete this customer?"
        description={
          deleteTarget
            ? `${deleteTarget.name} · ${deleteTarget.phone} will be permanently removed.`
            : ""
        }
        confirmLabel="Delete customer"
        cancelLabel="Cancel"
        onConfirm={() => {
          if (deleteTarget) {
            onDelete(deleteTarget.id);
            toast.success("Customer deleted", {
              description: deleteTarget.name,
            });
          }
          setDeleteTarget(null);
        }}
      />
    </>
  );
}