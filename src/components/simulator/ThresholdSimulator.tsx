import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ThresholdRow } from "@/types/artifacts";

export function ThresholdSimulator({
  metrics,
  threshold,
  onChange,
}: {
  metrics: ThresholdRow;
  threshold: number;
  onChange: (value: number) => void;
}) {
  const cards = [
    { label: "Precision", value: metrics.precision },
    { label: "Recall", value: metrics.recall },
    { label: "F1", value: metrics.f1 },
    { label: "Balanced Acc.", value: metrics.balanced_accuracy },
  ];

  const counts = [
    { label: "TP", value: metrics.tp, tone: "success" as const },
    { label: "TN", value: metrics.tn, tone: "info" as const },
    { label: "FP", value: metrics.fp, tone: "warning" as const },
    { label: "FN", value: metrics.fn, tone: "danger" as const },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Threshold Simulator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-2xl border border-[var(--border)] bg-black/20 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-[var(--muted)]">Threshold</span>
            <span className="text-monitor text-lg text-white">{threshold.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.05}
            max={0.95}
            step={0.01}
            value={threshold}
            onChange={(event) => onChange(Number(event.target.value))}
            className="w-full accent-[var(--primary)]"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[var(--border)] bg-black/20 p-4"
            >
              <p className="text-sm text-[var(--muted)]">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {(item.value * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {counts.map((item) => (
            <Badge key={item.label} tone={item.tone} className="px-4 py-2 text-sm tracking-[0.12em]">
              {item.label} {item.value}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
