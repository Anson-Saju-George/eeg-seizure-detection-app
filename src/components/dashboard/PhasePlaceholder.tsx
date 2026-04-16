import { motion } from "framer-motion";
import { Activity, AlertTriangle, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const highlights = [
  {
    title: "Live playback",
    description: "Streaming saved prediction rows into a command-center monitor.",
    icon: Activity,
  },
  {
    title: "Research-safe alerts",
    description: "Threshold-based alerting with graceful fallbacks when files are missing.",
    icon: AlertTriangle,
  },
  {
    title: "Artifact-driven analytics",
    description: "Charts and simulators will be powered by local CSV and JSON exports.",
    icon: Sparkles,
  },
];

export function PhasePlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="space-y-6"
      >
        <Card className="overflow-hidden">
          <CardHeader className="pb-5">
            <Badge tone="info" className="w-fit">
              Phase 0 Shell
            </Badge>
            <CardTitle className="text-3xl sm:text-4xl">{title}</CardTitle>
            <CardDescription className="max-w-2xl text-base">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map(({ title: itemTitle, description: itemDescription, icon: Icon }) => (
                <div
                  key={itemTitle}
                  className="rounded-2xl border border-[var(--border)] bg-black/20 p-4"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(100,192,255,0.12)]">
                    <Icon className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <h2 className="mb-2 text-lg font-semibold text-white">{itemTitle}</h2>
                  <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                    {itemDescription}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.section>

      <motion.aside
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <Badge tone="warning" className="w-fit">
              Safety Label
            </Badge>
            <CardTitle>Research/demo simulator only</CardTitle>
            <CardDescription>
              This interface is intentionally styled like a monitor, but it must not
              be interpreted as a clinical device or raw EEG telemetry system.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Build Roadmap</CardTitle>
            <CardDescription>
              The shell is in place. Next phases will attach typed data loading,
              streaming playback, simulation controls, and backend adapters.
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.aside>
    </div>
  );
}
