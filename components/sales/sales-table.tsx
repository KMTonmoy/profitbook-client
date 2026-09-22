"use client";

import * as React from "react";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
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
import { InvoicePreview } from "@/components/sales/invoice-preview";
import { sales } from "@/lib/mock-data";
import type { Sale } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";

export function SalesTable() {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [viewSale, setViewSale] = React.useState<Sale | null>(null);
  const [deleteSale, setDeleteSale] = React.useState<Sale | null>(null);

  const filtered = sales.filter((s) => {
    if (
      search &&
      !`${s.invoiceNumber} ${s.customerName}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
      return false;
    if (status !== "all" && s.status !== status) return false;
    return true;
  });

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
      header: "",
      align: "right",
      cell: (s) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setViewSale(s)}>
              <Eye className="mr-2 h-4 w-4" />
              View invoice
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDeleteSale(s)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
          />
        </CardContent>
      </Card>

      <InvoicePreview
        open={!!viewSale}
        onOpenChange={(o) => !o && setViewSale(null)}
        sale={viewSale}
      />

      <ConfirmDialog
        open={!!deleteSale}
        onOpenChange={(o) => !o && setDeleteSale(null)}
        title="Delete sale?"
        description={`Invoice ${deleteSale?.invoiceNumber} will be permanently removed.`}
        onConfirm={() => {
          toast.success("Sale deleted", {
            description: deleteSale?.invoiceNumber,
          });
          setDeleteSale(null);
        }}
      />
    </>
  );
}