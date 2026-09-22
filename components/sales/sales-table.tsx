"use client";

import * as React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SearchInput } from "@/components/shared/search-input";
import { FilterDropdown } from "@/components/shared/filter-dropdown";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import type { Sale } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";

interface Props {
  sales: Sale[];
  onDelete: (id: string) => void;
  onView: (sale: Sale) => void;
  onEdit: (sale: Sale) => void;
}

export function SalesTable({ sales, onDelete, onView, onEdit }: Props) {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [deleteSale, setDeleteSale] = React.useState<Sale | null>(null);

  const filtered = React.useMemo(
    () =>
      sales.filter((s) => {
        if (
          search &&
          !`${s.invoiceNumber} ${s.customerName}`
            .toLowerCase()
            .includes(search.toLowerCase())
        )
          return false;
        if (status !== "all" && s.status !== status) return false;
        return true;
      }),
    [sales, search, status]
  );

  const columns: Column<Sale>[] = [
    {
      key: "inv",
      header: "Invoice",
      cell: (s) => <span className="font-medium">{s.invoiceNumber}</span>,
    },
    { key: "cust", header: "Customer", cell: (s) => s.customerName },
    {
      key: "date",
      header: "Date",
      cell: (s) => (
        <span className="text-muted-foreground">{formatDate(s.date)}</span>
      ),
    },
    {
      key: "items",
      header: "Items",
      align: "center",
      cell: (s) => (
        <span className="text-muted-foreground">{s.items.length}</span>
      ),
    },
    {
      key: "total",
      header: "Total",
      align: "right",
      cell: (s) => (
        <span className="font-medium tabular-nums">
          {formatCurrency(s.total)}
        </span>
      ),
    },
    {
      key: "paid",
      header: "Paid",
      align: "right",
      cell: (s) => (
        <span className="tabular-nums text-success">
          {formatCurrency(s.paid)}
        </span>
      ),
    },
    {
      key: "due",
      header: "Due",
      align: "right",
      cell: (s) => (
        <span
          className={`tabular-nums ${
            s.due > 0 ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          {formatCurrency(s.due)}
        </span>
      ),
    },
    {
      key: "profit",
      header: "Profit",
      align: "right",
      cell: (s) => (
        <span className="font-medium tabular-nums text-success">
          {formatCurrency(s.profit)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (s) => <StatusBadge status={s.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (s) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => onView(s)}
                  aria-label="View invoice"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent side="top">View invoice</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => onEdit(s)}
                  aria-label="Edit sale"
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
                  onClick={() => setDeleteSale(s)}
                  aria-label="Delete sale"
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
              placeholder="Search invoices…"
            />
            <FilterDropdown
              label="Payment"
              value={status}
              onChange={setStatus}
              options={[
                { label: "All", value: "all" },
                { label: "Paid", value: "paid" },
                { label: "Partial", value: "partial" },
                { label: "Overdue", value: "overdue" },
              ]}
            />
          </div>
          <DataTable
            columns={columns}
            data={filtered}
            keyExtractor={(s) => s.id}
            emptyTitle="No sales yet"
            emptyDescription="Click Add Sale to create your first invoice."
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteSale}
        onOpenChange={(o) => !o && setDeleteSale(null)}
        title="Delete this sale?"
        description={
          deleteSale
            ? `Invoice ${deleteSale.invoiceNumber} · ${deleteSale.customerName} · ${formatCurrency(
                deleteSale.total
              )}. Stock will be restored automatically.`
            : ""
        }
        confirmLabel="Delete sale"
        cancelLabel="Cancel"
        onConfirm={() => {
          if (deleteSale) {
            onDelete(deleteSale.id);
            toast.success("Sale deleted", {
              description: deleteSale.invoiceNumber,
            });
          }
          setDeleteSale(null);
        }}
      />
    </>
  );
}