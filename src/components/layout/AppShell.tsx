import { Outlet } from "react-router-dom";

import { AppFooter } from "@/components/layout/AppFooter";
import { TopNav } from "@/components/layout/TopNav";

export function AppShell() {
  return (
    <div className="monitor-grid min-h-screen">
      <TopNav />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}
