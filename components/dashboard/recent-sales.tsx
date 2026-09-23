"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2, MoreHorizontal } from "lucide-react";

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
import { formatCurrency, formatDate } from "@/lib/format";
import type { Sale } from "@/lib/types";

interface Props {
  items: Sale[];
  loading?: boolean;
}

export function RecentSales({ items, loading }: Props) {
  const columns: Column<Sale>[] = [
    {
      key: "invoice",
      header: "Invoice",
      cell: (s) => <span className="font-medium">{s.invoiceNumber}</span>,
    },
    {
      key: "customer",
      header: "Customer",
      cell: (s) => s.customerName,
    },
    {
      key: "date",
      header: "Date",
      cell: (s) => (
        <span className="text-muted-foreground">{formatDate(s.date)}</span>
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
      cell: () => (
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
            <DropdownMenuItem className="text-destructive focus:text-destructive">
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
        <Link href="/sales">
          <Button variant="outline" size="sm" className="h-8">
            View all
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
            Loading…
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={items}
            keyExtractor={(s) => s.id}
            emptyTitle="No sales yet"
            emptyDescription="Your latest sales will show up here."
          />
        )}
      </CardContent>
    </Card>
  );
}
