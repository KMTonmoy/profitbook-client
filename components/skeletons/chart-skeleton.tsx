import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartSkeletonProps {
  height?: string;
  bars?: number;
}

export function ChartSkeleton({
  height = "h-[300px]",
  bars = 12,
}: ChartSkeletonProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-2 h-3 w-56" />
      </CardHeader>
      <CardContent className="pt-2">
        <div className={`flex w-full ${height} items-end gap-2`}>
          {Array.from({ length: bars }).map((_, i) => (
            <Skeleton
              key={i}
              className="flex-1"
              style={{
                height: `${30 + ((i * 37) % 60)}%`,
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
