"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormModal } from "@/components/shared/form-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Expense, ExpenseCategory } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (data: Omit<Expense, "id">) => void;
  onUpdate: (expense: Expense) => void;
  editTarget: Expense | null;
}

interface ExpenseFormValues {
  category: ExpenseCategory;
  description: string;
  amount: number;
  paymentMethod: "cash" | "bkash" | "nagad" | "bank" | "card";
  date: string;
}

const CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: "rent", label: "Rent" },
  { value: "electricity", label: "Electricity" },
  { value: "salary", label: "Salary" },
  { value: "transport", label: "Transport" },
  { value: "maintenance", label: "Maintenance" },
  { value: "marketing", label: "Marketing" },
  { value: "packaging", label: "Packaging" },
  { value: "other", label: "Other" },
];

const METHODS: { value: ExpenseFormValues["paymentMethod"]; label: string }[] =
  [
    { value: "cash", label: "Cash" },
    { value: "bkash", label: "bKash" },
    { value: "nagad", label: "Nagad" },
    { value: "bank", label: "Bank Transfer" },
    { value: "card", label: "Card" },
  ];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function AddExpenseForm({
  open,
  onOpenChange,
  onAdd,
  onUpdate,
  editTarget,
}: Props) {
  const isEdit = !!editTarget;

  const initial: ExpenseFormValues = editTarget
    ? {
        category: editTarget.category,
        description: editTarget.description,
        amount: editTarget.amount,
        paymentMethod: editTarget.paymentMethod,
        date: editTarget.date,
      }
    : {
        category: "other",
        description: "",
        amount: 0,
        paymentMethod: "cash",
        date: todayISO(),
      };

  const form = useForm<ExpenseFormValues>({
    defaultValues: initial,
  });

  const [category, setCategory] = React.useState<ExpenseCategory>(
    initial.category
  );
  const [method, setMethod] = React.useState<
    ExpenseFormValues["paymentMethod"]
  >(initial.paymentMethod);

  const onSubmit = form.handleSubmit((values) => {
    const base: Omit<Expense, "id"> = {
      category: values.category,
      description: values.description.trim(),
      amount: Number(values.amount) || 0,
      paymentMethod: values.paymentMethod,
      date: values.date,
    };

    if (isEdit && editTarget) {
      onUpdate({ ...base, id: editTarget.id });
      toast.success("Expense updated", {
        description: `${base.description} · ${formatCurrency(base.amount)}`,
      });
    } else {
      onAdd(base);
      toast.success("Expense added", {
        description: `${base.description} · ${formatCurrency(base.amount)}`,
      });
    }
    onOpenChange(false);
  });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Expense" : "Add Expense"}
      description={
        isEdit ? "Update this expense record" : "Record a new business expense"
      }
      size="lg"
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
            {isEdit ? "Save Changes" : "Save Expense"}
          </Button>
        </>
      }
    >
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <Label className="mb-2 block text-sm">Description *</Label>
          <Textarea
            rows={2}
            className="text-base"
            {...form.register("description", { required: true })}
            placeholder="e.g. Shop rent for June"
          />
        </div>

        <div>
          <Label className="mb-2 block text-sm">Amount (৳) *</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            className="h-12 text-base"
            {...form.register("amount", {
              required: true,
              valueAsNumber: true,
            })}
            placeholder="0"
          />
        </div>

        <div>
          <Label className="mb-2 block text-sm">Date *</Label>
          <Input
            type="date"
            className="h-12 text-base"
            {...form.register("date", { required: true })}
          />
        </div>

        <div>
          <Label className="mb-2 block text-sm">Category *</Label>
          <Select
            value={category}
            onValueChange={(v) => {
              const val = String(v) as ExpenseCategory;
              setCategory(val);
              form.setValue("category", val);
            }}
          >
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="Select category">
                {CATEGORIES.find((c) => c.value === category)?.label ??
                  "Select category"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value} className="py-2.5">
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block text-sm">Payment Method *</Label>
          <Select
            value={method}
            onValueChange={(v) => {
              const val = String(v) as ExpenseFormValues["paymentMethod"];
              setMethod(val);
              form.setValue("paymentMethod", val);
            }}
          >
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="Select method">
                {METHODS.find((m) => m.value === method)?.label ??
                  "Select method"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {METHODS.map((m) => (
                <SelectItem key={m.value} value={m.value} className="py-2.5">
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </form>
    </FormModal>
  );
}