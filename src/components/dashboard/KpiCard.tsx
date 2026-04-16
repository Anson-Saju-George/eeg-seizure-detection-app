import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

export function KpiCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(100,192,255,0.12)] text-[var(--primary)]">
          {icon}
        </div>
        <p className="text-sm text-[var(--muted)]">{label}</p>
        <p className="mt-1 text-3xl font-semibold text-white">{value}</p>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">{hint}</p>
      </CardContent>
    </Card>
  );
}
