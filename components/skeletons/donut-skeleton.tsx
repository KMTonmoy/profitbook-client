import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DonutSkeleton() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-2 h-3 w-52" />
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex items-center justify-center py-6">
          <div className="relative h-[160px] w-[160px]">
            <Skeleton className="h-full w-full rounded-full" />
            <Skeleton className="absolute inset-6 rounded-full bg-background" />
          </div>
        </div>
        <div className="mt-3 space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-3 flex-1" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
