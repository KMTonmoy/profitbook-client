"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormModal } from "@/components/shared/form-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { endpoints } from "@/lib/endpoints";
import { formatCurrency } from "@/lib/format";
import type { Due } from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  due: Due | null;
  onSaved: () => void;
}

interface FormValues {
  amount: number;
  method: "cash" | "bkash" | "nagad" | "bank" | "card";
  date: string;
  note?: string;
}

export function RecordPaymentModal({
  open,
  onOpenChange,
  due,
  onSaved,
}: Props) {
  const form = useForm<FormValues>({
    defaultValues: {
      amount: due?.due ?? 0,
      method: "cash",
      date: new Date().toISOString().slice(0, 10),
      note: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    if (!due) return;
    try {
      await endpoints.payments.create({
        customerId: due.customerId,
        saleId: due.saleId,
        invoiceNumber: due.invoiceNumber,
        amount: Number(values.amount),
        method: values.method,
        date: values.date,
        note: values.note?.trim() || undefined,
      });
      toast.success("Payment recorded", {
        description: `${formatCurrency(values.amount)} received`,
      });
      onSaved();
    } catch (err) {
      toast.error((err as Error).message);
    }
  });

  if (!due) return null;

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Record Payment"
      description={`Receive payment from ${due.customerName}`}
      size="md"
      footer={
        <>
          <Button
            variant="outline"
            className="h-11 px-6"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button className="h-11 px-6" onClick={onSubmit}>
            Save Payment
          </Button>
        </>
      }
    >
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
        <div className="rounded-xl border bg-muted/40 p-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Invoice</p>
              <p className="mt-0.5 font-medium">{due.invoiceNumber ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Outstanding Due</p>
              <p className="mt-0.5 font-medium text-destructive">
                {formatCurrency(due.due ?? 0)}
              </p>
            </div>
          </div>
        </div>

        <div>
          <Label className="mb-1.5 block text-xs font-medium">
            Payment Amount (৳)
          </Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            className="h-11"
            {...form.register("amount", { valueAsNumber: true })}
          />
        </div>

        <div>
          <Label className="mb-1.5 block text-xs font-medium">
            Payment Method
          </Label>
          <Select
            defaultValue="cash"
            onValueChange={(v) =>
              form.setValue("method", String(v) as FormValues["method"])
            }
          >
            <SelectTrigger className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="bkash">bKash</SelectItem>
              <SelectItem value="nagad">Nagad</SelectItem>
              <SelectItem value="bank">Bank Transfer</SelectItem>
              <SelectItem value="card">Card</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-1.5 block text-xs font-medium">Date</Label>
          <Input type="date" className="h-11" {...form.register("date")} />
        </div>

        <div>
          <Label className="mb-1.5 block text-xs font-medium">Note</Label>
          <Textarea
            rows={3}
            {...form.register("note")}
            placeholder="Optional note"
          />
        </div>
      </form>
    </FormModal>
  );
}
