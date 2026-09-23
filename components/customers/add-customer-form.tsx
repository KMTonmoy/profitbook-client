"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormModal } from "@/components/shared/form-modal";
import type { Customer } from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (data: Omit<Customer, "id">) => void;
  onUpdate: (customer: Customer) => void;
  editTarget: Customer | null;
}

interface FormValues {
  name: string;
  phone: string;
  address: string;
  email?: string;
  notes?: string;
}

export function AddCustomerForm({
  open,
  onOpenChange,
  onAdd,
  onUpdate,
  editTarget,
}: Props) {
  const isEdit = !!editTarget;

  const initial: FormValues = editTarget
    ? {
        name: editTarget.name,
        phone: editTarget.phone,
        address: editTarget.address ?? "",
        email: editTarget.email ?? "",
        notes: editTarget.notes ?? "",
      }
    : { name: "", phone: "", address: "", email: "", notes: "" };

  const form = useForm<FormValues>({ defaultValues: initial });

  const onSubmit = form.handleSubmit((values) => {
    const base = {
      name: values.name.trim(),
      phone: values.phone.trim(),
      address: values.address.trim() || "—",
      email: values.email?.trim() || undefined,
      notes: values.notes?.trim() || undefined,
    };

    if (isEdit && editTarget) {
      onUpdate({
        ...editTarget,
        ...base,
      });
      toast.success("Customer updated", { description: base.name });
    } else {
      onAdd({
        ...base,
        totalPurchases: 0,
        totalPaid: 0,
        totalDue: 0,
        status: "active",
        createdAt: new Date().toISOString().slice(0, 10),
      });
      toast.success("Customer added", { description: base.name });
    }
    onOpenChange(false);
  });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Customer" : "Add Customer"}
      description={
        isEdit ? "Update customer details" : "Create a new customer record"
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
            {isEdit ? "Save Changes" : "Save Customer"}
          </Button>
        </>
      }
    >
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <Label className="mb-2 block text-sm">Name *</Label>
          <Input
            className="h-11"
            {...form.register("name", { required: true })}
            placeholder="Customer name"
          />
        </div>

        <div>
          <Label className="mb-2 block text-sm">Phone *</Label>
          <Input
            className="h-11"
            {...form.register("phone", { required: true })}
            placeholder="+8801XXXXXXXXX"
          />
        </div>

        <div>
          <Label className="mb-2 block text-sm">Email</Label>
          <Input
            type="email"
            className="h-11"
            {...form.register("email")}
            placeholder="Optional"
          />
        </div>

        <div className="sm:col-span-2">
          <Label className="mb-2 block text-sm">Address</Label>
          <Input
            className="h-11"
            {...form.register("address")}
            placeholder="Street, area, city"
          />
        </div>

        <div className="sm:col-span-2">
          <Label className="mb-2 block text-sm">Notes</Label>
          <Textarea
            rows={3}
            {...form.register("notes")}
            placeholder="Optional notes"
          />
        </div>
      </form>
    </FormModal>
  );
}
