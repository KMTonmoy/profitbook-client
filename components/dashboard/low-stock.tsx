import { AlertTriangle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { products } from "@/lib/mock-data";

export function LowStock() {
  const data = products
    .filter((p) => p.status === "low-stock" || p.status === "out-of-stock")
    .slice(0, 5);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <CardTitle className="text-base">Low Stock Alerts</CardTitle>
        </div>
        <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="divide-y">
          {data.map((p) => (
            <li key={p.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  SKU {p.sku} · Min {p.minimumStock}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums">
                  {p.currentStock} <span className="text-xs font-normal text-muted-foreground">{p.unit}</span>
                </p>
              </div>
              <StatusBadge status={p.status} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}