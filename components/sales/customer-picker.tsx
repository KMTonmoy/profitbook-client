"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search, UserPlus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Customer } from "@/lib/types";

interface Props {
  customers: Customer[];
  value: string;
  onChange: (customerId: string) => void;
  onNewCustomer: () => void;
}

export function CustomerPicker({
  customers,
  value,
  onChange,
  onNewCustomer,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const selected = customers.find((c) => c.id === value) ?? null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-12 w-full justify-between px-4 text-base font-normal"
          >
            {selected ? (
              <span className="flex min-w-0 items-center gap-2">
                <span className="truncate font-medium">{selected.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {selected.phone}
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground">Search customer…</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        }
      />
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-[var(--radix-popover-trigger-width)] min-w-[420px] p-0"
      >
        <Command
          filter={(value, search) => {
            // value is "name phone address"
            if (value.toLowerCase().includes(search.toLowerCase())) return 1;
            return 0;
          }}
        >
          <div className="flex items-center border-b px-2">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <CommandInput
              placeholder="Search by name, phone or address…"
              className="h-11 border-0"
            />
          </div>
          <CommandList className="max-h-[320px]">
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              No customer found.
            </CommandEmpty>
            <CommandGroup>
              {customers.map((c) => (
                <CommandItem
                  key={c.id}
                  value={`${c.name} ${c.phone} ${c.address ?? ""}`}
                  onSelect={() => {
                    onChange(c.id);
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 py-3"
                >
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      value === c.id ? "opacity-100 text-primary" : "opacity-0"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.phone}
                      {c.address ? ` · ${c.address}` : ""}
                    </p>
                  </div>
                  {c.totalDue > 0 && (
                    <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-medium text-destructive">
                      ৳ {c.totalDue.toLocaleString("en-IN")}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <div className="border-t p-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onNewCustomer();
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent"
            >
              <UserPlus className="h-4 w-4" />
              Add new customer
            </button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}