"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";

interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  render?: (row: T) => React.ReactNode;
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  mapRow: (row: T) => Record<string, unknown>;
}

export function ReportTable<T>({ columns, rows, rowKey, mapRow }: Props<T>) {
  if (rows.length === 0) {
    return <EmptyState title="No data" description="Nothing to show for this period." />;
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                {columns.map((c) => (
                  <TableHead
                    key={c.key}
                    className={`h-11 whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-muted-foreground ${
                      c.align === "right"
                        ? "text-right"
                        : c.align === "center"
                          ? "text-center"
                          : ""
                    }`}
                  >
                    {c.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => {
                const mapped = mapRow(r);
                return (
                  <TableRow key={rowKey(r)}>
                    {columns.map((c) => (
                      <TableCell
                        key={c.key}
                        className={`whitespace-nowrap py-3 text-sm ${
                          c.align === "right"
                            ? "text-right"
                            : c.align === "center"
                              ? "text-center"
                              : ""
                        }`}
                      >
                        {c.render
                          ? c.render(r)
                          : String(mapped[c.key] ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}