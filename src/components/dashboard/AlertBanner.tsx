import { motion } from "framer-motion";
import { AlertTriangle, ShieldCheck, Siren } from "lucide-react";

import { cn } from "@/lib/utils";

const config = {
  NORMAL: {
    icon: ShieldCheck,
    title: "Normal playback state",
    body: "Current probability is clearly below the active threshold.",
    className: "border-[rgba(22,199,154,0.28)] bg-[rgba(22,199,154,0.12)] text-[var(--accent)]",
  },
  WARNING: {
    icon: AlertTriangle,
    title: "Warning band",
    body: "Probability is near the threshold. Monitor trend movement closely.",
    className: "border-[rgba(255,209,102,0.28)] bg-[rgba(255,209,102,0.12)] text-[var(--warning)]",
  },
  "HIGH RISK": {
    icon: Siren,
    title: "High-risk alert",
    body: "Probability crossed the active threshold during playback.",
    className: "border-[rgba(255,107,122,0.3)] bg-[rgba(255,107,122,0.12)] text-[var(--danger)]",
  },
} as const;

export function AlertBanner({
  status,
  probability,
  threshold,
}: {
  status: "NORMAL" | "WARNING" | "HIGH RISK";
  probability: number;
  threshold: number;
}) {
  const { icon: Icon, title, body, className } = config[status];

  return (
    <motion.div
      animate={status === "HIGH RISK" ? { boxShadow: ["0 0 0 rgba(255,107,122,0)", "0 0 24px rgba(255,107,122,0.28)", "0 0 0 rgba(255,107,122,0)"] } : {}}
      transition={{ duration: 1.6, repeat: status === "HIGH RISK" ? Number.POSITIVE_INFINITY : 0 }}
      className={cn("rounded-3xl border p-4", className)}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-2xl bg-black/20 p-2">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="mt-1 text-sm opacity-90">{body}</p>
          <p className="text-monitor mt-2 text-xs uppercase tracking-[0.18em] opacity-80">
            Risk {probability.toFixed(3)} · Threshold {threshold.toFixed(2)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
