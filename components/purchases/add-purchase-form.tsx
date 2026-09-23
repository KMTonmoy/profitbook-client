"use client";

import * as React from "react";
import { Plus, Trash2, Truck, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { FormModal } from "@/components/shared/form-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/format";
import type { Supplier, Product } from "@/lib/types";
import type { Purchase, PurchaseLine } from "@/app/purchases/page";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  suppliers: Supplier[];
  products: Product[];
  onSave: (purchase: Purchase, newSupplier?: Supplier) => void;
  onUpdate: (purchase: Purchase) => void;
  editTarget: Purchase | null;
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

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function AddPurchaseForm({
  open,
  onOpenChange,
  suppliers,
  products,
  onSave,
  onUpdate,
  editTarget,
}: Props) {
  const isEdit = !!editTarget;

  const initialSupplierId = editTarget?.supplierId ?? "";
  const initialDate = editTarget?.date ?? todayISO();
  const initialLines: PurchaseLine[] = editTarget?.items ?? [
    {
      id: `line-${crypto.randomUUID()}`,
      productName: "",
      quantity: 1,
      unit: "pcs",
      unitPrice: 0,
    },
  ];
  const initialDiscount = editTarget?.discount ?? 0;
  const initialAdditional = editTarget?.additionalCost ?? 0;
  const initialPaid = editTarget?.paid ?? 0;

  const [supplierId, setSupplierId] = React.useState(initialSupplierId);
  const [showNewSupplier, setShowNewSupplier] = React.useState(false);
  const [newSupplier, setNewSupplier] = React.useState({
    name: "",
    phone: "",
    address: "",
    agentName: "",
    agentPhone: "",
  });

  const [date, setDate] = React.useState(initialDate);
  const [lines, setLines] = React.useState<PurchaseLine[]>(initialLines);
  const [discount, setDiscount] = React.useState(initialDiscount);
  const [additionalCost, setAdditionalCost] = React.useState(initialAdditional);
  const [paid, setPaid] = React.useState(initialPaid);

  const addLine = () => {
    setLines((prev) => [
      ...prev,
      {
        id: `line-${crypto.randomUUID()}`,
        productName: "",
        quantity: 1,
        unit: "pcs",
        unitPrice: 0,
      },
    ]);
  };

  const updateLine = (id: string, patch: Partial<PurchaseLine>) => {
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...patch } : l))
    );
  };

  const removeLine = (id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  };

  const lineTotal = (l: PurchaseLine) =>
    Math.max(0, l.quantity * l.unitPrice);

  const subtotal = lines.reduce((s, l) => s + lineTotal(l), 0);
  const total = Math.max(0, subtotal - discount + additionalCost);
  const due = Math.max(0, total - paid);

  const handleCreateSupplier = () => {
    if (!newSupplier.name.trim() || !newSupplier.phone.trim()) {
      toast.error("Supplier name and phone are required");
      return;
    }
    const supplier: Supplier = {
      id: `sup-${crypto.randomUUID()}`,
      name: newSupplier.name.trim(),
      phone: newSupplier.phone.trim(),
      address: newSupplier.address.trim() || "—",
      agentName: newSupplier.agentName.trim() || undefined,
      agentPhone: newSupplier.agentPhone.trim() || undefined,
    };
    onSave({} as Purchase, supplier);
    setSupplierId(supplier.id);
    setShowNewSupplier(false);
    setNewSupplier({
      name: "",
      phone: "",
      address: "",
      agentName: "",
      agentPhone: "",
    });
    toast.success("Supplier added", { description: supplier.name });
  };

  const validate = (): string | null => {
    if (!supplierId) return "Select a supplier";
    if (lines.length === 0) return "Add at least one product";
    for (const l of lines) {
      if (!l.productName.trim()) return "Every line needs a product name";
      if (l.quantity <= 0) return "Quantity must be at least 1";
      if (l.unitPrice < 0) return "Price cannot be negative";
    }
    if (paid < 0) return "Paid cannot be negative";
    if (paid > total) return "Paid cannot exceed total";
    return null;
  };

  const handleSave = () => {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    const supplier = suppliers.find((s) => s.id === supplierId);
    if (!supplier) return;

    const status: Purchase["status"] =
      due === 0 ? "paid" : paid === 0 ? "due" : "partial";

    const purchaseNumber =
      editTarget?.purchaseNumber ??
      `PUR-${new Date().getFullYear().toString().slice(2)}-${String(
        Date.now()
      ).slice(-5)}`;

    const purchase: Purchase = {
      id: editTarget?.id ?? `pur-${crypto.randomUUID()}`,
      purchaseNumber,
      supplierId: supplier.id,
      supplierName: supplier.name,
      agentName: supplier.agentName,
      agentPhone: supplier.agentPhone,
      date,
      items: lines.map((l) => ({
        ...l,
        productName: l.productName.trim(),
      })),
      subtotal,
      discount,
      additionalCost,
      total,
      paid,
      due,
      status,
    };

    if (isEdit) {
      onUpdate(purchase);
      toast.success("Purchase updated", {
        description: `${purchaseNumber} · ${formatCurrency(total)}`,
      });
    } else {
      onSave(purchase);
      toast.success("Purchase saved", {
        description: `${purchaseNumber} · ${formatCurrency(total)}`,
      });
    }
    onOpenChange(false);
  };

  const currentSupplier = suppliers.find((s) => s.id === supplierId);

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Purchase" : "New Purchase"}
      description={
        isEdit
          ? "Update supplier purchase details"
          : "Record a new supplier purchase"
      }
      size="wide"
      footer={
        <>
          <Button
            variant="outline"
            size="lg"
            className="h-11 px-6"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button className="h-11 px-6" size="lg" onClick={handleSave}>
            {isEdit ? "Save Changes" : "Save Purchase"}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-6">
          {/* Supplier */}
          <section className="rounded-2xl border bg-card p-6">
            <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Supplier
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 px-3"
                onClick={() => setShowNewSupplier(true)}
              >
                <UserPlus className="h-4 w-4" />
                New supplier
              </Button>
            </header>

            {!showNewSupplier ? (
              <>
                <Select
                  value={supplierId}
                  onValueChange={(v) => setSupplierId(String(v))}
                >
                  <SelectTrigger className="h-12 w-full text-base">
                    <SelectValue placeholder="Select supplier">
                      {currentSupplier
                        ? currentSupplier.name
                        : "Select supplier"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s) => (
                      <SelectItem key={s.id} value={s.id} className="py-3">
                        {s.name} · {s.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {currentSupplier && (
                  <div className="mt-4 rounded-xl border bg-muted/40 p-4 text-sm">
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Truck className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium">{currentSupplier.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {currentSupplier.phone}
                        </p>
                        {currentSupplier.address && (
                          <p className="text-xs text-muted-foreground">
                            {currentSupplier.address}
                          </p>
                        )}
                        {currentSupplier.agentName && (
                          <p className="mt-2 text-xs">
                            <span className="text-muted-foreground">
                              Agent:
                            </span>{" "}
                            <span className="font-medium">
                              {currentSupplier.agentName}
                            </span>
                            {currentSupplier.agentPhone && (
                              <span className="text-muted-foreground">
                                {" "}
                                · {currentSupplier.agentPhone}
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label className="mb-2 block text-sm">Company Name *</Label>
                  <Input
                    className="h-11"
                    value={newSupplier.name}
                    onChange={(e) =>
                      setNewSupplier((s) => ({ ...s, name: e.target.value }))
                    }
                    placeholder="e.g. Rahman Traders"
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-sm">Phone *</Label>
                  <Input
                    className="h-11"
                    value={newSupplier.phone}
                    onChange={(e) =>
                      setNewSupplier((s) => ({ ...s, phone: e.target.value }))
                    }
                    placeholder="+8801XXXXXXXXX"
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-sm">Address</Label>
                  <Input
                    className="h-11"
                    value={newSupplier.address}
                    onChange={(e) =>
                      setNewSupplier((s) => ({
                        ...s,
                        address: e.target.value,
                      }))
                    }
                    placeholder="City / area"
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-sm">
                    Agent Name (optional)
                  </Label>
                  <Input
                    className="h-11"
                    value={newSupplier.agentName}
                    onChange={(e) =>
                      setNewSupplier((s) => ({
                        ...s,
                        agentName: e.target.value,
                      }))
                    }
                    placeholder="e.g. Md. Karim"
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-sm">
                    Agent Number (optional)
                  </Label>
                  <Input
                    className="h-11"
                    value={newSupplier.agentPhone}
                    onChange={(e) =>
                      setNewSupplier((s) => ({
                        ...s,
                        agentPhone: e.target.value,
                      }))
                    }
                    placeholder="+8801XXXXXXXXX"
                  />
                </div>
                <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    className="h-11 px-6"
                    onClick={handleCreateSupplier}
                  >
                    Create supplier
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-11 px-4"
                    onClick={() => setShowNewSupplier(false)}
                  >
                    Pick existing instead
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label className="mb-2 block text-sm">Purchase date</Label>
                <Input
                  type="date"
                  className="h-11"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Line items */}
          <section className="rounded-2xl border bg-card">
            <header className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Products
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 px-3"
                onClick={addLine}
              >
                <Plus className="h-4 w-4" /> Add product
              </Button>
            </header>

            <div className="divide-y">
              {lines.map((l) => (
                <div key={l.id} className="space-y-4 p-5">
                  {/* Product name — full width */}
                  <div>
                    <Label className="mb-2 block text-xs text-muted-foreground">
                      Product name
                    </Label>
                    <Input
                      className="h-11"
                      value={l.productName}
                      onChange={(e) =>
                        updateLine(l.id, { productName: e.target.value })
                      }
                      placeholder="e.g. Rice 25kg"
                      list={`purchase-products-${l.id}`}
                    />
                    <datalist id={`purchase-products-${l.id}`}>
                      {products.map((p) => (
                        <option key={p.id} value={p.name} />
                      ))}
                    </datalist>
                  </div>

                  {/* Qty · Unit · Price — three equal columns */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="mb-2 block text-xs text-muted-foreground">
                        Qty
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        className="h-11"
                        value={l.quantity}
                        onChange={(e) =>
                          updateLine(l.id, {
                            quantity: Math.max(
                              1,
                              Number(e.target.value) || 1
                            ),
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block text-xs text-muted-foreground">
                        Unit
                      </Label>
                      <Select
                        value={l.unit}
                        onValueChange={(v) =>
                          updateLine(l.id, { unit: String(v) })
                        }
                      >
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue>
                            {UNITS.find((u) => u.value === l.unit)?.label ??
                              "Unit"}
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
                    </div>

                    <div>
                      <Label className="mb-2 block text-xs text-muted-foreground">
                        Price / unit
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        className="h-11"
                        value={l.unitPrice}
                        onChange={(e) =>
                          updateLine(l.id, {
                            unitPrice: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Line total + remove */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Line total:{" "}
                      <span className="ml-1 text-sm font-semibold tabular-nums text-foreground">
                        {formatCurrency(lineTotal(l))}
                      </span>
                    </span>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-9 gap-1.5 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeLine(l.id)}
                      aria-label="Remove product"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addLine}
                className="flex w-full items-center justify-center gap-2 px-6 py-4 text-sm font-medium text-primary transition-colors hover:bg-accent/40"
              >
                <Plus className="h-4 w-4" /> Add another product
              </button>
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-2xl border bg-card p-6 xl:sticky xl:top-0">
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Purchase Summary
          </h3>

          <div className="space-y-4 text-base">
            <SummaryRow label="Items" value={String(lines.length)} />
            <SummaryRow
              label="Total units"
              value={String(lines.reduce((s, l) => s + l.quantity, 0))}
            />
            <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Discount</span>
              <Input
                type="number"
                min="0"
                step="0.01"
                className="h-11 w-28 text-right text-base"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value) || 0)}
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Additional cost</span>
              <Input
                type="number"
                min="0"
                step="0.01"
                className="h-11 w-28 text-right text-base"
                value={additionalCost}
                onChange={(e) =>
                  setAdditionalCost(Number(e.target.value) || 0)
                }
              />
            </div>

            <div className="flex items-center justify-between border-t pt-4 text-lg font-semibold">
              <span>Grand Total</span>
              <span className="tabular-nums">{formatCurrency(total)}</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Paid</span>
              <Input
                type="number"
                min="0"
                max={total}
                step="0.01"
                className="h-11 w-28 text-right text-base"
                value={paid}
                onChange={(e) =>
                  setPaid(
                    Math.max(0, Math.min(total, Number(e.target.value) || 0))
                  )
                }
              />
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <span className="font-medium">Due</span>
              <span
                className={`text-2xl font-bold tabular-nums ${
                  due > 0 ? "text-destructive" : "text-success"
                }`}
              >
                {formatCurrency(due)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </FormModal>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}