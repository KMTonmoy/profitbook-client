import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { PaymentStatus, StockStatus } from "@/lib/types";

type Status = PaymentStatus | StockStatus | "active" | "inactive";

const map: Record<Status, { label: string; className: string; dot: string }> = {
  paid: {
    label: "Paid",
    className:
      "bg-[color-mix(in_oklab,var(--color-success)_12%,transparent)] text-success border-transparent",
    dot: "bg-success",
  },
  partial: {
    label: "Partial",
    className:
      "bg-[color-mix(in_oklab,var(--color-warning)_15%,transparent)] text-[color-mix(in_oklab,var(--color-warning)_70%,black)] border-transparent",
    dot: "bg-warning",
  },
  due: {
    label: "Due",
    className:
      "bg-[color-mix(in_oklab,var(--color-warning)_15%,transparent)] text-[color-mix(in_oklab,var(--color-warning)_70%,black)] border-transparent",
    dot: "bg-warning",
  },
  overdue: {
    label: "Overdue",
    className:
      "bg-[color-mix(in_oklab,var(--color-destructive)_12%,transparent)] text-destructive border-transparent",
    dot: "bg-destructive",
  },
  "in-stock": {
    label: "In Stock",
    className:
      "bg-[color-mix(in_oklab,var(--color-success)_12%,transparent)] text-success border-transparent",
    dot: "bg-success",
  },
  "low-stock": {
    label: "Low Stock",
    className:
      "bg-[color-mix(in_oklab,var(--color-warning)_15%,transparent)] text-[color-mix(in_oklab,var(--color-warning)_70%,black)] border-transparent",
    dot: "bg-warning",
  },
  "out-of-stock": {
    label: "Out of Stock",
    className:
      "bg-[color-mix(in_oklab,var(--color-destructive)_12%,transparent)] text-destructive border-transparent",
    dot: "bg-destructive",
  },
  active: {
    label: "Active",
    className:
      "bg-[color-mix(in_oklab,var(--color-success)_12%,transparent)] text-success border-transparent",
    dot: "bg-success",
  },
  inactive: {
    label: "Inactive",
    className: "bg-muted text-muted-foreground border-transparent",
    dot: "bg-muted-foreground",
  },
};

interface StatusBadgeProps {
  status: Status;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const s = map[status];
  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        s.className,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {label ?? s.label}
    </Badge>
  );
}
