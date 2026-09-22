"use client";

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
import type { Due } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  due: Due | null;
}

export function RecordPaymentModal({ open, onOpenChange, due }: Props) {
  const form = useForm<{
    amount: number;
    method: string;
    date: string;
    note?: string;
  }>({
    defaultValues: { amount: due?.due ?? 0, method: "cash" },
  });

  const onSubmit = form.handleSubmit((v) => {
    toast.success("Payment recorded", {
      description: `${formatCurrency(v.amount)} received from ${due?.customerName}.`,
    });
    onOpenChange(false);
    form.reset();
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Save Payment</Button>
        </>
      }
    >
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
        <div className="rounded-xl border bg-muted/40 p-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Info label="Invoice" value={due.invoiceNumber} />
            <Info label="Outstanding Due" value={formatCurrency(due.due)} />
          </div>
        </div>

        <Field label="Payment Amount (৳)">
          <Input
            type="number"
            step="0.01"
            {...form.register("amount", { valueAsNumber: true })}
          />
        </Field>

        <Field label="Payment Method">
          <Select
            onValueChange={(value) => {
              if (value) form.setValue("method", value);
            }}
            defaultValue="cash"
          >
            <SelectTrigger>
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
        </Field>

        <Field label="Date">
          <Input type="date" {...form.register("date")} />
        </Field>

        <Field label="Note">
          <Textarea
            rows={3}
            {...form.register("note")}
            placeholder="Optional note"
          />
        </Field>
      </form>
    </FormModal>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs font-medium">{label}</Label>
      {children}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium">{value}</p>
    </div>
  );
}
