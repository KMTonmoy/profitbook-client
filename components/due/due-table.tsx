"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { RecordPaymentModal } from "@/components/due/record-payment-modal";
import { dues } from "@/lib/mock-data";
import type { Due } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";

export function DueTable() {
  const [selected, setSelected] = React.useState<Due | null>(null);

  const columns: Column<Due>[] = [
    { key: "customer", header: "Customer", cell: (d) => <span className="font-medium">{d.customerName}</span> },
    { key: "inv", header: "Invoice", cell: (d) => <span className="text-xs text-muted-foreground">{d.invoiceNumber}</span> },
    { key: "saleDate", header: "Sale Date", cell: (d) => formatDate(d.saleDate) },
    { key: "total", header: "Total", align: "right", cell: (d) => <span className="tabular-nums">{formatCurrency(d.totalAmount)}</span> },
    { key: "paid", header: "Paid", align: "right", cell: (d) => <span className="tabular-nums text-success">{formatCurrency(d.paid)}</span> },
    { key: "due", header: "Due", align: "right", cell: (d) => <span className="font-medium tabular-nums text-destructive">{formatCurrency(d.due)}</span> },
    { key: "dueDate", header: "Due Date", cell: (d) => formatDate(d.dueDate) },
    { key: "status", header: "Status", cell: (d) => <StatusBadge status={d.status} /> },
    {
      key: "action", header: "", align: "right",
      cell: (d) => (
        <Button size="sm" variant="outline" className="h-8" onClick={() => setSelected(d)}>
          Record Payment
        </Button>
      ),
    },
  ];

  return (
    <>
      <Card className="shadow-sm">
        <CardContent className="p-4 sm:p-5">
          <DataTable columns={columns} data={dues} keyExtractor={(d) => d.id} />
        </CardContent>
      </Card>

      <RecordPaymentModal
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
        due={selected}
      />
    </>
  );
}