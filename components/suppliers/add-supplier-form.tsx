"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormModal } from "@/components/shared/form-modal";
import type { Supplier } from "@/lib/types";

export interface SupplierFormValues {
  name: string;
  phone: string;
  address: string;
  email?: string;
  agentName?: string;
  agentPhone?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (data: Omit<Supplier, "id">) => void;
  onUpdate: (supplier: Supplier) => void;
  editTarget: Supplier | null;
}

export function AddSupplierForm({
  open,
  onOpenChange,
  onAdd,
  onUpdate,
  editTarget,
}: Props) {
  const isEdit = !!editTarget;

  const form = useForm<SupplierFormValues>({
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      email: "",
      agentName: "",
      agentPhone: "",
    },
  });

  React.useEffect(() => {
    if (!open) return;
    if (editTarget) {
      form.reset({
        name: editTarget.name,
        phone: editTarget.phone,
        address: editTarget.address,
        email: editTarget.email ?? "",
        agentName: editTarget.agentName ?? "",
        agentPhone: editTarget.agentPhone ?? "",
      });
    } else {
      form.reset({
        name: "",
        phone: "",
        address: "",
        email: "",
        agentName: "",
        agentPhone: "",
      });
    }
  }, [open, editTarget, form]);

  const onSubmit = form.handleSubmit((values) => {
    const base = {
      name: values.name.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
      email: values.email?.trim() || undefined,
      agentName: values.agentName?.trim() || undefined,
      agentPhone: values.agentPhone?.trim() || undefined,
    };

    if (isEdit && editTarget) {
      onUpdate({ ...base, id: editTarget.id });
      toast.success("Supplier updated", {
        description: `${base.name} has been updated.`,
      });
    } else {
      onAdd(base);
      toast.success("Supplier added", {
        description: `${base.name} has been added to your suppliers.`,
      });
    }
    onOpenChange(false);
  });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Supplier" : "Add Supplier"}
      description={
        isEdit
          ? "Update supplier details"
          : "Add a new company with optional agent info"
      }
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            {isEdit ? "Save Changes" : "Save Supplier"}
          </Button>
        </>
      }
    >
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <div className="sm:col-span-2 border-b pb-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Company Information
          </p>
        </div>

        <Field label="Company Name *" className="sm:col-span-2">
          <Input
            {...form.register("name", { required: true })}
            placeholder="e.g. Rahman Traders"
          />
        </Field>

        <Field label="Company Phone *">
          <Input
            {...form.register("phone", { required: true })}
            placeholder="+8801XXXXXXXXX"
          />
        </Field>

        <Field label="Company Email">
          <Input
            type="email"
            {...form.register("email")}
            placeholder="info@company.com"
          />
        </Field>

        <Field label="Company Address" className="sm:col-span-2">
          <Textarea
            rows={2}
            {...form.register("address")}
            placeholder="Street, area, city"
          />
        </Field>

        <div className="sm:col-span-2 border-b pb-2 pt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Agent Information{" "}
            <span className="normal-case font-normal text-muted-foreground/80">
              (optional)
            </span>
          </p>
        </div>

        <Field label="Agent Name">
          <Input
            {...form.register("agentName")}
            placeholder="Optional — e.g. Md. Karim"
          />
        </Field>

        <Field label="Agent Number">
          <Input
            {...form.register("agentPhone")}
            placeholder="Optional — +8801XXXXXXXXX"
          />
        </Field>
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
