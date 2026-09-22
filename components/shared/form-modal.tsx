"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface FormModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "wide" | "auto";
}

const sizeMap: Record<NonNullable<FormModalProps["size"]>, string> = {
  sm: "w-[95vw] sm:w-fit sm:min-w-[380px] max-w-[95vw]",
  md: "w-[95vw] sm:w-fit sm:min-w-[440px] max-w-[95vw]",
  lg: "w-[95vw] sm:w-fit sm:min-w-[560px] max-w-[95vw]",
  xl: "w-[95vw] sm:w-fit sm:min-w-[720px] max-w-[95vw]",
  wide: "w-[95vw] sm:w-fit sm:min-w-[900px] max-w-[95vw]",
  auto: "w-[95vw] sm:w-fit max-w-[95vw]",
};

export function FormModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "lg",
}: FormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex max-h-[94vh] flex-col gap-0 overflow-hidden p-0 outline-none",
          "bg-background border shadow-lg ring-0",
          sizeMap[size],
        )}
      >
        <DialogHeader className="shrink-0 border-b bg-background px-6 py-4">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin px-6 py-5">
          {children}
        </div>

        {footer && (
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t bg-background px-6 py-4">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
