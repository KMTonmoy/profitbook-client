import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { StatementView } from "@/components/statements/statement-view";
import { Button } from "@/components/ui/button";
import { Printer, Download, FileSpreadsheet } from "lucide-react";

export const metadata = { title: "Statements" };

export default function StatementsPage() {
  return (
    <AppShell
      title="Statements"
      subtitle="Generate comprehensive business statements"
    >
      <PageHeader
        title="Business Statements"
        description="Pick a date range and generate a complete financial summary"
      >
        <Button variant="outline" size="sm" className="h-9 gap-1.5">
          <FileSpreadsheet className="h-4 w-4" /> Excel
        </Button>
        <Button variant="outline" size="sm" className="h-9 gap-1.5">
          <Download className="h-4 w-4" /> PDF
        </Button>
        <Button variant="outline" size="sm" className="h-9 gap-1.5">
          <Printer className="h-4 w-4" /> Print
        </Button>
        <Button size="sm" className="h-9">
          Generate Statement
        </Button>
      </PageHeader>

      <StatementView />
    </AppShell>
  );
}
