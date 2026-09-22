import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function TableLoading({
  rows = 6,
  cols = 5,
  className,
}: {
  rows?: number;
  cols?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton
              key={j}
              className={cn("h-4", j === 0 ? "w-40" : "flex-1")}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardLoading({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3 rounded-xl border p-5", className)}>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-7 w-40" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}
