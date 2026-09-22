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
import { StatusBadge } from "@/components/shared/status-badge";
import type { Sale, Customer } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { businessSettings } from "@/lib/mock-data";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  sale: Sale | null;
  customer?: Customer | null;
}

export function InvoicePreview({ open, onOpenChange, sale, customer }: Props) {
  if (!sale) return null;
  const items = sale.items;

  const handlePrint = () => {
    const w = window.open("", "_blank", "width=1100,height=850");
    if (!w) return;

    const rows = items
      .map(
        (it, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(it.productName)}</td>
        <td class="num">${it.quantity}</td>
        <td class="num">${formatCurrency(it.sellingPrice)}</td>
        <td class="num">${formatCurrency(it.discount)}</td>
        <td class="num">${formatCurrency(it.subtotal)}</td>
      </tr>`
      )
      .join("");

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${escapeHtml(sale.invoiceNumber)}</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    color: #000; background: #fff;
    margin: 0 auto; padding: 16mm;
    width: 210mm; min-height: 297mm; font-size: 12px;
  }
  h1 { font-size: 20px; margin: 0; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000; padding-bottom: 12px; }
  .muted { color: #555; font-size: 11px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 16px 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th, td { border: 1px solid #000; padding: 6px 8px; text-align: left; font-size: 11px; }
  th { font-weight: 600; text-transform: uppercase; letter-spacing: 0.02em; }
  td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
  .totals { margin-left: auto; width: 280px; margin-top: 16px; }
  .totals .row { display: flex; justify-content: space-between; padding: 4px 0; }
  .totals .big { border-top: 2px solid #000; margin-top: 6px; padding-top: 8px; font-size: 14px; font-weight: 600; }
  .footer { margin-top: 24px; border-top: 1px solid #999; padding-top: 10px; font-size: 10px; color: #555; text-align: center; }
  @media print { body { padding: 12mm; } @page { margin: 12mm; size: A4 portrait; } }
</style>
</head>
<body>
  <div class="header">
    <div>
      <h1>${escapeHtml(businessSettings.businessName)}</h1>
      <div class="muted">${escapeHtml(businessSettings.address)}</div>
      <div class="muted">${escapeHtml(businessSettings.phone)}</div>
    </div>
    <div style="text-align:right">
      <div class="muted">INVOICE</div>
      <div style="font-size:16px;font-weight:600">${escapeHtml(sale.invoiceNumber)}</div>
      <div class="muted">Date: ${formatDate(sale.date)}</div>
    </div>
  </div>

  <div class="grid">
    <div>
      <div class="muted" style="text-transform:uppercase;letter-spacing:0.05em">Bill To</div>
      <div style="font-size:14px;font-weight:600;margin-top:6px">${escapeHtml(sale.customerName)}</div>
      ${customer?.phone ? `<div class="muted">${escapeHtml(customer.phone)}</div>` : ""}
      ${customer?.address ? `<div class="muted">${escapeHtml(customer.address)}</div>` : ""}
    </div>
    <div style="text-align:right">
      <div class="muted">Payment status</div>
      <div style="font-weight:600;margin-top:4px;text-transform:capitalize">${sale.status}</div>
      ${sale.dueDate ? `<div class="muted">Due: ${formatDate(sale.dueDate)}</div>` : ""}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:32px">#</th>
        <th>Product</th>
        <th class="num">Qty</th>
        <th class="num">Unit Price</th>
        <th class="num">Discount</th>
        <th class="num">Subtotal</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="totals">
    <div class="row"><span class="muted">Subtotal</span><span>${formatCurrency(sale.subtotal)}</span></div>
    <div class="row"><span class="muted">Discount</span><span>- ${formatCurrency(sale.discount)}</span></div>
    <div class="row big"><span>Grand Total</span><span>${formatCurrency(sale.total)}</span></div>
    <div class="row"><span class="muted">Paid</span><span>${formatCurrency(sale.paid)}</span></div>
    <div class="row"><span class="muted">Due</span><span>${formatCurrency(sale.due)}</span></div>
  </div>

  <div class="footer">${escapeHtml(businessSettings.invoiceFooter)}</div>
  <script>window.onload = function(){ window.print(); };</script>
</body>
</html>`;
    w.document.write(html);
    w.document.close();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[94vh] w-[95vw] max-w-[1240px] flex-col gap-0 overflow-hidden p-0 sm:max-w-[1240px]">
        <DialogHeader className="shrink-0 border-b bg-background px-6 py-4">
          <DialogTitle>Invoice Preview</DialogTitle>
          <DialogDescription>
            A4 preview — print, download or share this invoice with your
            customer.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin bg-muted/50 px-4 py-6 sm:px-10 sm:py-10">
          <div className="mx-auto w-full max-w-[220mm] overflow-x-auto">
            <div
              id="invoice-print"
              className="mx-auto bg-white text-black shadow-[0_2px_20px_rgba(0,0,0,0.08)]"
              style={{
                width: "210mm",
                minHeight: "297mm",
                padding: "16mm",
                fontSize: "12px",
                lineHeight: 1.5,
              }}
            >
              <header className="flex items-start justify-between border-b-2 border-black pb-4">
                <div>
                  <h1
                    className="font-semibold"
                    style={{ fontSize: "20px", lineHeight: 1.2 }}
                  >
                    {businessSettings.businessName}
                  </h1>
                  <p
                    className="mt-1 text-neutral-600"
                    style={{ fontSize: "11px" }}
                  >
                    {businessSettings.address}
                  </p>
                  <p className="text-neutral-600" style={{ fontSize: "11px" }}>
                    {businessSettings.phone}
                  </p>
                  {businessSettings.email && (
                    <p
                      className="text-neutral-600"
                      style={{ fontSize: "11px" }}
                    >
                      {businessSettings.email}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p
                    className="uppercase tracking-widest text-neutral-600"
                    style={{ fontSize: "10px" }}
                  >
                    Invoice
                  </p>
                  <p
                    className="font-semibold"
                    style={{ fontSize: "16px", lineHeight: 1.2 }}
                  >
                    {sale.invoiceNumber}
                  </p>
                  <p
                    className="mt-1 text-neutral-600"
                    style={{ fontSize: "11px" }}
                  >
                    Date: {formatDate(sale.date)}
                  </p>
                  <p
                    className="mt-1 font-semibold capitalize"
                    style={{ fontSize: "11px" }}
                  >
                    Status: {sale.status}
                  </p>
                  {sale.dueDate && sale.due > 0 && (
                    <p
                      className="text-neutral-600"
                      style={{ fontSize: "11px" }}
                    >
                      Due Date: {formatDate(sale.dueDate)}
                    </p>
                  )}
                </div>
              </header>

              <section
                className="grid grid-cols-2 gap-6"
                style={{ paddingTop: "16px", paddingBottom: "16px" }}
              >
                <div>
                  <p
                    className="font-semibold uppercase tracking-wider text-neutral-600"
                    style={{ fontSize: "10px" }}
                  >
                    Bill To
                  </p>
                  <p
                    className="mt-2 font-semibold"
                    style={{ fontSize: "14px" }}
                  >
                    {sale.customerName}
                  </p>
                  {customer?.phone && (
                    <p
                      className="text-neutral-600"
                      style={{ fontSize: "11px" }}
                    >
                      {customer.phone}
                    </p>
                  )}
                  {customer?.address && (
                    <p
                      className="text-neutral-600"
                      style={{ fontSize: "11px" }}
                    >
                      {customer.address}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p
                    className="font-semibold uppercase tracking-wider text-neutral-600"
                    style={{ fontSize: "10px" }}
                  >
                    Payment
                  </p>
                  <div className="mt-2 flex justify-end">
                    <StatusBadge status={sale.status} />
                  </div>
                  {sale.due > 0 && sale.dueDate && (
                    <p
                      className="mt-2 text-neutral-600"
                      style={{ fontSize: "11px" }}
                    >
                      Please pay by {formatDate(sale.dueDate)}
                    </p>
                  )}
                </div>
              </section>

              <table
                className="w-full border-collapse"
                style={{ fontSize: "11px" }}
              >
                <thead>
                  <tr>
                    <th
                      className="border border-black px-2 py-2 text-left font-semibold uppercase tracking-wide"
                      style={{ width: "32px", fontSize: "10px" }}
                    >
                      #
                    </th>
                    <th
                      className="border border-black px-2 py-2 text-left font-semibold uppercase tracking-wide"
                      style={{ fontSize: "10px" }}
                    >
                      Product
                    </th>
                    <th
                      className="border border-black px-2 py-2 text-center font-semibold uppercase tracking-wide"
                      style={{ fontSize: "10px" }}
                    >
                      Qty
                    </th>
                    <th
                      className="border border-black px-2 py-2 text-right font-semibold uppercase tracking-wide"
                      style={{ fontSize: "10px" }}
                    >
                      Unit Price
                    </th>
                    <th
                      className="border border-black px-2 py-2 text-right font-semibold uppercase tracking-wide"
                      style={{ fontSize: "10px" }}
                    >
                      Discount
                    </th>
                    <th
                      className="border border-black px-2 py-2 text-right font-semibold uppercase tracking-wide"
                      style={{ fontSize: "10px" }}
                    >
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, i) => (
                    <tr key={it.id}>
                      <td className="border border-black px-2 py-2 tabular-nums">
                        {i + 1}
                      </td>
                      <td className="border border-black px-2 py-2">
                        {it.productName}
                      </td>
                      <td className="border border-black px-2 py-2 text-center tabular-nums">
                        {it.quantity}
                      </td>
                      <td className="border border-black px-2 py-2 text-right tabular-nums">
                        {formatCurrency(it.sellingPrice)}
                      </td>
                      <td className="border border-black px-2 py-2 text-right tabular-nums">
                        {it.discount > 0 ? formatCurrency(it.discount) : "—"}
                      </td>
                      <td className="border border-black px-2 py-2 text-right font-medium tabular-nums">
                        {formatCurrency(it.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <section
                className="ml-auto"
                style={{ width: "280px", marginTop: "16px" }}
              >
                <div
                  className="flex items-center justify-between"
                  style={{ padding: "4px 0" }}
                >
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="tabular-nums">
                    {formatCurrency(sale.subtotal)}
                  </span>
                </div>
                <div
                  className="flex items-center justify-between"
                  style={{ padding: "4px 0" }}
                >
                  <span className="text-neutral-600">Discount</span>
                  <span className="tabular-nums">
                    - {formatCurrency(sale.discount)}
                  </span>
                </div>
                <div
                  className="mt-2 flex items-center justify-between border-t-2 border-black pt-3 font-semibold"
                  style={{ fontSize: "14px" }}
                >
                  <span>Grand Total</span>
                  <span className="tabular-nums">
                    {formatCurrency(sale.total)}
                  </span>
                </div>
                <div
                  className="flex items-center justify-between"
                  style={{ padding: "4px 0", marginTop: "6px" }}
                >
                  <span className="text-neutral-600">Paid</span>
                  <span className="tabular-nums">
                    {formatCurrency(sale.paid)}
                  </span>
                </div>
                <div
                  className="flex items-center justify-between border-t border-neutral-400 pt-2 font-semibold"
                  style={{ marginTop: "4px" }}
                >
                  <span>Due</span>
                  <span className="tabular-nums">
                    {formatCurrency(sale.due)}
                  </span>
                </div>
              </section>

              <footer
                className="border-t border-neutral-400 text-center text-neutral-600"
                style={{
                  marginTop: "24px",
                  paddingTop: "10px",
                  fontSize: "10px",
                }}
              >
                {businessSettings.invoiceFooter}
              </footer>
            </div>
          </div>
        </div>

        <div className="no-print flex shrink-0 flex-wrap items-center justify-end gap-2 border-t bg-background px-6 py-4">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button size="sm" className="gap-1.5" onClick={handlePrint}>
            <Download className="h-4 w-4" /> Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}