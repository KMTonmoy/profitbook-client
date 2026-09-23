"use client";

import * as React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SearchInput } from "@/components/shared/search-input";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import type { Purchase } from "@/app/purchases/page";
import { formatCurrency, formatDate } from "@/lib/format";

interface Props {
  purchases: Purchase[];
  onDelete: (id: string) => void;
  onEdit: (purchase: Purchase) => void;
}

export function PurchaseTable({ purchases, onDelete, onEdit }: Props) {
  const [search, setSearch] = React.useState("");
  const [deleteTarget, setDeleteTarget] = React.useState<Purchase | null>(null);

  const filtered = purchases.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      p.purchaseNumber.toLowerCase().includes(q) ||
      p.supplierName.toLowerCase().includes(q) ||
      (p.agentName ?? "").toLowerCase().includes(q)
    );
  });

  const columns: Column<Purchase>[] = [
    {
      key: "num",
      header: "Purchase #",
      cell: (p) => <span className="font-medium">{p.purchaseNumber}</span>,
    },
    {
      key: "supplier",
      header: "Supplier",
      cell: (p) => (
        <div className="min-w-0">
          <p className="text-sm font-medium">{p.supplierName}</p>
          {p.agentName && (
            <p className="text-[11px] text-muted-foreground">
              Agent: {p.agentName}
              {p.agentPhone ? ` · ${p.agentPhone}` : ""}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "date",
      header: "Date",
      cell: (p) => (
        <span className="text-muted-foreground">{formatDate(p.date)}</span>
      ),
    },
    {
      key: "items",
      header: "Items",
      align: "center",
      cell: (p) => (
        <span className="text-muted-foreground">{p.items.length}</span>
      ),
    },
    {
      key: "total",
      header: "Total",
      align: "right",
      cell: (p) => (
        <span className="font-medium tabular-nums">
          {formatCurrency(p.total)}
        </span>
      ),
    },
    {
      key: "paid",
      header: "Paid",
      align: "right",
      cell: (p) => (
        <span className="tabular-nums text-success">
          {formatCurrency(p.paid)}
        </span>
      ),
    },
    {
      key: "due",
      header: "Due",
      align: "right",
      cell: (p) => (
        <span
          className={`tabular-nums ${
            p.due > 0 ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          {formatCurrency(p.due)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (p) => <StatusBadge status={p.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (p) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => onEdit(p)}
                  aria-label="Edit purchase"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent side="top">Edit</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setDeleteTarget(p)}
                  aria-label="Delete purchase"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent side="top">Delete</TooltipContent>
          </Tooltip>
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
              placeholder="Search purchases…"
            />
          </div>
          <DataTable
            columns={columns}
            data={filtered}
            keyExtractor={(p) => p.id}
            emptyTitle="No purchases yet"
            emptyDescription="Click Add Purchase to record your first one."
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete this purchase?"
        description={
          deleteTarget
            ? `${deleteTarget.purchaseNumber} · ${deleteTarget.supplierName} · ${formatCurrency(deleteTarget.total)}`
            : ""
        }
        confirmLabel="Delete purchase"
        cancelLabel="Cancel"
        onConfirm={() => {
          if (deleteTarget) {
            onDelete(deleteTarget.id);
            toast.success("Purchase deleted", {
              description: deleteTarget.purchaseNumber,
            });
          }
          setDeleteTarget(null);
        }}
      />
    </>
  );
}