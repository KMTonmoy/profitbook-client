"use client";

import { Receipt } from "lucide-react";

import { ReportShell } from "@/components/reports/report-shell";
import { ReportTable } from "@/components/reports/report-table";
import { ReportsChart } from "@/components/reports/reports-chart";
import { sales, businessSettings } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/format";

export default function SalesReportPage() {
  const total = sales.reduce((s, x) => s + x.total, 0);
  const paid = sales.reduce((s, x) => s + x.paid, 0);
  const due = sales.reduce((s, x) => s + x.due, 0);
  const profit = sales.reduce((s, x) => s + x.profit, 0);

  const monthlyMap = new Map<
    string,
    { month: string; sales: number; paid: number }
  >();
  sales.forEach((s) => {
    const key = s.date.slice(0, 7);
    const cur = monthlyMap.get(key) ?? { month: key, sales: 0, paid: 0 };
    cur.sales += s.total;
    cur.paid += s.paid;
    monthlyMap.set(key, cur);
  });
  const monthly = Array.from(monthlyMap.values()).sort((a, b) =>
    a.month.localeCompare(b.month),
  );

  const handlePrint = () => {
    const w = window.open("", "_blank", "width=1100,height=850");
    if (!w) return;

    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const rowsHtml = sales
      .map(
        (s, i) => `
      <tr>
        <td class="ctr">${i + 1}</td>
        <td>${esc(s.invoiceNumber)}</td>
        <td>${esc(s.customerName)}</td>
        <td>${formatDate(s.date)}</td>
        <td class="num">${formatCurrency(s.total)}</td>
        <td class="num">${formatCurrency(s.paid)}</td>
        <td class="num">${formatCurrency(s.due)}</td>
        <td class="num">${formatCurrency(s.profit)}</td>
        <td class="capitalize">${esc(s.status)}</td>
      </tr>`,
      )
      .join("");

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Sales Report — ${esc(businessSettings.businessName)}</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    color: #000; background: #fff;
    margin: 0 auto; padding: 16mm;
    width: 210mm; min-height: 297mm; font-size: 12px;
  }
  h1 { font-size: 20px; margin: 0 0 4px; }
  .header { border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 8px; }
  .meta { font-size: 11px; color: #444; }
  .report-title {
    margin-top: 12px; font-size: 14px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th, td {
    border: 1px solid #000;
    padding: 6px 10px;
    font-size: 11px;
    text-align: left;
    vertical-align: top;
  }
  th { text-transform: uppercase; font-size: 10px; font-weight: 600; }
  td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
  td.ctr, th.ctr { text-align: center; }
  tfoot td { font-weight: 700; background: #f5f5f5; }
  .footer {
    margin-top: 24px; border-top: 1px solid #999; padding-top: 10px;
    font-size: 10px; color: #555; text-align: center;
  }
  @media print { body { padding: 12mm; } @page { margin: 12mm; size: A4 portrait; } }
</style>
</head>
<body>
  <div class="header">
    <h1>${esc(businessSettings.businessName)}</h1>
    <div class="meta">${esc(businessSettings.address)}</div>
    <div class="meta">${esc(businessSettings.phone)}</div>
    ${businessSettings.email ? `<div class="meta">${esc(businessSettings.email)}</div>` : ""}
    <div class="report-title">Sales Report</div>
    <div class="meta">${sales.length} invoices</div>
    <div class="meta">Generated on ${today}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th class="ctr" style="width:32px">#</th>
        <th>Invoice</th>
        <th>Customer</th>
        <th>Date</th>
        <th class="num">Total</th>
        <th class="num">Paid</th>
        <th class="num">Due</th>
        <th class="num">Profit</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>${rowsHtml}</tbody>
    <tfoot>
      <tr>
        <td colspan="4">Total</td>
        <td class="num">${formatCurrency(total)}</td>
        <td class="num">${formatCurrency(paid)}</td>
        <td class="num">${formatCurrency(due)}</td>
        <td class="num">${formatCurrency(profit)}</td>
        <td></td>
      </tr>
    </tfoot>
  </table>

  <div class="footer">${esc(businessSettings.invoiceFooter)}</div>
  <script>window.onload = function(){ window.print(); };</script>
</body>
</html>`;

    w.document.write(html);
    w.document.close();
  };

  return (
    <ReportShell
      title="Sales Report"
      description="Invoices, revenue, payments and dues"
      icon={Receipt}
      onPrint={handlePrint}
      kpis={[
        { label: "Invoices", value: sales.length },
        { label: "Total Sales", value: formatCurrency(total), tone: "info" },
        { label: "Collected", value: formatCurrency(paid), tone: "success" },
        {
          label: "Outstanding",
          value: formatCurrency(due),
          tone: "destructive",
        },
      ]}
    >
      <ReportsChart
        data={monthly as unknown as Record<string, unknown>[]}
        xKey="month"
        series={[
          { key: "sales", label: "Sales", color: "var(--color-chart-1)" },
          { key: "paid", label: "Paid", color: "var(--color-chart-2)" },
        ]}
        title="Sales trend"
      />
      <ReportTable
        columns={[
          { key: "inv", header: "Invoice" },
          { key: "customer", header: "Customer" },
          { key: "date", header: "Date", render: (s) => formatDate(s.date) },
          {
            key: "total",
            header: "Total",
            align: "right",
            render: (s) => formatCurrency(s.total),
          },
          {
            key: "paid",
            header: "Paid",
            align: "right",
            render: (s) => (
              <span className="text-success">{formatCurrency(s.paid)}</span>
            ),
          },
          {
            key: "due",
            header: "Due",
            align: "right",
            render: (s) => (
              <span className={s.due > 0 ? "text-destructive" : ""}>
                {formatCurrency(s.due)}
              </span>
            ),
          },
          {
            key: "profit",
            header: "Profit",
            align: "right",
            render: (s) => (
              <span className="text-success">{formatCurrency(s.profit)}</span>
            ),
          },
        ]}
        rows={sales}
        rowKey={(s) => s.id}
        mapRow={(s) => ({
          inv: s.invoiceNumber,
          customer: s.customerName,
          date: s.date,
          total: s.total,
          paid: s.paid,
          due: s.due,
          profit: s.profit,
        })}
      />
    </ReportShell>
  );
}

function esc(s: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
  };
  return String(s).replace(/[&<>"]/g, (c) => map[c] ?? c);
}
