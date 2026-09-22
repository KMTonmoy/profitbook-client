import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { ProductTable } from "@/components/products/product-table";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download } from "lucide-react";

export const metadata = { title: "Products" };

export default function ProductsPage() {
  return (
    <AppShell title="Products" subtitle="Manage your product catalog">
      <PageHeader
        title="Products"
        description="Manage your complete product catalog, pricing and stock"
      >
        <Button variant="outline" size="sm" className="h-9 gap-1.5">
          <Upload className="h-4 w-4" /> Import
        </Button>
        <Button variant="outline" size="sm" className="h-9 gap-1.5">
          <Download className="h-4 w-4" /> Export
        </Button>
        <Button size="sm" className="h-9 gap-1.5">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </PageHeader>

      <ProductTable />
    </AppShell>
  );
}
