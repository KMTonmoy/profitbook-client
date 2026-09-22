import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { StatTone } from "@/components/shared/stat-card";

const toneMap = {
  primary:
    "bg-[color-mix(in_oklab,var(--color-primary)_10%,transparent)] text-primary",
  success:
    "bg-[color-mix(in_oklab,var(--color-success)_12%,transparent)] text-success",
  warning:
    "bg-[color-mix(in_oklab,var(--color-warning)_15%,transparent)] text-[color-mix(in_oklab,var(--color-warning)_70%,black)]",
  destructive:
    "bg-[color-mix(in_oklab,var(--color-destructive)_12%,transparent)] text-destructive",
  info: "bg-[color-mix(in_oklab,var(--color-info)_12%,transparent)] text-info",
  neutral: "bg-muted text-muted-foreground",
};

interface ReportCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  tone: StatTone;
  href: string;
}

export function ReportCard({
  title,
  description,
  icon: Icon,
  tone,
  href,
}: ReportCardProps) {
  return (
    <Link href={href}>
      <Card className="group h-full cursor-pointer shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
        <CardContent className="flex flex-col gap-4 p-5">
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl",
              toneMap[tone],
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={2.25} />
          </div>
          <div>
            <h3 className="text-sm font-semibold">{title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="mt-auto flex items-center text-xs font-medium text-primary">
            Open report
            <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
