import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { formatPercent } from "@/lib/format";

export type StatTone =
  | "primary"
  | "success"
  | "warning"
  | "destructive"
  | "info"
  | "neutral";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  tone?: StatTone;
  change?: number;
  changeLabel?: string;
  description?: string;
  className?: string;
}

const toneMap: Record<StatTone, { wrap: string; icon: string }> = {
  primary: {
    wrap: "bg-[color-mix(in_oklab,var(--color-primary)_10%,transparent)]",
    icon: "text-primary",
  },
  success: {
    wrap: "bg-[color-mix(in_oklab,var(--color-success)_12%,transparent)]",
    icon: "text-success",
  },
  warning: {
    wrap: "bg-[color-mix(in_oklab,var(--color-warning)_15%,transparent)]",
    icon: "text-[color-mix(in_oklab,var(--color-warning)_70%,black)]",
  },
  destructive: {
    wrap: "bg-[color-mix(in_oklab,var(--color-destructive)_12%,transparent)]",
    icon: "text-destructive",
  },
  info: {
    wrap: "bg-[color-mix(in_oklab,var(--color-info)_12%,transparent)]",
    icon: "text-info",
  },
  neutral: {
    wrap: "bg-muted",
    icon: "text-muted-foreground",
  },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
  change,
  changeLabel,
  description,
  className,
}: StatCardProps) {
  const t = toneMap[tone];
  const positive = (change ?? 0) >= 0;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border shadow-sm transition-all hover:shadow-md",
        className,
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <div className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
              {value}
            </div>
          </div>
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              t.wrap,
            )}
          >
            <Icon className={cn("h-5 w-5", t.icon)} strokeWidth={2.25} />
          </div>
        </div>

        {(change !== undefined || description) && (
          <div className="mt-3 flex items-center gap-2 text-xs">
            {change !== undefined && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium",
                  positive
                    ? "bg-[color-mix(in_oklab,var(--color-success)_12%,transparent)] text-success"
                    : "bg-[color-mix(in_oklab,var(--color-destructive)_12%,transparent)] text-destructive",
                )}
              >
                {positive ? (
                  <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
                ) : (
                  <ArrowDownRight className="h-3 w-3" strokeWidth={2.5} />
                )}
                {formatPercent(Math.abs(change))}
              </span>
            )}
            {(changeLabel || description) && (
              <span className="truncate text-muted-foreground">
                {description ?? changeLabel}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
