import { AlertCircle, Database, FileBarChart2, Waves } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ArtifactBundle } from "@/types/artifacts";

const iconMap = [Database, FileBarChart2, Waves, AlertCircle];

export function ArtifactOverview({ data }: { data: ArtifactBundle }) {
  const stats = [
    {
      label: "Prediction Rows",
      value: data.summary.predictionCount.toLocaleString(),
      hint: `${data.summary.positiveCount} seizure-labeled samples`,
    },
    {
      label: "Training Epochs",
      value: data.summary.historyCount.toLocaleString(),
      hint: "Loaded from history.csv",
    },
    {
      label: "Active Threshold",
      value: data.summary.threshold.toFixed(2),
      hint: "Best threshold from config.json",
    },
    {
      label: "Mock Feature Rows",
      value: data.simulatedFeatures.length.toLocaleString(),
      hint: `${data.config.input_dim} features per sample`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => {
          const Icon = iconMap[index];
          return (
            <Card key={item.label}>
              <CardContent className="p-5">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(100,192,255,0.12)]">
                  <Icon className="h-5 w-5 text-[var(--primary)]" />
                </div>
                <p className="text-sm text-[var(--muted)]">{item.label}</p>
                <p className="mt-1 text-3xl font-semibold text-white">{item.value}</p>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">{item.hint}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <Card>
          <CardHeader>
            <Badge tone="success" className="w-fit">
              {data.sourceMode === "backend"
                ? "Backend Artifact Mode"
                : data.sourceMode === "fallback"
                  ? "Fallback Artifact Mode"
                  : "Local Artifact Mode"}
            </Badge>
            <CardTitle>Artifact ingestion is live</CardTitle>
            <CardDescription>
              The app can load artifacts from the backend when configured, while
              preserving local `public/data` fallback behavior.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-black/20 p-4">
              <p className="text-monitor text-xs uppercase tracking-[0.22em] text-[var(--primary)]">
                Probability Summary
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">
                {(data.summary.averageProbability * 100).toFixed(1)}%
              </p>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Mean predicted seizure risk across all saved test rows.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-black/20 p-4">
              <p className="text-monitor text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
                Threshold Sweep
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">
                {data.thresholds.length.toLocaleString()} points
              </p>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Derived locally because `threshold_table.csv` is optional.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detected Artifacts</CardTitle>
            <CardDescription>
              Non-critical files stay optional. Missing files should never crash the UI.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.artifacts.slice(0, 8).map((artifact) => (
              <div
                key={artifact.name}
                className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-black/20 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-white">{artifact.name}</p>
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    {artifact.kind}
                  </p>
                </div>
                <Badge tone={artifact.available ? "success" : "warning"}>
                  {artifact.available ? "available" : "optional"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {data.warnings.length > 0 ? (
        <Card className="border-[rgba(255,209,102,0.24)]">
          <CardHeader>
            <Badge tone="warning" className="w-fit">
              Fallback Notes
            </Badge>
            <CardTitle>Graceful fallback handling is active</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[var(--muted-foreground)]">
            {data.warnings.map((warning) => (
              <p key={warning}>{warning}</p>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
