"use client";

import { Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Sale } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { businessSettings } from "@/lib/mock-data";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  sales: Sale[];
}

export function ExportSalesDialog({ open, onOpenChange, sales }: Props) {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const totalSales = sales.reduce((s, x) => s + x.total, 0);
  const totalPaid = sales.reduce((s, x) => s + x.paid, 0);
  const totalDue = sales.reduce((s, x) => s + x.due, 0);
  const totalProfit = sales.reduce((s, x) => s + x.profit, 0);

  const handlePrint = () => {
    const w = window.open("", "_blank", "width=1100,height=850");
    if (!w) return;

    const rows = sales
      .map(
        (s, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(s.invoiceNumber)}</td>
        <td>${escapeHtml(s.customerName)}</td>
        <td>${formatDate(s.date)}</td>
        <td class="num">${s.items.length}</td>
        <td class="num">${formatCurrency(s.total)}</td>
        <td class="num">${formatCurrency(s.paid)}</td>
        <td class="num">${formatCurrency(s.due)}</td>
        <td class="num">${formatCurrency(s.profit)}</td>
        <td class="capitalize">${escapeHtml(s.status)}</td>
      </tr>`,
      )
      .join("");

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Sales Report — ${escapeHtml(businessSettings.businessName)}</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    color: #000; background: #fff;
    margin: 0 auto; padding: 16mm;
    width: 210mm; min-height: 297mm; font-size: 12px;
  }
  h1 { font-size: 20px; margin: 0 0 4px; }
  .meta { font-size: 11px; color: #444; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th, td { border: 1px solid #000; padding: 6px 8px; text-align: left; font-size: 11px; }
  th { font-weight: 600; text-transform: uppercase; letter-spacing: 0.02em; font-size: 10px; }
  td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
  tfoot td { font-weight: 600; background: #f5f5f5; }
  .footer { margin-top: 24px; border-top: 1px solid #999; padding-top: 10px; font-size: 10px; color: #555; text-align: center; }
  @media print { body { padding: 12mm; } @page { margin: 12mm; size: A4 portrait; } }
</style>
</head>
<body>
  <h1>${escapeHtml(businessSettings.businessName)}</h1>
  <div class="meta">
    Sales Report · ${sales.length} invoices · Generated on ${today}<br/>
    ${escapeHtml(businessSettings.address)} · ${escapeHtml(businessSettings.phone)}
  </div>
  <table>
    <thead>
      <tr>
        <th style="width:32px">#</th>
        <th>Invoice</th>
        <th>Customer</th>
        <th>Date</th>
        <th class="num">Items</th>
        <th class="num">Total</th>
        <th class="num">Paid</th>
        <th class="num">Due</th>
        <th class="num">Profit</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr>
        <td colspan="5" style="text-align:right">Totals</td>
        <td class="num">${formatCurrency(totalSales)}</td>
        <td class="num">${formatCurrency(totalPaid)}</td>
        <td class="num">${formatCurrency(totalDue)}</td>
        <td class="num">${formatCurrency(totalProfit)}</td>
        <td></td>
      </tr>
    </tfoot>
  </table>
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
          <DialogTitle>Export Sales</DialogTitle>
          <DialogDescription>
            A4 preview — print, save as PDF, or share with your accountant.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin bg-muted/50 px-4 py-6 sm:px-10 sm:py-10">
          <div className="mx-auto w-full max-w-[220mm] overflow-x-auto">
            <div
              id="sales-print"
              className="mx-auto bg-white text-black shadow-[0_2px_20px_rgba(0,0,0,0.08)]"
              style={{
                width: "210mm",
                minHeight: "297mm",
                padding: "16mm",
                fontSize: "12px",
                lineHeight: 1.5,
              }}
            >
              <header className="border-b-2 border-black pb-4">
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
                <p
                  className="mt-2 font-semibold uppercase tracking-wider text-neutral-600"
                  style={{ fontSize: "10px" }}
                >
                  Sales Report
                </p>
                <p className="text-neutral-600" style={{ fontSize: "11px" }}>
                  {sales.length} invoices · Generated on {today}
                </p>
              </header>

              <table
                className="mt-4 w-full border-collapse"
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
                      Invoice
                    </th>
                    <th
                      className="border border-black px-2 py-2 text-left font-semibold uppercase tracking-wide"
                      style={{ fontSize: "10px" }}
                    >
                      Customer
                    </th>
                    <th
                      className="border border-black px-2 py-2 text-left font-semibold uppercase tracking-wide"
                      style={{ fontSize: "10px" }}
                    >
                      Date
                    </th>
                    <th
                      className="border border-black px-2 py-2 text-right font-semibold uppercase tracking-wide"
                      style={{ fontSize: "10px" }}
                    >
                      Items
                    </th>
                    <th
                      className="border border-black px-2 py-2 text-right font-semibold uppercase tracking-wide"
                      style={{ fontSize: "10px" }}
                    >
                      Total
                    </th>
                    <th
                      className="border border-black px-2 py-2 text-right font-semibold uppercase tracking-wide"
                      style={{ fontSize: "10px" }}
                    >
                      Paid
                    </th>
                    <th
                      className="border border-black px-2 py-2 text-right font-semibold uppercase tracking-wide"
                      style={{ fontSize: "10px" }}
                    >
                      Due
                    </th>
                    <th
                      className="border border-black px-2 py-2 text-right font-semibold uppercase tracking-wide"
                      style={{ fontSize: "10px" }}
                    >
                      Profit
                    </th>
                    <th
                      className="border border-black px-2 py-2 text-left font-semibold uppercase tracking-wide"
                      style={{ fontSize: "10px" }}
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((s, i) => (
                    <tr key={s.id}>
                      <td className="border border-black px-2 py-2 tabular-nums">
                        {i + 1}
                      </td>
                      <td className="border border-black px-2 py-2 font-medium">
                        {s.invoiceNumber}
                      </td>
                      <td className="border border-black px-2 py-2">
                        {s.customerName}
                      </td>
                      <td className="border border-black px-2 py-2">
                        {formatDate(s.date)}
                      </td>
                      <td className="border border-black px-2 py-2 text-right tabular-nums">
                        {s.items.length}
                      </td>
                      <td className="border border-black px-2 py-2 text-right tabular-nums">
                        {formatCurrency(s.total)}
                      </td>
                      <td className="border border-black px-2 py-2 text-right tabular-nums">
                        {formatCurrency(s.paid)}
                      </td>
                      <td className="border border-black px-2 py-2 text-right tabular-nums">
                        {formatCurrency(s.due)}
                      </td>
                      <td className="border border-black px-2 py-2 text-right tabular-nums">
                        {formatCurrency(s.profit)}
                      </td>
                      <td className="border border-black px-2 py-2 capitalize">
                        {s.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colSpan={5}
                      className="border border-black px-2 py-2 text-right font-semibold"
                    >
                      Totals
                    </td>
                    <td className="border border-black px-2 py-2 text-right font-semibold tabular-nums">
                      {formatCurrency(totalSales)}
                    </td>
                    <td className="border border-black px-2 py-2 text-right font-semibold tabular-nums">
                      {formatCurrency(totalPaid)}
                    </td>
                    <td className="border border-black px-2 py-2 text-right font-semibold tabular-nums">
                      {formatCurrency(totalDue)}
                    </td>
                    <td className="border border-black px-2 py-2 text-right font-semibold tabular-nums">
                      {formatCurrency(totalProfit)}
                    </td>
                    <td className="border border-black px-2 py-2" />
                  </tr>
                </tfoot>
              </table>

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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button className="gap-1.5" onClick={handlePrint}>
            <Printer className="h-4 w-4" /> Print / Save as PDF
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
