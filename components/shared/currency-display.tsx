import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";

interface CurrencyDisplayProps {
  value: number;
  currency?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  muted?: boolean;
  signed?: boolean;
}

const sizeMap = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl font-semibold tracking-tight",
  xl: "text-3xl font-semibold tracking-tight",
};

export function CurrencyDisplay({
  value,
  currency = "BDT",
  className,
  size = "md",
  muted = false,
  signed = false,
}: CurrencyDisplayProps) {
  const text = formatCurrency(signed ? value : Math.abs(value), currency);
  return (
    <span
      className={cn(
        sizeMap[size],
        muted && "text-muted-foreground",
        value < 0 && signed && "text-destructive",
        className,
      )}
    >
      {text}
    </span>
  );
}
