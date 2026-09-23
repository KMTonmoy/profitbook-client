"use client";

import * as React from "react";
import { Printer } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { DueTable } from "@/components/due/due-table";
import { businessSettings } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";
import { CreditCard, AlertCircle, Calendar, CheckCircle2 } from "lucide-react";
import type { Due } from "@/lib/types";
import { useApi } from "@/hooks/use-api";

export default function DuePage() {
  const { data, loading, error, refetch } = useApi<Due[]>("/api/dues");
  const items = data ?? [];

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const monthStart = `${now.getFullYear()}-${String(
    now.getMonth() + 1,
  ).padStart(2, "0")}-01`;

  const totalReceivable = items.reduce((s, d) => s + (d.due || 0), 0);
  const overdue = items
    .filter((d) => d.dueDate && d.dueDate < todayStr && d.status !== "paid")
    .reduce((s, d) => s + (d.due || 0), 0);
  const dueToday = items
    .filter((d) => d.dueDate === todayStr)
    .reduce((s, d) => s + (d.due || 0), 0);
  const collectedThisMonth = items
    .filter((d) => d.saleDate && d.saleDate >= monthStart)
    .reduce((s, d) => s + (d.paid || 0), 0);

  const handlePrint = () => {
    const w = window.open("", "_blank", "width=1100,height=850");
    if (!w) return;

    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const rows = items
      .map(
        (d, i) => `
      <tr>
        <td class="ctr">${i + 1}</td>
        <td>${esc(d.customerName ?? "—")}</td>
        <td>${esc(d.invoiceNumber ?? "—")}</td>
        <td>${esc(d.saleDate ?? "—")}</td>
        <td class="num">${fmt(d.totalAmount)}</td>
        <td class="num">${fmt(d.paid)}</td>
        <td class="num">${fmt(d.due)}</td>
        <td>${esc(d.dueDate ?? "—")}</td>
        <td>${esc(d.status ?? "")}</td>
      </tr>`,
      )
      .join("");

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Due List — ${esc(businessSettings.businessName)}</title>
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
  .report-title { margin-top: 12px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th, td { border: 1px solid #000; padding: 6px 10px; font-size: 11px; text-align: left; }
  th { text-transform: uppercase; font-size: 10px; font-weight: 600; }
  td.ctr, th.ctr { text-align: center; }
  td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
  tfoot td { font-weight: 700; background: #f5f5f5; }
  .footer { margin-top: 24px; border-top: 1px solid #999; padding-top: 10px; font-size: 10px; color: #555; text-align: center; }
  @media print { body { padding: 12mm; } @page { margin: 12mm; size: A4 portrait; } }
</style>
</head>
<body>
  <div class="header">
    <h1>${esc(businessSettings.businessName)}</h1>
    <div class="meta">${esc(businessSettings.address)}</div>
    <div class="meta">${esc(businessSettings.phone)}</div>
    <div class="report-title">Due / Credit Report</div>
    <div class="meta">${items.length} entries · Generated on ${today}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th class="ctr" style="width:32px">#</th>
        <th>Customer</th>
        <th>Invoice</th>
        <th>Sale Date</th>
        <th class="num">Total</th>
        <th class="num">Paid</th>
        <th class="num">Due</th>
        <th>Due Date</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr>
        <td colspan="6">Total</td>
        <td class="num">${fmt(totalReceivable)}</td>
        <td colspan="2"></td>
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
    <AppShell title="Due / Credit" subtitle="Manage receivables">
      <PageHeader
        title="Due Management"
        description="Track outstanding customer dues and recoveries"
      >
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1.5"
          onClick={handlePrint}
        >
          <Printer className="h-4 w-4" /> Print
        </Button>
      </PageHeader>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load dues: {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Receivable"
          value={formatCurrency(totalReceivable)}
          icon={CreditCard}
          tone="warning"
        />
        <StatCard
          label="Overdue"
          value={formatCurrency(overdue)}
          icon={AlertCircle}
          tone="destructive"
        />
        <StatCard
          label="Due Today"
          value={formatCurrency(dueToday)}
          icon={Calendar}
          tone="info"
        />
        <StatCard
          label="Collected This Month"
          value={formatCurrency(collectedThisMonth)}
          icon={CheckCircle2}
          tone="success"
        />
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
            Loading dues…
          </div>
        ) : (
          <DueTable
            items={items}
            onPaymentRecorded={() => {
              toast.success("Payment recorded");
              refetch();
            }}
          />
        )}
      </div>
    </AppShell>
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

function fmt(n: number): string {
  return `৳ ${(n ?? 0).toLocaleString("en-IN")}`;
}
