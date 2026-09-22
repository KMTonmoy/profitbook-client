"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { customers } from "@/lib/mock-data";
import type { Customer } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";

export function CustomerTable() {
  const columns: Column<Customer>[] = [
    { key: "name", header: "Name", cell: (c) => <span className="font-medium">{c.name}</span> },
    { key: "phone", header: "Phone", cell: (c) => <span className="text-muted-foreground">{c.phone}</span> },
    { key: "address", header: "Address", cell: (c) => <span className="text-xs text-muted-foreground">{c.address}</span> },
    { key: "purchases", header: "Purchases", align: "right", cell: (c) => <span className="tabular-nums">{formatCurrency(c.totalPurchases)}</span> },
    { key: "paid", header: "Paid", align: "right", cell: (c) => <span className="tabular-nums text-success">{formatCurrency(c.totalPaid)}</span> },
    { key: "due", header: "Due", align: "right", cell: (c) => <span className={`font-medium tabular-nums ${c.totalDue > 0 ? "text-destructive" : "text-muted-foreground"}`}>{formatCurrency(c.totalDue)}</span> },
    { key: "last", header: "Last Purchase", cell: (c) => c.lastPurchaseDate ? formatDate(c.lastPurchaseDate) : "—" },
    { key: "status", header: "Status", cell: (c) => <StatusBadge status={c.status} /> },
    {
      key: "action", header: "", align: "right",
      cell: () => <Button size="sm" variant="outline" className="h-8">View</Button>,
    },
  ];

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <DataTable columns={columns} data={customers} keyExtractor={(c) => c.id} />
      </CardContent>
    </Card>
  );
}