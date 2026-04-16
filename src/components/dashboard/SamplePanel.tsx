import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import type { PredictionRow } from "@/types/artifacts";

function confidenceBand(probability: number) {
  if (probability >= 0.75) return "High";
  if (probability >= 0.4) return "Medium";
  return "Low";
}

export function SamplePanel({
  sample,
  status,
}: {
  sample: PredictionRow | null;
  status: "NORMAL" | "WARNING" | "HIGH RISK";
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Current Sample</span>
          <StatusBadge status={status} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-black/20 px-4 py-3">
          <span className="text-[var(--muted)]">Sample Index</span>
          <span className="text-monitor text-white">{sample?.sampleIndex ?? "--"}</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-black/20 px-4 py-3">
          <span className="text-[var(--muted)]">Predicted Probability</span>
          <span className="text-monitor text-white">
            {sample ? sample.pred_probability.toFixed(4) : "--"}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-black/20 px-4 py-3">
          <span className="text-[var(--muted)]">Predicted Label</span>
          <span className="text-white">
            {sample ? (sample.pred_label === 1 ? "Seizure" : "Non-seizure") : "--"}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-black/20 px-4 py-3">
          <span className="text-[var(--muted)]">True Label</span>
          <span className="text-white">
            {sample ? (sample.true_label === 1 ? "Seizure" : "Non-seizure") : "--"}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-black/20 px-4 py-3">
          <span className="text-[var(--muted)]">Confidence Band</span>
          <span className="text-white">
            {sample ? confidenceBand(sample.pred_probability) : "--"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
