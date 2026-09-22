"use client";

import * as React from "react";
import {
  Plus,
  Trash2,
  UserPlus,
  Receipt,
  Package,
  ChevronDown,
  Check,
  CalendarClock,
} from "lucide-react";
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
import { CustomerPicker } from "@/components/sales/customer-picker";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Customer, Product, Sale, SaleItem } from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  customers: Customer[];
  products: Product[];
  onAddCustomer: (c: Customer) => void;
  onSave: (sale: Sale, updatedProducts: Product[]) => void;
  onUpdate?: (sale: Sale, updatedProducts: Product[]) => void;
  editTarget?: Sale | null;
}

interface CartLine {
  id: string;
  productId: string;
  quantity: number;
  sellingPrice: number;
  discount: number;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function datePlusDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function AddSaleForm({
  open,
  onOpenChange,
  customers,
  products,
  onAddCustomer,
  onSave,
  onUpdate,
  editTarget,
}: Props) {
  const isEdit = !!editTarget;

  const initialCustomerId = editTarget?.customerId ?? "";
  const initialLines: CartLine[] = editTarget
    ? editTarget.items.map((it) => ({
        id: it.id,
        productId: it.productId,
        quantity: it.quantity,
        sellingPrice: it.sellingPrice,
        discount: it.discount,
      }))
    : [];
  const initialDate = editTarget?.date ?? todayISO();
  const initialDueDate = editTarget?.dueDate ?? datePlusDays(15);
  const initialDiscount = editTarget?.discount ?? 0;
  const initialPaid = editTarget?.paid ?? 0;

  const [customerId, setCustomerId] = React.useState(initialCustomerId);
  const [showNewCustomer, setShowNewCustomer] = React.useState(false);
  const [newCustomer, setNewCustomer] = React.useState({
    name: "",
    phone: "",
    address: "",
  });
  const [lines, setLines] = React.useState<CartLine[]>(initialLines);
  const [saleDiscount, setSaleDiscount] = React.useState(initialDiscount);
  const [paid, setPaid] = React.useState(initialPaid);
  const [note, setNote] = React.useState("");
  const [date, setDate] = React.useState(initialDate);
  const [dueDate, setDueDate] = React.useState(initialDueDate);

  const addLine = () => {
    setLines((prev) => [
      ...prev,
      {
        id: `line-${crypto.randomUUID()}`,
        productId: "",
        quantity: 1,
        sellingPrice: 0,
        discount: 0,
      },
    ]);
  };

  const updateLine = (id: string, patch: Partial<CartLine>) => {
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...patch } : l))
    );
  };

  const removeLine = (id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  };

  const onProductChange = (lineId: string, productId: string) => {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    updateLine(lineId, {
      productId,
      sellingPrice: p.sellingPrice,
      quantity: 1,
    });
  };

  const lineSubtotal = (l: CartLine) =>
    Math.max(0, l.quantity * l.sellingPrice - l.discount);

  const subtotal = lines.reduce((s, l) => s + lineSubtotal(l), 0);
  const grandTotal = Math.max(0, subtotal - saleDiscount);
  const due = Math.max(0, grandTotal - paid);

  const estimatedProfit = lines.reduce((s, l) => {
    const p = products.find((x) => x.id === l.productId);
    if (!p) return s;
    return s + (l.sellingPrice - p.purchasePrice) * l.quantity - l.discount;
  }, 0);

  const stockAvailableForLine = (productId: string) => {
    const base = products.find((p) => p.id === productId)?.currentStock ?? 0;
    if (!isEdit || !editTarget) return base;
    const oldLine = editTarget.items.find((it) => it.productId === productId);
    return base + (oldLine?.quantity ?? 0);
  };

  const handleCreateCustomer = () => {
    if (!newCustomer.name.trim() || !newCustomer.phone.trim()) {
      toast.error("Name and phone are required");
      return;
    }
    const customer: Customer = {
      id: `cust-${crypto.randomUUID()}`,
      name: newCustomer.name.trim(),
      phone: newCustomer.phone.trim(),
      address: newCustomer.address.trim() || "—",
      totalPurchases: 0,
      totalPaid: 0,
      totalDue: 0,
      status: "active",
      createdAt: todayISO(),
    };
    onAddCustomer(customer);
    setCustomerId(customer.id);
    setShowNewCustomer(false);
    setNewCustomer({ name: "", phone: "", address: "" });
    toast.success("Customer added", { description: customer.name });
  };

  const validate = (): string | null => {
    if (!customerId) return "Select a customer";
    if (lines.length === 0) return "Add at least one product";
    for (const l of lines) {
      if (!l.productId) return "Choose a product for every line";
      if (l.quantity <= 0) return "Quantity must be at least 1";
      if (l.quantity > stockAvailableForLine(l.productId))
        return "Quantity exceeds available stock";
    }
    if (paid < 0) return "Paid amount cannot be negative";
    if (paid > grandTotal) return "Paid cannot exceed grand total";
    if (due > 0 && !dueDate) return "Select a due date";
    return null;
  };

  const handleSave = () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return;

    const items: SaleItem[] = lines.map((l) => {
      const p = products.find((x) => x.id === l.productId)!;
      return {
        id: l.id,
        productId: p.id,
        productName: p.name,
        quantity: l.quantity,
        sellingPrice: l.sellingPrice,
        purchasePrice: p.purchasePrice,
        discount: l.discount,
        subtotal: lineSubtotal(l),
        profit:
          (l.sellingPrice - p.purchasePrice) * l.quantity - l.discount,
      };
    });

    const status: Sale["status"] =
      due === 0 ? "paid" : paid === 0 ? "due" : "partial";

    const invoiceNumber =
      editTarget?.invoiceNumber ??
      `INV-${new Date().getFullYear().toString().slice(2)}-${String(
        Date.now()
      ).slice(-5)}`;

    const sale: Sale = {
      id: editTarget?.id ?? `sale-${crypto.randomUUID()}`,
      invoiceNumber,
      customerId: customer.id,
      customerName: customer.name,
      date,
      items,
      subtotal,
      discount: saleDiscount,
      total: grandTotal,
      paid,
      due,
      profit: estimatedProfit,
      status,
      dueDate: due > 0 ? dueDate : undefined,
    };

    const restored = products.map((p) => {
      if (!isEdit || !editTarget) return p;
      const oldLine = editTarget.items.find((it) => it.productId === p.id);
      if (!oldLine) return p;
      const nextStock = p.currentStock + oldLine.quantity;
      const status: Product["status"] =
        nextStock <= 0
          ? "out-of-stock"
          : nextStock <= 10
            ? "low-stock"
            : "in-stock";
      return { ...p, currentStock: nextStock, status };
    });

    const updatedProducts = restored.map((p) => {
      const line = lines.find((l) => l.productId === p.id);
      if (!line) return p;
      const nextStock = Math.max(0, p.currentStock - line.quantity);
      const status: Product["status"] =
        nextStock <= 0
          ? "out-of-stock"
          : nextStock <= 10
            ? "low-stock"
            : "in-stock";
      return { ...p, currentStock: nextStock, status };
    });

    if (isEdit && onUpdate) {
      onUpdate(sale, updatedProducts);
      toast.success("Sale updated", {
        description: `${invoiceNumber} · ${formatCurrency(grandTotal)}`,
      });
    } else {
      onSave(sale, updatedProducts);
      toast.success("Sale saved", {
        description: `${invoiceNumber} · ${formatCurrency(grandTotal)}`,
      });
    }
    onOpenChange(false);
  };

  const dueLabel = React.useMemo(() => {
    if (due <= 0 || !dueDate) return null;
    const today = new Date(todayISO());
    const target = new Date(dueDate);
    const diffDays = Math.round(
      (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays < 0)
      return {
        text: `Overdue by ${-diffDays} day${-diffDays === 1 ? "" : "s"}`,
        tone: "danger" as const,
      };
    if (diffDays === 0) return { text: "Due today", tone: "warning" as const };
    if (diffDays <= 7)
      return {
        text: `Due in ${diffDays} day${diffDays === 1 ? "" : "s"}`,
        tone: "warning" as const,
      };
    return { text: `Due in ${diffDays} days`, tone: "info" as const };
  }, [due, dueDate]);

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Sale" : "New Sale"}
      description={
        isEdit
          ? "Update invoice, payment, and print"
          : "Create an invoice, take payment, and print"
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
          <Button className="h-11 gap-2 px-6" size="lg" onClick={handleSave}>
            <Receipt className="h-4 w-4" />
            {isEdit ? "Save Changes" : "Save & Preview Invoice"}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-6">
          <section className="rounded-2xl border bg-card p-6">
            <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Customer
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 px-3"
                onClick={() => setShowNewCustomer(true)}
              >
                <UserPlus className="h-4 w-4" />
                New customer
              </Button>
            </header>

            {!showNewCustomer ? (
              <CustomerPicker
                customers={customers}
                value={customerId}
                onChange={setCustomerId}
                onNewCustomer={() => setShowNewCustomer(true)}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <Label className="mb-2 block text-sm">Name *</Label>
                  <Input
                    className="h-12 text-base"
                    value={newCustomer.name}
                    onChange={(e) =>
                      setNewCustomer((c) => ({ ...c, name: e.target.value }))
                    }
                    placeholder="Customer name"
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-sm">Phone *</Label>
                  <Input
                    className="h-12 text-base"
                    value={newCustomer.phone}
                    onChange={(e) =>
                      setNewCustomer((c) => ({ ...c, phone: e.target.value }))
                    }
                    placeholder="+8801XXXXXXXXX"
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-sm">Address</Label>
                  <Input
                    className="h-12 text-base"
                    value={newCustomer.address}
                    onChange={(e) =>
                      setNewCustomer((c) => ({
                        ...c,
                        address: e.target.value,
                      }))
                    }
                    placeholder="City / area"
                  />
                </div>
                <div className="sm:col-span-3 flex items-center gap-3">
                  <Button
                    type="button"
                    size="lg"
                    className="h-11 px-6"
                    onClick={handleCreateCustomer}
                  >
                    Create customer
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    className="h-11 px-4"
                    onClick={() => setShowNewCustomer(false)}
                  >
                    Pick existing instead
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label className="mb-2 block text-sm">Invoice date</Label>
                <Input
                  type="date"
                  className="h-12 text-base"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
          </section>

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

            {lines.length === 0 ? (
              <button
                type="button"
                onClick={addLine}
                className="flex w-full flex-col items-center justify-center gap-2 px-6 py-10 text-center transition-colors hover:bg-accent/30"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Plus className="h-5 w-5" />
                </span>
                <p className="text-sm text-muted-foreground">
                  No products yet.{" "}
                  <span className="font-medium text-primary">
                    Click to add your first product
                  </span>
                </p>
              </button>
            ) : (
              <div className="divide-y">
                {lines.map((l) => (
                  <ProductLineRow
                    key={l.id}
                    line={l}
                    products={products}
                    available={stockAvailableForLine(l.productId)}
                    onProductChange={(pid) => onProductChange(l.id, pid)}
                    onUpdate={(patch) => updateLine(l.id, patch)}
                    onRemove={() => removeLine(l.id)}
                    lineSubtotal={lineSubtotal(l)}
                  />
                ))}

                <button
                  type="button"
                  onClick={addLine}
                  className="flex w-full items-center justify-center gap-2 px-6 py-4 text-sm font-medium text-primary transition-colors hover:bg-accent/40"
                >
                  <Plus className="h-4 w-4" />
                  Add another product
                </button>
              </div>
            )}
          </section>

          <section className="rounded-2xl border bg-card p-6">
            <Label className="mb-2 block text-sm">Note (optional)</Label>
            <Textarea
              rows={3}
              className="text-base"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note for this sale…"
            />
          </section>
        </div>

        <aside className="h-fit rounded-2xl border bg-card p-6 xl:sticky xl:top-0">
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Bill Summary
          </h3>

          <div className="space-y-4 text-base">
            <SummaryRow label="Items" value={String(lines.length)} />
            <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Discount</span>
              <Input
                type="number"
                min="0"
                step="0.01"
                className="h-11 w-32 text-right text-base"
                value={saleDiscount}
                onChange={(e) => setSaleDiscount(Number(e.target.value) || 0)}
              />
            </div>

            <div className="flex items-center justify-between border-t pt-4 text-lg font-semibold">
              <span>Grand Total</span>
              <span className="tabular-nums">
                {formatCurrency(grandTotal)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Paid</span>
              <Input
                type="number"
                min="0"
                max={grandTotal}
                step="0.01"
                className="h-11 w-32 text-right text-base"
                value={paid}
                onChange={(e) =>
                  setPaid(
                    Math.max(
                      0,
                      Math.min(grandTotal, Number(e.target.value) || 0)
                    )
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

            {due > 0 && (
              <div className="rounded-xl border border-dashed bg-muted/30 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    When will they pay?
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "7 days", days: 7 },
                    { label: "15 days", days: 15 },
                    { label: "30 days", days: 30 },
                  ].map((p) => {
                    const target = datePlusDays(p.days);
                    const active = dueDate === target;
                    return (
                      <button
                        key={p.days}
                        type="button"
                        onClick={() => setDueDate(target)}
                        className={cn(
                          "h-9 rounded-md border text-xs font-medium transition-colors",
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3">
                  <Label className="mb-2 block text-xs text-muted-foreground">
                    Due date
                  </Label>
                  <Input
                    type="date"
                    className="h-11 text-base"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    min={date}
                  />
                </div>

                {dueLabel && (
                  <p
                    className={cn(
                      "mt-3 text-xs font-medium",
                      dueLabel.tone === "danger" && "text-destructive",
                      dueLabel.tone === "warning" &&
                        "text-[color-mix(in_oklab,var(--color-warning)_70%,black)]",
                      dueLabel.tone === "info" && "text-info"
                    )}
                  >
                    {dueLabel.text}
                  </p>
                )}
              </div>
            )}

            <div className="mt-2 rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
              Estimated profit:{" "}
              <span className="font-semibold text-success">
                {formatCurrency(estimatedProfit)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </FormModal>
  );
}

function ProductLineRow({
  line,
  products,
  available,
  onProductChange,
  onUpdate,
  onRemove,
  lineSubtotal,
}: {
  line: CartLine;
  products: Product[];
  available: number;
  onProductChange: (productId: string) => void;
  onUpdate: (patch: Partial<CartLine>) => void;
  onRemove: () => void;
  lineSubtotal: number;
}) {
  const [pickerOpen, setPickerOpen] = React.useState(!line.productId);
  const selected = products.find((p) => p.id === line.productId) ?? null;

  return (
    <div className="space-y-4 p-5">
      <div>
        <Label className="mb-2 block text-sm text-muted-foreground">
          Product
        </Label>

        {pickerOpen || !selected ? (
          <Select
            value={line.productId}
            onValueChange={(v) => {
              onProductChange(String(v));
              setPickerOpen(false);
            }}
            open={pickerOpen}
            onOpenChange={setPickerOpen}
          >
            <SelectTrigger className="h-14 w-full text-base">
              <SelectValue placeholder="Select product">
                {selected ? selected.name : "Select product"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent
              sideOffset={6}
              className="w-[var(--anchor-width)] max-h-[340px] p-1"
            >
              {products.map((p) => {
                const out = p.currentStock <= 0;
                return (
                  <SelectItem
                    key={p.id}
                    value={p.id}
                    disabled={out}
                    className="my-0.5 rounded-lg py-3 pl-3 pr-8"
                  >
                    <div className="flex w-full items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-medium leading-tight">
                          {p.name}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatCurrency(p.sellingPrice)} / {p.unit}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          out
                            ? "bg-destructive/10 text-destructive"
                            : p.currentStock <= 10
                              ? "bg-warning/15 text-warning-foreground"
                              : "bg-success/10 text-success"
                        }`}
                      >
                        {out ? "Out of stock" : `${p.currentStock} left`}
                      </span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        ) : (
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="group flex h-14 w-full items-center justify-between gap-3 rounded-lg border bg-accent/40 px-4 text-left transition-colors hover:bg-accent/70"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Package className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold leading-tight">
                  {selected.name}
                </p>
                <p className="mt-0.5 flex items-center gap-1 whitespace-nowrap text-xs text-muted-foreground">
                  <Check className="h-3 w-3 shrink-0 text-success" />
                  {available} in stock · {selected.unit}
                </p>
              </div>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary">
              Change <ChevronDown className="h-3.5 w-3.5" />
            </span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="w-24">
          <Label className="mb-2 block text-sm text-muted-foreground">
            Qty
          </Label>
          <Input
            type="number"
            min="1"
            max={available || undefined}
            className="h-12 text-base"
            value={line.quantity}
            onChange={(e) =>
              onUpdate({ quantity: Math.max(1, Number(e.target.value) || 1) })
            }
          />
        </div>

        <div className="w-32">
          <Label className="mb-2 block text-sm text-muted-foreground">
            Price
          </Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            className="h-12 text-base"
            value={line.sellingPrice}
            onChange={(e) =>
              onUpdate({ sellingPrice: Number(e.target.value) || 0 })
            }
          />
        </div>

        <div className="w-28">
          <Label className="mb-2 block text-sm text-muted-foreground">
            Disc.
          </Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            className="h-12 text-base"
            value={line.discount}
            onChange={(e) =>
              onUpdate({ discount: Number(e.target.value) || 0 })
            }
          />
        </div>

        <div className="min-w-[110px] flex-1">
          <Label className="mb-2 block text-sm text-muted-foreground">
            Total
          </Label>
          <div className="flex h-12 items-center justify-end rounded-md border bg-muted/40 px-4 text-base font-semibold tabular-nums">
            {formatCurrency(lineSubtotal)}
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-12 w-12 shrink-0 text-destructive"
          onClick={onRemove}
          aria-label="Remove product"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
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