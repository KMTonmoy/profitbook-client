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
import { formatCurrency } from "@/lib/format";
import type { Product, StockStatus, Category, Supplier } from "@/lib/types";

interface FormValues {
  name: string;
  sku: string;
  categoryId: string;
  brand?: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  currentStock: number;
  minimumStock: number;
  supplierId?: string;
  description?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (product: Product) => void;
  onUpdate: (product: Product) => void;
  editTarget: Product | null;
  categories: Category[];
  suppliers: Supplier[];
}

const UNITS = [
  { value: "pcs", label: "Pieces (pcs)" },
  { value: "bag", label: "Bag" },
  { value: "kg", label: "Kilogram (kg)" },
  { value: "gram", label: "Gram (g)" },
  { value: "bottle", label: "Bottle" },
  { value: "liter", label: "Liter (L)" },
  { value: "ml", label: "Milliliter (ml)" },
  { value: "pack", label: "Pack" },
  { value: "box", label: "Box" },
  { value: "carton", label: "Carton" },
  { value: "dozen", label: "Dozen" },
  { value: "packet", label: "Packet" },
  { value: "meter", label: "Meter (m)" },
  { value: "roll", label: "Roll" },
];

function deriveStatus(stock: number, minimum: number): StockStatus {
  if (stock <= 0) return "out-of-stock";
  if (stock <= minimum) return "low-stock";
  return "in-stock";
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function AddProductForm({
  open,
  onOpenChange,
  onAdd,
  onUpdate,
  editTarget,
  categories,
  suppliers,
}: Props) {
  const isEdit = !!editTarget;

  const initial: FormValues = editTarget
    ? {
        name: editTarget.name,
        sku: editTarget.sku,
        categoryId: editTarget.categoryId,
        brand: editTarget.brand ?? "",
        unit: editTarget.unit,
        purchasePrice: editTarget.purchasePrice,
        sellingPrice: editTarget.sellingPrice,
        currentStock: editTarget.currentStock,
        minimumStock: editTarget.minimumStock,
        supplierId: editTarget.supplierId ?? "",
        description: editTarget.description ?? "",
      }
    : {
        name: "",
        sku: "",
        categoryId: "",
        brand: "",
        unit: "pcs",
        purchasePrice: 0,
        sellingPrice: 0,
        currentStock: 0,
        minimumStock: 10,
        supplierId: "",
        description: "",
      };

  const form = useForm<FormValues>({ defaultValues: initial });

  const [categoryId, setCategoryId] = React.useState(initial.categoryId);
  const [supplierId, setSupplierId] = React.useState(initial.supplierId ?? "");
  const [unit, setUnit] = React.useState(initial.unit);

  const purchase = Number(form.watch("purchasePrice")) || 0;
  const selling = Number(form.watch("sellingPrice")) || 0;
  const profit = selling - purchase;
  const margin = selling > 0 ? (profit / selling) * 100 : 0;

  const onSubmit = form.handleSubmit((values) => {
    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }

    const stock = Number(values.currentStock) || 0;
    const minimum = Number(values.minimumStock) || 10;

    const product: Product = {
      id: editTarget?.id ?? "",
      name: values.name.trim(),
      sku: values.sku.trim(),
      categoryId,
      brand: values.brand?.trim() || undefined,
      unit,
      purchasePrice: Number(values.purchasePrice) || 0,
      sellingPrice: Number(values.sellingPrice) || 0,
      openingStock: editTarget?.openingStock ?? stock,
      currentStock: stock,
      minimumStock: minimum,
      supplierId: supplierId || undefined,
      description: values.description?.trim() || undefined,
      imageUrl: editTarget?.imageUrl,
      status: deriveStatus(stock, minimum),
      createdAt: editTarget?.createdAt ?? todayISO(),
    };

    if (isEdit) {
      onUpdate(product);
      toast.success("Product updated", { description: product.name });
    } else {
      onAdd(product);
      toast.success("Product added", { description: product.name });
    }
    onOpenChange(false);
  });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Product" : "Add Product"}
      description={
        isEdit
          ? "Update this product's details"
          : "Create a new product in your catalog"
      }
      size="xl"
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
            {isEdit ? "Save Changes" : "Save Product"}
          </Button>
        </>
      }
    >
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <Field label="Product Name *" className="sm:col-span-2">
          <Input
            {...form.register("name", { required: true })}
            placeholder="e.g. Rice 25kg"
          />
        </Field>

        <Field label="SKU *">
          <Input
            {...form.register("sku", { required: true })}
            placeholder="RC-25-001"
          />
        </Field>

        <Field label="Brand">
          <Input {...form.register("brand")} placeholder="Optional" />
        </Field>

        <Field label="Category *">
          <Select
            value={categoryId}
            onValueChange={(value) => setCategoryId(String(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category">
                {categoryId
                  ? categories.find((c) => c.id === categoryId)?.name
                  : "Select category"}
              </SelectValue>
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

        <Field label="Unit *">
          <Select
            value={unit}
            onValueChange={(value) => setUnit(String(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select unit">
                {UNITS.find((u) => u.value === unit)?.label ?? "Select unit"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {UNITS.map((u) => (
                <SelectItem key={u.value} value={u.value}>
                  {u.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Purchase Price (৳) *">
          <Input
            type="number"
            step="0.01"
            min="0"
            {...form.register("purchasePrice", {
              required: true,
              valueAsNumber: true,
            })}
          />
        </Field>

        <Field label="Selling Price (৳) *">
          <Input
            type="number"
            step="0.01"
            min="0"
            {...form.register("sellingPrice", {
              required: true,
              valueAsNumber: true,
            })}
          />
        </Field>

        <Field label="Current Stock *">
          <Input
            type="number"
            min="0"
            placeholder="e.g. 400"
            {...form.register("currentStock", {
              required: true,
              valueAsNumber: true,
            })}
          />
        </Field>

        <Field label="Minimum Stock">
          <Input
            type="number"
            min="0"
            placeholder="e.g. 10"
            {...form.register("minimumStock", { valueAsNumber: true })}
          />
        </Field>

        <Field label="Supplier" className="sm:col-span-2">
          <Select
            value={supplierId}
            onValueChange={(value) => setSupplierId(String(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select supplier">
                {supplierId
                  ? suppliers.find((s) => s.id === supplierId)?.name
                  : "Select supplier"}
              </SelectValue>
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
