"use client";

import { Printer, Download, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { StatusBadge } from "@/components/shared/status-badge";
import type { Sale } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { businessSettings } from "@/lib/mock-data";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  sale: Sale | null;
}

const demoItems = [
  { name: "Rice 25kg", qty: 2, price: 1850 },
  { name: "Soybean Oil 5L", qty: 1, price: 880 },
  { name: "Sugar 1kg", qty: 3, price: 135 },
];

export function InvoicePreview({ open, onOpenChange, sale }: Props) {
  if (!sale) return null;
  const items = sale.items.length
    ? sale.items.map((i) => ({
        name: i.productName,
        qty: i.quantity,
        price: i.sellingPrice,
      }))
    : demoItems;
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>Invoice Preview</DialogTitle>
          <DialogDescription>
            Print, download or share this invoice with your customer.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/40 p-4 sm:p-6">
          <div
            id="invoice-print"
            className="mx-auto max-w-2xl rounded-xl border bg-background p-6 shadow-sm sm:p-8"
          >
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-6">
              <div>
                <Logo size="md" />
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Invoice
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {sale.invoiceNumber}
                </p>
                <p className="text-xs text-muted-foreground">
                  Date: {formatDate(sale.date)}
                </p>
                <div className="mt-2 flex justify-end">
                  <StatusBadge status={sale.status} />
                </div>
              </div>
            </div>

            {/* Business + Customer */}
            <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  From
                </p>
                <p className="mt-2 text-sm font-semibold">
                  {businessSettings.businessName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {businessSettings.address}
                </p>
                <p className="text-xs text-muted-foreground">
                  {businessSettings.phone}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Bill To
                </p>
                <p className="mt-2 text-sm font-semibold">
                  {sale.customerName}
                </p>
                <p className="text-xs text-muted-foreground">
                  Customer ID: {sale.customerId}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-medium">Item</th>
                    <th className="px-4 py-2.5 text-center font-medium">Qty</th>
                    <th className="px-4 py-2.5 text-right font-medium">
                      Price
                    </th>
                    <th className="px-4 py-2.5 text-right font-medium">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((it, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2.5">{it.name}</td>
                      <td className="px-4 py-2.5 text-center tabular-nums">
                        {it.qty}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums">
                        {formatCurrency(it.price)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-medium tabular-nums">
                        {formatCurrency(it.qty * it.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-6 ml-auto max-w-xs space-y-2 text-sm">
              <Row label="Subtotal" value={formatCurrency(subtotal)} />
              <Row
                label="Discount"
                value={`- ${formatCurrency(sale.discount)}`}
              />
              <div className="flex items-center justify-between border-t pt-2 font-semibold">
                <span>Grand Total</span>
                <span className="tabular-nums">
                  {formatCurrency(sale.total)}
                </span>
              </div>
              <Row
                label="Paid"
                value={formatCurrency(sale.paid)}
                valueClass="text-success"
              />
              <Row
                label="Due"
                value={formatCurrency(sale.due)}
                valueClass={sale.due > 0 ? "text-destructive" : ""}
              />
            </div>

            <p className="mt-8 border-t pt-4 text-center text-xs text-muted-foreground">
              {businessSettings.invoiceFooter}
            </p>
          </div>
        </div>

        <div className="no-print flex flex-wrap items-center justify-end gap-2 border-t px-6 py-4">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button size="sm" className="gap-1.5">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`tabular-nums ${valueClass}`}>{value}</span>
    </div>
  );
}
