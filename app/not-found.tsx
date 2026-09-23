"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Home, Search, Compass } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/layout/logo";

const popularLinks = [
  { label: "Dashboard", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Sales", href: "/sales" },
  { label: "Customers", href: "/customers" },
  { label: "Reports", href: "/reports" },
];

export default function NotFound() {
  const [query, setQuery] = React.useState("");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-primary/20 blur-[100px]"
        animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-32 -bottom-32 h-[420px] w-[420px] rounded-full bg-info/20 blur-[100px]"
        animate={{ x: [0, -60, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-warning/10 blur-[110px]"
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="rounded-3xl border bg-card/80 p-8 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] backdrop-blur-xl sm:p-12">
          <div className="mb-8 flex justify-center">
            <Logo size="md" />
          </div>

          <div className="relative mb-6 flex items-center justify-center">
            <motion.span
              className="select-none text-[120px] font-black leading-none tracking-tighter text-primary/15 sm:text-[160px]"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              404
            </motion.span>

            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <motion.div
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Compass className="h-7 w-7" />
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="text-center"
          >
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Page not found
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              {
                "The page you're looking for doesn't exist or has been moved. Let's get you back to your business."
              }
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) {
                window.location.href = `/products?search=${encodeURIComponent(
                  query,
                )}`;
              }
            }}
            className="mx-auto mt-8 flex max-w-md items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for anything…"
                className="h-11 pl-9"
              />
            </div>
            <Button type="submit" size="lg" className="h-11 px-5">
              Search
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
          >
            <Button
              variant="outline"
              size="lg"
              className="h-11 gap-2 px-5"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              Go back
            </Button>
            <Link href="/">
              <Button size="lg" className="h-11 gap-2 px-5">
                <Home className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-10 border-t pt-6"
          >
            <p className="mb-3 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Popular pages
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {popularLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    className="inline-flex items-center rounded-full border bg-background px-4 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="mt-6 text-center text-xs text-muted-foreground"
        >
          ProfitBook · Business Management &amp; Accounting
        </motion.p>
      </motion.div>
    </div>
  );
}
