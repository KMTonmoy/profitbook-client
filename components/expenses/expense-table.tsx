"use client";

import * as React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SearchInput } from "@/components/shared/search-input";
import { FilterDropdown } from "@/components/shared/filter-dropdown";
import { DataTable, type Column } from "@/components/shared/data-table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import type { Expense } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";

interface Props {
  items: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

const CATEGORY_STYLES: Record<string, string> = {
  rent: "bg-info/10 text-info border-transparent",
  electricity: "bg-warning/15 text-warning-foreground border-transparent",
  salary: "bg-primary/10 text-primary border-transparent",
  transport: "bg-muted text-muted-foreground border-transparent",
  maintenance: "bg-destructive/10 text-destructive border-transparent",
  marketing: "bg-success/10 text-success border-transparent",
  packaging: "bg-muted text-muted-foreground border-transparent",
  other: "bg-muted text-muted-foreground border-transparent",
};

export function ExpenseTable({ items, onDelete, onEdit }: Props) {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [deleteTarget, setDeleteTarget] = React.useState<Expense | null>(null);

  const filtered = React.useMemo(
    () =>
      items.filter((e) => {
        if (
          search &&
          !`${e.description} ${e.category} ${e.paymentMethod}`
            .toLowerCase()
            .includes(search.toLowerCase())
        )
          return false;
        if (category !== "all" && e.category !== category) return false;
        return true;
      }),
    [items, search, category],
  );

  const columns: Column<Expense>[] = [
    {
      key: "date",
      header: "Date",
      cell: (e) => (
        <span className="text-muted-foreground">{formatDate(e.date)}</span>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (e) => (
        <Badge
          variant="outline"
          className={`capitalize ${CATEGORY_STYLES[e.category] ?? ""}`}
        >
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
      header: "Actions",
      align: "right",
      cell: (e) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => onEdit(e)}
                  aria-label="Edit expense"
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
                  onClick={() => setDeleteTarget(e)}
                  aria-label="Delete expense"
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
              placeholder="Search expenses…"
            />
            <FilterDropdown
              label="Category"
              value={category}
              onChange={setCategory}
              options={[
                { label: "All", value: "all" },
                { label: "Rent", value: "rent" },
                { label: "Electricity", value: "electricity" },
                { label: "Salary", value: "salary" },
                { label: "Transport", value: "transport" },
                { label: "Maintenance", value: "maintenance" },
                { label: "Marketing", value: "marketing" },
                { label: "Packaging", value: "packaging" },
                { label: "Other", value: "other" },
              ]}
            />
          </div>
          <DataTable
            columns={columns}
            data={filtered}
            keyExtractor={(e) => e.id}
            emptyTitle="No expenses yet"
            emptyDescription="Click Add Expense to record your first one."
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete this expense?"
        description={
          deleteTarget
            ? `${deleteTarget.description} · ${formatCurrency(
                deleteTarget.amount,
              )} · ${formatDate(deleteTarget.date)}`
            : ""
        }
        confirmLabel="Delete expense"
        cancelLabel="Cancel"
        onConfirm={() => {
          if (deleteTarget) {
            onDelete(deleteTarget.id);
            toast.success("Expense deleted", {
              description: deleteTarget.description,
            });
          }
          setDeleteTarget(null);
        }}
      />
    </>
  );
}
