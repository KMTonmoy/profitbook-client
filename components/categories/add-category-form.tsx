"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormModal } from "@/components/shared/form-modal";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (data: Omit<Category, "id">) => void;
  onUpdate: (category: Category) => void;
  editTarget: Category | null;
}

interface FormValues {
  name: string;
  color: string;
}

const PRESET_COLORS = [
  "#16a34a",
  "#2563eb",
  "#ca8a04",
  "#7c3aed",
  "#dc2626",
  "#0891b2",
  "#db2777",
  "#64748b",
];

export function AddCategoryForm({
  open,
  onOpenChange,
  onAdd,
  onUpdate,
  editTarget,
}: Props) {
  const isEdit = !!editTarget;

  const initial: FormValues = editTarget
    ? { name: editTarget.name, color: editTarget.color ?? PRESET_COLORS[0] }
    : { name: "", color: PRESET_COLORS[0] };

  const form = useForm<FormValues>({ defaultValues: initial });
  const [color, setColor] = React.useState(initial.color);

  const onSubmit = form.handleSubmit((values) => {
    const base = {
      name: values.name.trim(),
      color: values.color,
    };

    if (isEdit && editTarget) {
      onUpdate({ ...base, id: editTarget.id });
      toast.success("Category updated", {
        description: `${base.name} has been updated.`,
      });
    } else {
      onAdd(base);
      toast.success("Category added", {
        description: `${base.name} has been added.`,
      });
    }
    onOpenChange(false);
  });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Category" : "Add Category"}
      description={
        isEdit ? "Update category details" : "Create a new product category"
      }
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
            {isEdit ? "Save Changes" : "Save Category"}
          </Button>
        </>
      }
    >
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-5">
        <div>
          <Label className="mb-2 block text-sm">Category Name *</Label>
          <Input
            className="h-12 text-base"
            {...form.register("name", { required: true })}
            placeholder="e.g. Grocery"
          />
        </div>

        <div>
          <Label className="mb-2 block text-sm">Color</Label>
          <div className="flex flex-wrap items-center gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setColor(c);
                  form.setValue("color", c);
                }}
                className={cn(
                  "h-9 w-9 rounded-full border-2 transition-transform",
                  color === c
                    ? "scale-110 border-foreground"
                    : "border-transparent hover:scale-105",
                )}
                style={{ background: c }}
                aria-label={`Choose color ${c}`}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                form.setValue("color", e.target.value);
              }}
              className="h-9 w-14 cursor-pointer rounded-md border bg-transparent p-0.5"
              aria-label="Custom color"
            />
          </div>
          <input type="hidden" {...form.register("color")} />
        </div>

        <div className="rounded-xl border bg-muted/40 p-4">
          <p className="text-xs text-muted-foreground">Preview</p>
          <div className="mt-3 flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{
                background: `color-mix(in oklab, ${color} 15%, transparent)`,
              }}
            >
              <span
                className="h-4 w-4 rounded-full"
                style={{ background: color }}
              />
            </span>
            <span className="text-sm font-medium">
              {form.watch("name") || "Category name"}
            </span>
          </div>
        </div>
      </form>
    </FormModal>
  );
}
