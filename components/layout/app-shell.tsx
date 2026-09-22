import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

interface AppShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function AppShell({ title, subtitle, children, actions }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="sticky top-0 hidden h-screen lg:block">
        <Sidebar />
      </div>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          {actions && (
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {actions}
            </div>
          )}
          <div className="mx-auto w-full max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}