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
import { categories, suppliers } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";

export interface AddProductFormValues {
  name: string;
  sku: string;
  categoryId: string;
  brand?: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  openingStock: number;
  minimumStock: number;
  supplierId?: string;
  description?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function AddProductForm({ open, onOpenChange }: Props) {
  const form = useForm<AddProductFormValues>({
    defaultValues: {
      unit: "pcs",
      purchasePrice: 0,
      sellingPrice: 0,
      openingStock: 0,
      minimumStock: 0,
    },
  });

  const purchase = Number(form.watch("purchasePrice")) || 0;
  const selling = Number(form.watch("sellingPrice")) || 0;
  const profit = selling - purchase;
  const margin = selling > 0 ? (profit / selling) * 100 : 0;

  const onSubmit = form.handleSubmit((values) => {
    toast.success("Product added", {
      description: `${values.name} has been added to your catalog.`,
    });
    onOpenChange(false);
    form.reset();
  });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add Product"
      description="Create a new product in your catalog"
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Save Product</Button>
        </>
      }
    >
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <Field label="Product Name" className="sm:col-span-2">
          <Input
            {...form.register("name", { required: true })}
            placeholder="e.g. Rice 25kg"
          />
        </Field>

        <Field label="SKU">
          <Input
            {...form.register("sku", { required: true })}
            placeholder="RC-25-001"
          />
        </Field>

        <Field label="Brand">
          <Input {...form.register("brand")} placeholder="Optional" />
        </Field>

        <Field label="Category">
          <Select
            onValueChange={(value) =>
              form.setValue("categoryId", String(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Unit">
          <Input {...form.register("unit")} placeholder="pcs / bag / kg" />
        </Field>

        <Field label="Purchase Price (৳)">
          <Input
            type="number"
            step="0.01"
            {...form.register("purchasePrice", { valueAsNumber: true })}
          />
        </Field>

        <Field label="Selling Price (৳)">
          <Input
            type="number"
            step="0.01"
            {...form.register("sellingPrice", { valueAsNumber: true })}
          />
        </Field>

        <Field label="Opening Stock">
          <Input
            type="number"
            {...form.register("openingStock", { valueAsNumber: true })}
          />
        </Field>

        <Field label="Minimum Stock">
          <Input
            type="number"
            {...form.register("minimumStock", { valueAsNumber: true })}
          />
        </Field>

        <Field label="Supplier">
          <Select
            onValueChange={(value) =>
              form.setValue("supplierId", String(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Description" className="sm:col-span-2">
          <Textarea
            rows={3}
            {...form.register("description")}
            placeholder="Optional notes"
          />
        </Field>

        <div className="sm:col-span-2 rounded-xl border bg-muted/40 p-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Profit per unit</p>
              <p
                className={`mt-1 text-lg font-semibold tabular-nums ${
                  profit >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {formatCurrency(profit)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Profit margin</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {margin.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </form>
    </FormModal>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-xs font-medium">{label}</Label>
      {children}
    </div>
  );
}
