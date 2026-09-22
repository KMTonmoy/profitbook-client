import { BookOpenCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { box: "h-8 w-8", icon: "h-4 w-4", title: "text-sm", sub: "text-[10px]" },
  md: {
    box: "h-10 w-10",
    icon: "h-5 w-5",
    title: "text-base",
    sub: "text-[11px]",
  },
  lg: { box: "h-12 w-12", icon: "h-6 w-6", title: "text-lg", sub: "text-xs" },
};

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const s = sizeMap[size];
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm",
          s.box,
        )}
        aria-hidden
      >
        <BookOpenCheck className={s.icon} strokeWidth={2.25} />
      </div>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={cn("font-semibold tracking-tight", s.title)}>
            ProfitBook
          </span>
          <span className={cn("text-muted-foreground", s.sub)}>
            Business Manager
          </span>
        </div>
      )}
    </div>
  );
}
