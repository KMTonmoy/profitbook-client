"use client";

import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Due } from "@/lib/types";

interface Props {
  items: Due[];
  loading?: boolean;
}

export function RecentDues({ items, loading }: Props) {
  const data = items.slice(0, 5);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base">Recent Due Customers</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Follow-ups needed to recover receivables
          </p>
        </div>
        <Link href="/due">
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
            No outstanding dues.
          </p>
        ) : (
          <ul className="divide-y">
            {data.map((d) => (
              <li
                key={d.id}
                className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">
                      {d.customerName}
                    </p>
                    <StatusBadge status={d.status} />
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    Due {d.dueDate ? formatDate(d.dueDate) : "—"} ·{" "}
                    {d.invoiceNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums text-destructive">
                    {formatCurrency(d.due)}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    of {formatCurrency(d.totalAmount)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
