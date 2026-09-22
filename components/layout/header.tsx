"use client";

import * as React from "react";
import Link from "next/link";
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Sidebar } from "@/components/layout/sidebar";
import { Logo } from "@/components/layout/logo";
import { businessSettings } from "@/lib/mock-data";
import { getInitials } from "@/lib/format";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const quickActions = [
  { label: "Add Product", href: "/products/new", icon: Package, shortcut: "⌘P" },
  { label: "Record Purchase", href: "/purchases/new", icon: ShoppingCart, shortcut: "⌘U" },
  { label: "Record Sale", href: "/sales/new", icon: Receipt, shortcut: "⌘S" },
  { label: "Add Customer", href: "/customers/new", icon: Users, shortcut: "⌘C" },
  { label: "Add Expense", href: "/expenses/new", icon: Wallet, shortcut: "⌘E" },
  { label: "Record Due Payment", href: "/due/new", icon: CreditCard, shortcut: "⌘D" },
];

export function Header({ title, subtitle }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md lg:px-6">
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

      <div className="relative ml-auto hidden max-w-sm flex-1 md:block lg:ml-6">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products, invoices, customers…"
          className="h-9 pl-9"
          aria-label="Search"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
        <Button
          variant="outline"
          size="sm"
          className="hidden h-9 gap-2 md:inline-flex"
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
                <span className="hidden sm:inline">Quick Action</span>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel>Quick Action</DropdownMenuLabel>
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
                      <DropdownMenuShortcut>{a.shortcut}</DropdownMenuShortcut>
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
                    {getInitials(businessSettings.ownerName)}
                  </AvatarFallback>
                </Avatar>
              </button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span>{businessSettings.ownerName}</span>
              <span className="text-xs font-normal text-muted-foreground">
                Owner
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              render={<Link href="/settings">Settings</Link>}
            />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}