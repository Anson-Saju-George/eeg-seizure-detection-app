import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeTone = "info" | "success" | "warning" | "danger";

const toneClasses: Record<BadgeTone, string> = {
  info: "bg-[rgba(100,192,255,0.12)] text-[var(--primary)]",
  success: "bg-[rgba(22,199,154,0.14)] text-[var(--accent)]",
  warning: "bg-[rgba(255,209,102,0.16)] text-[var(--warning)]",
  danger: "bg-[rgba(255,107,122,0.16)] text-[var(--danger)]",
};

export function Badge({
  className,
  tone = "info",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
