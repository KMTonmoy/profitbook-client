"use client";

import * as React from "react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { SearchInput } from "@/components/shared/search-input";
import { RecordPaymentModal } from "@/components/due/record-payment-modal";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Due } from "@/lib/types";

interface Props {
  items: Due[];
  onPaymentRecorded: () => void;
}

export function DueTable({ items, onPaymentRecorded }: Props) {
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<Due | null>(null);

  const filtered = items.filter((d) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (d.customerName ?? "").toLowerCase().includes(q) ||
      (d.invoiceNumber ?? "").toLowerCase().includes(q)
    );
  });

  const columns: Column<Due>[] = [
    {
      key: "customer",
      header: "Customer",
      cell: (d) => <span className="font-medium">{d.customerName}</span>,
    },
    {
      key: "invoice",
      header: "Invoice",
      cell: (d) => (
        <span className="text-xs text-muted-foreground">
          {d.invoiceNumber ?? "—"}
        </span>
      ),
    },
    {
      key: "saleDate",
      header: "Sale Date",
      cell: (d) => (d.saleDate ? formatDate(d.saleDate) : "—"),
    },
    {
      key: "total",
      header: "Total",
      align: "right",
      cell: (d) => (
        <span className="tabular-nums">{formatCurrency(d.totalAmount ?? 0)}</span>
      ),
    },
    {
      key: "paid",
      header: "Paid",
      align: "right",
      cell: (d) => (
        <span className="tabular-nums text-success">
          {formatCurrency(d.paid ?? 0)}
        </span>
      ),
    },
    {
      key: "due",
      header: "Due",
      align: "right",
      cell: (d) => (
        <span className="tabular-nums font-medium text-destructive">
          {formatCurrency(d.due ?? 0)}
        </span>
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      cell: (d) => (d.dueDate ? formatDate(d.dueDate) : "—"),
    },
    {
      key: "status",
      header: "Status",
      cell: (d) => <StatusBadge status={d.status} />,
    },
    {
      key: "action",
      header: "",
      align: "right",
      cell: (d) => (
        <Button
          size="sm"
          variant="outline"
          className="h-8"
          onClick={() => setSelected(d)}
        >
          Record Payment
        </Button>
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
              placeholder="Search by customer or invoice…"
            />
          </div>
          <DataTable
            columns={columns}
            data={filtered}
            keyExtractor={(d) => d.id}
            emptyTitle="No dues yet"
            emptyDescription="Dues appear here when a sale is saved with an unpaid amount."
          />
        </CardContent>
      </Card>

      <RecordPaymentModal
        key={selected?.id ?? "none"}
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
        due={selected}
        onSaved={() => {
          toast.success("Payment recorded");
          onPaymentRecorded();
          setSelected(null);
        }}
      />
    </>
  );
}