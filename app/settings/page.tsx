import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { businessSettings } from "@/lib/mock-data";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <AppShell title="Settings" subtitle="Business preferences">
      <PageHeader
        title="Settings"
        description="Configure your business profile and preferences"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Business Information */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Business Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Business Name" className="sm:col-span-2">
              <Input defaultValue={businessSettings.businessName} />
            </Field>
            <Field label="Owner Name">
              <Input defaultValue={businessSettings.ownerName} />
            </Field>
            <Field label="Phone">
              <Input defaultValue={businessSettings.phone} />
            </Field>
            <Field label="Email">
              <Input defaultValue={businessSettings.email} />
            </Field>
            <Field label="Currency">
              <Input defaultValue="BDT / ৳" disabled />
            </Field>
            <Field label="Address" className="sm:col-span-2">
              <Textarea rows={2} defaultValue={businessSettings.address} />
            </Field>
          </CardContent>
        </Card>

        {/* Invoice Settings */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Invoice Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Invoice Prefix">
              <Input defaultValue="INV" />
            </Field>
            <Field label="Payment Terms (days)">
              <Input type="number" defaultValue={15} />
            </Field>
            <Field label="Footer Message">
              <Textarea
                rows={3}
                defaultValue={businessSettings.invoiceFooter}
              />
            </Field>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="lg:col-span-3 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Appearance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" className="h-9">
              Light Mode
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              Dark Mode
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              Compact Mode
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-xs font-medium">{label}</Label>
      {children}
    </div>
  );
}
