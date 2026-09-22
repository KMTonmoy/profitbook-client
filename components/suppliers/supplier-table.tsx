"use client";

import * as React from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Building2,
  Phone,
  User,
} from "lucide-react";
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
import { DataTable, type Column } from "@/components/shared/data-table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import type { Supplier } from "@/lib/types";

interface Props {
  items: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
}

export function SupplierTable({ items, onEdit, onDelete }: Props) {
  const [search, setSearch] = React.useState("");
  const [deleteTarget, setDeleteTarget] = React.useState<Supplier | null>(null);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((s) =>
      [
        s.name,
        s.agentName ?? "",
        s.agentPhone ?? "",
        s.phone,
        s.address,
        s.email ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [items, search]);

  const columns: Column<Supplier>[] = [
    {
      key: "name",
      header: "Company",
      cell: (s) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{s.name}</p>
            {s.address && (
              <p className="truncate text-xs text-muted-foreground">
                {s.address}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "agent",
      header: "Agent",
      cell: (s) =>
        s.agentName ? (
          <span className="inline-flex items-center gap-1.5 text-sm">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            {s.agentName}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
    {
      key: "agentPhone",
      header: "Agent Number",
      cell: (s) =>
        s.agentPhone ? (
          <span className="inline-flex items-center gap-1.5 text-sm tabular-nums">
            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
            {s.agentPhone}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
    {
      key: "phone",
      header: "Company Phone",
      cell: (s) => (
        <span className="text-sm tabular-nums text-muted-foreground">
          {s.phone || "—"}
        </span>
      ),
    },
    {
      key: "email",
      header: "Email",
      cell: (s) => (
        <span className="text-sm text-muted-foreground">
          {s.email || "—"}
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
            <DropdownMenuItem onClick={() => onEdit(s)}>
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
      <CardContent className="p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search suppliers, agents, phone…"
          />
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(s) => s.id}
          emptyTitle="No suppliers yet"
          emptyDescription="Add your first supplier to start tracking purchases."
        />
      </CardContent>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete this supplier?"
        description={`${deleteTarget?.name} will be permanently removed.`}
        confirmLabel="Delete supplier"
        onConfirm={() => {
          if (deleteTarget) {
            onDelete(deleteTarget.id);
            toast.success("Supplier deleted", {
              description: deleteTarget.name,
            });
          }
          setDeleteTarget(null);
        }}
      />
    </Card>
  );
}