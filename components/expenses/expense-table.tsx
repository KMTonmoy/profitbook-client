"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, type Column } from "@/components/shared/data-table";
import { expenses } from "@/lib/mock-data";
import type { Expense } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";

export function ExpenseTable() {
  const columns: Column<Expense>[] = [
    { key: "date", header: "Date", cell: (e) => formatDate(e.date) },
    {
      key: "cat",
      header: "Category",
      cell: (e) => (
        <Badge variant="outline" className="capitalize">
          {e.category}
        </Badge>
      ),
    },
    {
      key: "desc",
      header: "Description",
      cell: (e) => <span className="font-medium">{e.description}</span>,
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      cell: (e) => (
        <span className="font-medium tabular-nums">
          {formatCurrency(e.amount)}
        </span>
      ),
    },
    {
      key: "method",
      header: "Method",
      cell: (e) => (
        <span className="capitalize text-muted-foreground">
          {e.paymentMethod}
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
      <CardContent className="p-4 sm:p-5">
        <DataTable
          columns={columns}
          data={expenses}
          keyExtractor={(e) => e.id}
        />
      </CardContent>
    </Card>
  );
}
