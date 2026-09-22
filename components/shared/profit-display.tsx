import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatPercent } from "@/lib/format";

interface ProfitDisplayProps {
  value: number;
  percent?: number;
  className?: string;
  showIcon?: boolean;
  invert?: boolean;
}

export function ProfitDisplay({
  value,
  percent,
  className,
  showIcon = true,
  invert = false,
}: ProfitDisplayProps) {
  const positive = invert ? value < 0 : value >= 0;
  const Icon = value >= 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showIcon && (
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full",
            positive
              ? "bg-[color-mix(in_oklab,var(--color-success)_15%,transparent)] text-success"
              : "bg-[color-mix(in_oklab,var(--color-destructive)_15%,transparent)] text-destructive",
          )}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
        </span>
      )}
      <div className="flex flex-col leading-tight">
        <span
          className={cn(
            "text-sm font-semibold",
            value >= 0 ? "text-success" : "text-destructive",
          )}
        >
          {formatCurrency(value)}
        </span>
        {percent !== undefined && (
          <span className="text-[11px] text-muted-foreground">
            {formatPercent(percent)} vs last period
          </span>
        )}
      </div>
    </div>
  );
}
