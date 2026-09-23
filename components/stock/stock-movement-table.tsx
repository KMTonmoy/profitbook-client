"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { formatDate } from "@/lib/format";
import type { StockMovement, StockMovementType } from "@/lib/types";

const typeStyle: Record<StockMovementType, string> = {
  purchase:
    "bg-[color-mix(in_oklab,var(--color-info)_12%,transparent)] text-info border-transparent",
  sale: "bg-[color-mix(in_oklab,var(--color-success)_12%,transparent)] text-success border-transparent",
  return:
    "bg-[color-mix(in_oklab,var(--color-warning)_15%,transparent)] text-[color-mix(in_oklab,var(--color-warning)_70%,black)] border-transparent",
  adjustment: "bg-muted text-muted-foreground border-transparent",
  in: "bg-[color-mix(in_oklab,var(--color-info)_12%,transparent)] text-info border-transparent",
  out: "bg-[color-mix(in_oklab,var(--color-success)_12%,transparent)] text-success border-transparent",
} as Record<string, string> as Record<StockMovementType, string>;

interface Props {
  items: StockMovement[];
  loading?: boolean;
}

export function StockMovementTable({ items, loading }: Props) {
  const columns: Column<StockMovement>[] = [
    {
      key: "date",
      header: "Date",
      cell: (m) => formatDate(m.date),
    },
    {
      key: "product",
      header: "Product",
      cell: (m) => <span className="font-medium">{m.productName ?? "—"}</span>,
    },
    {
      key: "type",
      header: "Type",
      cell: (m) => (
        <Badge
          variant="outline"
          className={`capitalize ${
            (typeStyle as Record<string, string>)[m.type] ?? ""
          }`}
        >
          {m.type}
        </Badge>
      ),
    },
    {
      key: "qty",
      header: "Quantity",
      align: "right",
      cell: (m) => (
        <span
          className={`tabular-nums font-medium ${
            m.quantity > 0 ? "text-success" : "text-destructive"
          }`}
        >
          {m.quantity > 0 ? "+" : ""}
          {m.quantity}
        </span>
      ),
    },
    {
      key: "prev",
      header: "Previous",
      align: "right",
      cell: (m) => (
        <span className="tabular-nums text-muted-foreground">
          {m.previousStock ?? "—"}
        </span>
      ),
    },
    {
      key: "new",
      header: "New",
      align: "right",
      cell: (m) => (
        <span className="tabular-nums font-medium">{m.newStock ?? "—"}</span>
      ),
    },
    {
      key: "ref",
      header: "Reference",
      cell: (m) => (
        <span className="text-xs text-muted-foreground">
          {m.reference ?? "—"}
        </span>
      ),
    },
    {
      key: "user",
      header: "User",
      cell: (m) => (
        <span className="text-xs text-muted-foreground">
          {m.user ?? "Owner"}
        </span>
      ),
    },
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Stock Movements</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
            Loading movements…
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={items}
            keyExtractor={(m) => m.id}
            emptyTitle="No movements yet"
            emptyDescription="Stock movements appear here when sales or purchases are recorded."
          />
        )}
      </CardContent>
    </Card>
  );
}
