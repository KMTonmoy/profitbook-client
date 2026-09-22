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
import type { Expense } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { businessSettings } from "@/lib/mock-data";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  expenses: Expense[];
}

export function ExportExpensesDialog({ open, onOpenChange, expenses }: Props) {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});

  const handlePrint = () => {
    const w = window.open("", "_blank", "width=1100,height=850");
    if (!w) return;

    const rows = expenses
      .map(
        (e, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${formatDate(e.date)}</td>
        <td class="capitalize">${escapeHtml(e.category)}</td>
        <td>${escapeHtml(e.description)}</td>
        <td class="capitalize">${escapeHtml(e.paymentMethod)}</td>
        <td class="num">${formatCurrency(e.amount)}</td>
      </tr>`,
      )
      .join("");

    const catRows = Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])
      .map(
        ([cat, amt]) => `
      <tr>
        <td class="capitalize">${escapeHtml(cat)}</td>
        <td class="num">${formatCurrency(amt)}</td>
      </tr>`,
      )
      .join("");

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Expenses Report — ${escapeHtml(businessSettings.businessName)}</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    color: #000; background: #fff;
    margin: 0 auto; padding: 16mm;
    width: 210mm; min-height: 297mm; font-size: 12px;
  }
  h1 { font-size: 20px; margin: 0 0 4px; }
  h2 { font-size: 14px; margin: 24px 0 8px; border-bottom: 1px solid #000; padding-bottom: 4px; }
  .meta { font-size: 11px; color: #444; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th, td { border: 1px solid #000; padding: 6px 8px; text-align: left; font-size: 11px; }
  th { font-weight: 600; text-transform: uppercase; letter-spacing: 0.02em; font-size: 10px; }
  td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
  tfoot td { font-weight: 600; background: #f5f5f5; }
  .footer { margin-top: 24px; border-top: 1px solid #999; padding-top: 10px; font-size: 10px; color: #555; text-align: center; }
  .summary { width: 60%; margin-left: auto; }
  @media print { body { padding: 12mm; } @page { margin: 12mm; size: A4 portrait; } }
</style>
</head>
<body>
  <h1>${escapeHtml(businessSettings.businessName)}</h1>
  <div class="meta">
    Expense Report · ${expenses.length} entries · Generated on ${today}<br/>
    ${escapeHtml(businessSettings.address)} · ${escapeHtml(businessSettings.phone)}
  </div>
  <table>
    <thead>
      <tr>
        <th style="width:32px">#</th>
        <th>Date</th>
        <th>Category</th>
        <th>Description</th>
        <th>Method</th>
        <th class="num">Amount</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr>
        <td colspan="5" style="text-align:right">Total Expenses</td>
        <td class="num">${formatCurrency(total)}</td>
      </tr>
    </tfoot>
  </table>

  <h2>Summary by Category</h2>
  <table class="summary">
    <thead>
      <tr>
        <th>Category</th>
        <th class="num">Amount</th>
      </tr>
    </thead>
    <tbody>${catRows}</tbody>
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
          <DialogTitle>Export Expenses</DialogTitle>
          <DialogDescription>
            A4 preview — print or save as PDF with a full breakdown.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin bg-muted/50 px-4 py-6 sm:px-10 sm:py-10">
          <div className="mx-auto w-full max-w-[220mm] overflow-x-auto">
            <div
              id="expenses-print"
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
                  Expense Report
                </p>
                <p className="text-neutral-600" style={{ fontSize: "11px" }}>
                  {expenses.length} entries · Generated on {today}
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
                      Date
                    </th>
                    <th
                      className="border border-black px-2 py-2 text-left font-semibold uppercase tracking-wide"
                      style={{ fontSize: "10px" }}
                    >
                      Category
                    </th>
                    <th
                      className="border border-black px-2 py-2 text-left font-semibold uppercase tracking-wide"
                      style={{ fontSize: "10px" }}
                    >
                      Description
                    </th>
                    <th
                      className="border border-black px-2 py-2 text-left font-semibold uppercase tracking-wide"
                      style={{ fontSize: "10px" }}
                    >
                      Method
                    </th>
                    <th
                      className="border border-black px-2 py-2 text-right font-semibold uppercase tracking-wide"
                      style={{ fontSize: "10px" }}
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((e, i) => (
                    <tr key={e.id}>
                      <td className="border border-black px-2 py-2 tabular-nums">
                        {i + 1}
                      </td>
                      <td className="border border-black px-2 py-2">
                        {formatDate(e.date)}
                      </td>
                      <td className="border border-black px-2 py-2 capitalize">
                        {e.category}
                      </td>
                      <td className="border border-black px-2 py-2">
                        {e.description}
                      </td>
                      <td className="border border-black px-2 py-2 capitalize">
                        {e.paymentMethod}
                      </td>
                      <td className="border border-black px-2 py-2 text-right tabular-nums">
                        {formatCurrency(e.amount)}
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
                      Total Expenses
                    </td>
                    <td className="border border-black px-2 py-2 text-right font-semibold tabular-nums">
                      {formatCurrency(total)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              <h2
                className="mt-6 border-b border-black pb-1 font-semibold"
                style={{ fontSize: "14px" }}
              >
                Summary by Category
              </h2>
              <table
                className="mt-3 w-[60%] border-collapse"
                style={{ fontSize: "11px", marginLeft: "auto" }}
              >
                <thead>
                  <tr>
                    <th
                      className="border border-black px-2 py-2 text-left font-semibold uppercase tracking-wide"
                      style={{ fontSize: "10px" }}
                    >
                      Category
                    </th>
                    <th
                      className="border border-black px-2 py-2 text-right font-semibold uppercase tracking-wide"
                      style={{ fontSize: "10px" }}
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(byCategory)
                    .sort((a, b) => b[1] - a[1])
                    .map(([cat, amt]) => (
                      <tr key={cat}>
                        <td className="border border-black px-2 py-2 capitalize">
                          {cat}
                        </td>
                        <td className="border border-black px-2 py-2 text-right tabular-nums">
                          {formatCurrency(amt)}
                        </td>
                      </tr>
                    ))}
                </tbody>
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
