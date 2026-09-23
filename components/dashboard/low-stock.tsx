"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import type { Product } from "@/lib/types";

interface Props {
  items: Product[];
  loading?: boolean;
}

export function LowStock({ items, loading }: Props) {
  const data = items.slice(0, 5);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <CardTitle className="text-base">Low Stock Alerts</CardTitle>
        </div>
        <Link href="/stock">
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="rounded-xl border p-6 text-center text-sm text-muted-foreground">
            Loading…
          </div>
        ) : data.length === 0 ? (
          <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            No low-stock products. Everything looks healthy.
          </p>
        ) : (
          <ul className="divide-y">
            {data.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    SKU {p.sku} · Min {p.minimumStock}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums">
                    {p.currentStock}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      {p.unit}
                    </span>
                  </p>
                </div>
                <StatusBadge status={p.status} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
