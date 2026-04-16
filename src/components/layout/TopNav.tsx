import { Activity, BrainCircuit, FlaskConical } from "lucide-react";
import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Live Monitor", icon: Activity },
  { to: "/simulator", label: "Simulator", icon: BrainCircuit },
  { to: "/research", label: "Research", icon: FlaskConical },
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[rgba(3,9,15,0.76)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(100,192,255,0.24)] bg-[rgba(100,192,255,0.12)]">
            <Activity className="h-5 w-5 text-[var(--primary)]" />
          </div>
          <div>
            <p className="text-monitor text-xs uppercase tracking-[0.32em] text-[var(--primary)]">
              Seizure Command Center
            </p>
            <h1 className="text-base font-semibold text-white sm:text-lg">
              Research Monitoring Demo
            </h1>
          </div>
        </div>

        <nav className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-white/5 p-1.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "text-[var(--muted)] hover:bg-white/6 hover:text-white",
                )
              }
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
