"use client";

import * as React from "react";
import { Printer } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  StatementView,
  type StatementHandle,
} from "@/components/statements/statement-view";

export default function StatementsPage() {
  const ref = React.useRef<StatementHandle>(null);

  return (
    <AppShell
      title="Statements"
      subtitle="Generate comprehensive business statements"
    >
      <PageHeader
        title="Business Statements"
        description="Pick a date range — the statement updates automatically"
      >
        <Button
          size="sm"
          className="h-9 gap-1.5"
          onClick={() => ref.current?.print()}
        >
          <Printer className="h-4 w-4" /> Print Statement
        </Button>
      </PageHeader>

      <StatementView ref={ref} />
    </AppShell>
  );
}