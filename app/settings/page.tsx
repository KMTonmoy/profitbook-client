"use client";

import * as React from "react";
import { Check, Moon, Sun, AlignJustify, Languages, Save } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { useCompactMode } from "@/hooks/use-compact-mode";
import { useLanguage, type Language } from "@/hooks/use-language";
import {
  useBusinessSettings,
  saveBusinessSettings,
  DEFAULT_SETTINGS,
} from "@/hooks/use-business-settings";
import { cn } from "@/lib/utils";
import type { BusinessSettings } from "@/lib/types";

export default function SettingsPage() {
  const { settings, loading } = useBusinessSettings();
  const effective = settings ?? DEFAULT_SETTINGS;

  // Remounts the form when the fetched settings change — no effect needed.
  const formKey = `${effective.businessName}|${effective.ownerName}|${effective.phone}|${effective.email}|${effective.address}|${effective.invoicePrefix}|${effective.paymentTerms}|${effective.invoiceFooter}`;

  return (
    <AppShell title="Settings" subtitle="Business preferences">
      <SettingsForm key={formKey} initial={effective} loading={loading} />
    </AppShell>
  );
}

function SettingsForm({
  initial,
  loading,
}: {
  initial: BusinessSettings;
  loading: boolean;
}) {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useMounted();
  const { compact, setCompact } = useCompactMode();
  const { lang, setLanguage } = useLanguage();

  const [form, setForm] = React.useState<BusinessSettings>(initial);
  const [saving, setSaving] = React.useState(false);

  const update = <K extends keyof BusinessSettings>(
    key: K,
    value: BusinessSettings[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveBusinessSettings(form);
      toast.success("Settings saved", {
        description: "Business profile updated everywhere.",
      });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const applyTheme = (next: "light" | "dark" | "system") => {
    setTheme(next);
    toast.success(`Theme changed to ${next} mode`);
  };

  const toggleCompact = () => {
    const next = !compact;
    setCompact(next);
    toast.success(next ? "Compact mode on" : "Compact mode off");
  };

  const applyLanguage = (next: Language) => {
    setLanguage(next);
  };

  const isLight = mounted && resolvedTheme === "light";
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <>
      <PageHeader
        title="Settings"
        description="Configure your business profile and preferences"
      >
        <Button
          size="sm"
          className="h-9 gap-1.5"
          onClick={handleSave}
          disabled={saving || loading}
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Business Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Business Name" className="sm:col-span-2">
              <Input
                value={form.businessName}
                onChange={(e) => update("businessName", e.target.value)}
              />
            </Field>
            <Field label="Owner Name">
              <Input
                value={form.ownerName}
                onChange={(e) => update("ownerName", e.target.value)}
              />
            </Field>
            <Field label="Phone">
              <Input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </Field>
            <Field label="Currency">
              <Input value="BDT / ৳" disabled />
            </Field>
            <Field label="Address" className="sm:col-span-2">
              <Textarea
                rows={2}
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
              />
            </Field>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Invoice Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Invoice Prefix">
              <Input
                value={form.invoicePrefix}
                onChange={(e) => update("invoicePrefix", e.target.value)}
              />
            </Field>
            <Field label="Payment Terms (days)">
              <Input
                type="number"
                value={form.paymentTerms}
                onChange={(e) =>
                  update("paymentTerms", Number(e.target.value) || 0)
                }
              />
            </Field>
            <Field label="Footer Message">
              <Textarea
                rows={3}
                value={form.invoiceFooter}
                onChange={(e) => update("invoiceFooter", e.target.value)}
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

        <Card className="shadow-sm lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Languages className="h-4 w-4 text-muted-foreground" />
              Language
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ThemeCard
              active={lang === "en"}
              onClick={() => applyLanguage("en")}
              icon={() => <span className="text-base font-semibold">EN</span>}
              title="English"
              description="Default language"
            />
            <ThemeCard
              active={lang === "bn"}
              onClick={() => applyLanguage("bn")}
              icon={() => <span className="text-base font-semibold">বাং</span>}
              title="বাংলা"
              description="Translate the entire app to Bangla"
            />
          </CardContent>
        </Card>
      </div>
    </>
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
