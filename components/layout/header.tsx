"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  Plus,
  Calendar,
  Package,
  ShoppingCart,
  Receipt,
  Users,
  Wallet,
  CreditCard,
  LogOut,
  Settings as SettingsIcon,
  User as UserIcon,
  LayoutDashboard,
  Warehouse,
  Truck,
  TrendingUp,
  FileText,
  BarChart3,
  Tags,
  CornerDownLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Sidebar } from "@/components/layout/sidebar";
import { Logo } from "@/components/layout/logo";
import { useBusinessSettingsOrDefault } from "@/hooks/use-business-settings";
import { useAuth, logout as clearSession } from "@/hooks/use-auth";
import { useApi } from "@/hooks/use-api";
import { getInitials, formatCurrency } from "@/lib/format";
import type { Product, Customer, Sale } from "@/lib/types";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const quickActions = [
  {
    label: "Add Product",
    href: "/products",
    icon: Package,
    shortcut: "⌘P",
  },
  {
    label: "Record Purchase",
    href: "/purchases",
    icon: ShoppingCart,
    shortcut: "⌘U",
  },
  { label: "Record Sale", href: "/sales", icon: Receipt, shortcut: "⌘S" },
  {
    label: "Add Customer",
    href: "/customers",
    icon: Users,
    shortcut: "⌘C",
  },
  { label: "Add Expense", href: "/expenses", icon: Wallet, shortcut: "⌘E" },
  {
    label: "Record Due Payment",
    href: "/due",
    icon: CreditCard,
    shortcut: "⌘D",
  },
];

const staticRoutes = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    keywords: "home overview",
  },
  {
    label: "Products",
    href: "/products",
    icon: Package,
    keywords: "product items catalog",
  },
  {
    label: "Categories",
    href: "/categories",
    icon: Tags,
    keywords: "category tags",
  },
  {
    label: "Stock",
    href: "/stock",
    icon: Warehouse,
    keywords: "inventory movements",
  },
  {
    label: "Purchases",
    href: "/purchases",
    icon: ShoppingCart,
    keywords: "purchase supplier buy",
  },
  {
    label: "Sales",
    href: "/sales",
    icon: Receipt,
    keywords: "sale invoice customer",
  },
  {
    label: "Suppliers",
    href: "/suppliers",
    icon: Truck,
    keywords: "supplier vendor",
  },
  {
    label: "Customers",
    href: "/customers",
    icon: Users,
    keywords: "customer client",
  },
  {
    label: "Due / Credit",
    href: "/due",
    icon: CreditCard,
    keywords: "due credit receivable",
  },
  {
    label: "Expenses",
    href: "/expenses",
    icon: Wallet,
    keywords: "expense cost",
  },
  {
    label: "Profit & Loss",
    href: "/profit-loss",
    icon: TrendingUp,
    keywords: "profit loss p&l",
  },
  {
    label: "Statements",
    href: "/statements",
    icon: FileText,
    keywords: "statement report",
  },
  {
    label: "Reports",
    href: "/reports",
    icon: BarChart3,
    keywords: "report analytics",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    keywords: "settings preference",
  },
];

export function Header({ title, subtitle }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();
  const { settings } = useBusinessSettingsOrDefault();
  const { session } = useAuth();

  const { data: products } = useApi<Product[]>("/api/products");
  const { data: customers } = useApi<Customer[]>("/api/customers");
  const { data: sales } = useApi<Sale[]>("/api/sales");

  const ownerInitials = getInitials(settings.ownerName || "Owner");

  const handleSignOut = () => {
    clearSession();
    router.push("/");
  };

  const openSearch = () => {
    setSearchOpen(true);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openSearch();
    }
  };

  React.useEffect(() => {
    window.addEventListener(
      "keydown",
      handleKeyDown as unknown as EventListener,
    );
    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown as unknown as EventListener,
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const q = query.trim().toLowerCase();

  const matchedRoutes = q
    ? staticRoutes.filter(
        (r) => r.label.toLowerCase().includes(q) || r.keywords.includes(q),
      )
    : staticRoutes.slice(0, 6);

  const matchedProducts = q
    ? (products ?? [])
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
        )
        .slice(0, 4)
    : [];

  const matchedCustomers = q
    ? (customers ?? [])
        .filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.phone.toLowerCase().includes(q),
        )
        .slice(0, 4)
    : [];

  const matchedSales = q
    ? (sales ?? [])
        .filter(
          (s) =>
            s.invoiceNumber.toLowerCase().includes(q) ||
            s.customerName.toLowerCase().includes(q),
        )
        .slice(0, 4)
    : [];

  const hasResults =
    matchedRoutes.length ||
    matchedProducts.length ||
    matchedCustomers.length ||
    matchedSales.length;

  const go = (href: string) => {
    setSearchOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur-md sm:gap-3 sm:px-4 lg:px-6">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            }
          />
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="lg:hidden">
          <Logo size="sm" showText={false} />
        </div>

        <div className="hidden min-w-0 flex-col leading-tight lg:flex">
          <h1 className="truncate text-base font-semibold tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <button
          type="button"
          onClick={openSearch}
          className="ml-auto hidden h-9 w-full max-w-md items-center gap-2 rounded-lg border bg-muted/40 px-3 text-left text-sm text-muted-foreground transition-colors hover:bg-muted md:flex lg:ml-6"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="flex-1 truncate">
            Search products, invoices, customers…
          </span>
          <kbd className="hidden items-center gap-1 rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:inline-flex">
            ⌘K
          </kbd>
        </button>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 md:hidden"
          onClick={openSearch}
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>

        <div className="ml-auto flex items-center gap-1.5 md:ml-0">
          <Button
            variant="outline"
            size="sm"
            className="hidden h-9 gap-2 xl:inline-flex"
          >
            <Calendar className="h-4 w-4" />
            This Month
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button size="sm" className="h-9 gap-1.5">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline"</span>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Quick Action</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {quickActions.map((a) => {
                const Icon = a.icon;
                return (
                  <DropdownMenuItem
                    key={a.href}
                    render={
                      <Link href={a.href} className="flex items-center">
                        <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                        {a.label}
                        <DropdownMenuShortcut>
                          {a.shortcut}
                        </DropdownMenuShortcut>
                      </Link>
                    }
                  />
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  className="ml-1 rounded-full ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Owner profile"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-[11px] font-semibold">
                      {ownerInitials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              }
            />
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="flex flex-col gap-0.5">
                  <span>{settings.ownerName || "Owner"}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {session?.username
                      ? `Signed in as ${session.username}`
                      : "Owner"}
                  </span>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                render={
                  <Link href="/settings" className="flex items-center">
                    <UserIcon className="mr-2 h-4 w-4" /> Profile
                  </Link>
                }
              />
              <DropdownMenuItem
                render={
                  <Link href="/settings" className="flex items-center">
                    <SettingsIcon className="mr-2 h-4 w-4" /> Settings
                  </Link>
                }
              />
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[10vh] backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-2xl border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b px-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearchOpen(false);
                  if (e.key === "Enter" && matchedRoutes[0]) {
                    go(matchedRoutes[0].href);
                  }
                }}
                placeholder="Search pages, products, customers, invoices…"
                className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                ESC
              </kbd>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {!hasResults ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No results for &ldquo;{query}&rdquo;
                </div>
              ) : (
                <>
                  {matchedRoutes.length > 0 && (
                    <SearchGroup title="Pages">
                      {matchedRoutes.slice(0, 6).map((r) => {
                        const Icon = r.icon;
                        return (
                          <SearchRow
                            key={r.href}
                            icon={<Icon className="h-4 w-4" />}
                            label={r.label}
                            subtitle={r.href}
                            onClick={() => go(r.href)}
                          />
                        );
                      })}
                    </SearchGroup>
                  )}

                  {matchedProducts.length > 0 && (
                    <SearchGroup title="Products">
                      {matchedProducts.map((p) => (
                        <SearchRow
                          key={p.id}
                          icon={<Package className="h-4 w-4" />}
                          label={p.name}
                          subtitle={`SKU ${p.sku} · Stock ${p.currentStock} ${p.unit}`}
                          badge={formatCurrency(p.sellingPrice)}
                          onClick={() => go(`/products`)}
                        />
                      ))}
                    </SearchGroup>
                  )}

                  {matchedCustomers.length > 0 && (
                    <SearchGroup title="Customers">
                      {matchedCustomers.map((c) => (
                        <SearchRow
                          key={c.id}
                          icon={<Users className="h-4 w-4" />}
                          label={c.name}
                          subtitle={c.phone}
                          badge={
                            c.totalDue > 0
                              ? `Due ${formatCurrency(c.totalDue)}`
                              : undefined
                          }
                          badgeTone="destructive"
                          onClick={() => go(`/customers`)}
                        />
                      ))}
                    </SearchGroup>
                  )}

                  {matchedSales.length > 0 && (
                    <SearchGroup title="Invoices">
                      {matchedSales.map((s) => (
                        <SearchRow
                          key={s.id}
                          icon={<Receipt className="h-4 w-4" />}
                          label={s.invoiceNumber}
                          subtitle={`${s.customerName} · ${s.date}`}
                          badge={formatCurrency(s.total)}
                          onClick={() => go(`/sales`)}
                        />
                      ))}
                    </SearchGroup>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center justify-between border-t bg-muted/40 px-4 py-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CornerDownLeft className="h-3 w-3" /> to open first result
              </span>
              <span>ProfitBook Search</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SearchGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-1">
      <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function SearchRow({
  icon,
  label,
  subtitle,
  badge,
  badgeTone,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  badge?: string;
  badgeTone?: "default" | "destructive";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{label}</span>
        {subtitle && (
          <span className="block truncate text-xs text-muted-foreground">
            {subtitle}
          </span>
        )}
      </span>
      {badge && (
        <Badge
          variant={badgeTone === "destructive" ? "destructive" : "secondary"}
          className="shrink-0 text-[10px]"
        >
          {badge}
        </Badge>
      )}
    </button>
  );
}
