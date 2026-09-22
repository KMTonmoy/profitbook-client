"use client";

import * as React from "react";
import { Check, Moon, Sun, AlignJustify } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { businessSettings } from "@/lib/mock-data";
import { useMounted } from "@/hooks/use-mounted";
import { useCompactMode } from "@/hooks/use-compact-mode";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useMounted();
  const { compact, setCompact } = useCompactMode();

  const applyTheme = (next: "light" | "dark" | "system") => {
    setTheme(next);
    toast.success(`Theme changed to ${next} mode`);
  };

  const toggleCompact = () => {
    const next = !compact;
    setCompact(next);
    toast.success(next ? "Compact mode on" : "Compact mode off");
  };

  const isLight = mounted && resolvedTheme === "light";
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <AppShell title="Settings" subtitle="Business preferences">
      <PageHeader
        title="Settings"
        description="Configure your business profile and preferences"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="shadow-sm lg:col-span-2">
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

        <Card className="shadow-sm lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Appearance</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ThemeCard
              active={isLight}
              onClick={() => applyTheme("light")}
              icon={Sun}
              title="Light Mode"
              description="Bright background, dark text"
            />
            <ThemeCard
              active={isDark}
              onClick={() => applyTheme("dark")}
              icon={Moon}
              title="Dark Mode"
              description="Dark background, light text"
            />
            <ThemeCard
              active={compact}
              onClick={toggleCompact}
              icon={AlignJustify}
              title="Compact Mode"
              description="Tighter spacing and padding"
            />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function ThemeCard({
  active,
  onClick,
  icon: Icon,
  title,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all hover:border-primary/40 hover:bg-accent/40",
        active
          ? "border-primary bg-accent/60 ring-1 ring-primary/30"
          : "border-border bg-card",
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          active
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground",
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      {active && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
      )}
    </button>
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
