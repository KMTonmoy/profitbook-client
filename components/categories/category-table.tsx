"use client";

import * as React from "react";
import { Pencil, Trash2, Tags } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SearchInput } from "@/components/shared/search-input";
import { DataTable, type Column } from "@/components/shared/data-table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { colorName } from "@/lib/color";
import type { Category } from "@/lib/types";

interface Props {
  items: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export function CategoryTable({ items, onEdit, onDelete }: Props) {
  const [search, setSearch] = React.useState("");
  const [deleteTarget, setDeleteTarget] = React.useState<Category | null>(null);

  const filtered = items.filter((c) =>
    c.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const columns: Column<Category>[] = [
    {
      key: "name",
      header: "Category",
      cell: (c) => (
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{
              background: c.color
                ? `color-mix(in oklab, ${c.color} 15%, transparent)`
                : "var(--color-muted)",
            }}
          >
            <Tags className="h-4 w-4" style={{ color: c.color ?? undefined }} />
          </div>
          <span className="text-sm font-medium">{c.name}</span>
        </div>
      ),
    },
    {
      key: "color",
      header: "Color",
      cell: (c) => (
        <div className="flex items-center gap-2">
          <span
            className="h-5 w-5 rounded-full border"
            style={{ background: c.color ?? "#e5e7eb" }}
          />
          <span className="text-sm">{colorName(c.color)}</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (c) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => onEdit(c)}
                  aria-label="Edit category"
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
                  onClick={() => setDeleteTarget(c)}
                  aria-label="Delete category"
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
              placeholder="Search categories…"
            />
          </div>
          <DataTable
            columns={columns}
            data={filtered}
            keyExtractor={(c) => c.id}
            emptyTitle="No categories yet"
            emptyDescription="Click Add Category to create your first one."
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete this category?"
        description={
          deleteTarget
            ? `${deleteTarget.name} will be permanently removed. Products using it will need a new category.`
            : ""
        }
        confirmLabel="Delete category"
        cancelLabel="Cancel"
        onConfirm={() => {
          if (deleteTarget) {
            onDelete(deleteTarget.id);
            toast.success("Category deleted", {
              description: deleteTarget.name,
            });
          }
          setDeleteTarget(null);
        }}
      />
    </>
  );
}