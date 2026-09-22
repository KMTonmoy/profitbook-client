"use client";

import * as React from "react";
import { Eye, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { sales as allSales } from "@/lib/mock-data";
import type { Sale } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";

export function RecentSales() {
  const [deleteTarget, setDeleteTarget] = React.useState<Sale | null>(null);
  const data = allSales.slice(0, 6);

  const columns: Column<Sale>[] = [
    {
      key: "invoice",
      header: "Invoice",
      cell: (s) => <span className="font-medium">{s.invoiceNumber}</span>,
    },
    {
      key: "customer",
      header: "Customer",
      cell: (s) => <span className="text-foreground">{s.customerName}</span>,
    },
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
        <span className="text-muted-foreground">{s.items.length || 3}</span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      cell: (s) => (
        <span className="font-medium tabular-nums">
          {formatCurrency(s.total)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Payment",
      cell: (s) => <StatusBadge status={s.status} />,
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
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" /> View
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDeleteTarget(s)}
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
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base">Recent Sales</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Latest transactions across your business
          </p>
        </div>
        <Button variant="outline" size="sm" className="h-8">
          View all
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <DataTable
          columns={columns}
          data={data}
          keyExtractor={(s) => s.id}
          emptyTitle="No sales yet"
          emptyDescription="Your latest sales will show up here."
        />
      </CardContent>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete this sale?"
        description={`Invoice ${deleteTarget?.invoiceNumber} will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={() => {
          toast.success("Sale deleted", {
            description: deleteTarget?.invoiceNumber,
          });
          setDeleteTarget(null);
        }}
      />
    </Card>
  );
}
