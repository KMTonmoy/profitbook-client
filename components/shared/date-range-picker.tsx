"use client";

import * as React from "react";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const presets = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "Last Month", value: "last-month" },
  { label: "This Year", value: "year" },
  { label: "Custom Range", value: "custom" },
] as const;

export type DateRangePreset = (typeof presets)[number]["value"];

interface DateRangePickerProps {
  defaultValue?: DateRangePreset;
  onPresetChange?: (preset: DateRangePreset) => void;
  onRangeChange?: (range: { from?: Date; to?: Date }) => void;
  className?: string;
}

const formatShort = (date: Date) =>
  date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

export function DateRangePicker({
  defaultValue = "month",
  onPresetChange,
  onRangeChange,
  className,
}: DateRangePickerProps) {
  const [preset, setPreset] = React.useState<DateRangePreset>(defaultValue);
  const [range, setRange] = React.useState<{ from?: Date; to?: Date }>({
    from: new Date(),
    to: new Date(),
  });
  const [open, setOpen] = React.useState(false);

  const currentLabel =
    presets.find((p) => p.value === preset)?.label ?? "This Month";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Select
        value={preset}
        onValueChange={(v) => {
          const val = v as DateRangePreset;
          setPreset(val);
          onPresetChange?.(val);
          if (val === "custom") setOpen(true);
        }}
      >
        <SelectTrigger className="h-9 w-[150px]">
          <SelectValue placeholder={currentLabel} />
        </SelectTrigger>
        <SelectContent>
          {presets.map((p) => (
            <SelectItem key={p.value} value={p.value}>
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {preset === "custom" && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <CalendarIcon className="h-4 w-4" />
                {range.from ? (
                  range.to ? (
                    <>
                      {formatShort(range.from)} – {formatShort(range.to)}
                    </>
                  ) : (
                    formatShort(range.from)
                  )
                ) : (
                  <span>Pick range</span>
                )}
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </Button>
            }
          />
          <PopoverContent align="end" className="w-auto p-0">
            <Calendar
              mode="range"
              selected={range as { from: Date; to: Date } | undefined}
              onSelect={(r) => {
                const next = (r as { from?: Date; to?: Date }) ?? {};
                setRange(next);
                onRangeChange?.(next);
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
