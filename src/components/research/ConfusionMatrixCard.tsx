import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ThresholdRow } from "@/types/artifacts";

const colorMaps = {
  coolwarm: ["#67a9cf", "#d6604d"],
  viridis: ["#443983", "#9bd93c"],
  plasma: ["#5c01a6", "#fdb42f"],
  inferno: ["#240046", "#f6d746"],
  blues: ["#1d4ed8", "#93c5fd"],
} as const;

export type MatrixColorMap = keyof typeof colorMaps;

export function ConfusionMatrixCard({
  metrics,
  colorMap,
  onColorMapChange,
}: {
  metrics: ThresholdRow;
  colorMap: MatrixColorMap;
  onColorMapChange: (value: MatrixColorMap) => void;
}) {
  const values = useMemo(
    () => [
      { label: "TN", value: metrics.tn, tone: "success" as const },
      { label: "FP", value: metrics.fp, tone: "warning" as const },
      { label: "FN", value: metrics.fn, tone: "danger" as const },
      { label: "TP", value: metrics.tp, tone: "info" as const },
    ],
    [metrics],
  );

  const maxValue = Math.max(...values.map((entry) => entry.value), 1);
  const [lowColor, highColor] = colorMaps[colorMap];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle>Confusion Matrix</CardTitle>
          <select
            value={colorMap}
            onChange={(event) => onColorMapChange(event.target.value as MatrixColorMap)}
            className="rounded-2xl border border-[var(--border)] bg-black/20 px-3 py-2 text-sm text-white"
          >
            {Object.keys(colorMaps).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {values.map((entry, index) => {
            const intensity = entry.value / maxValue;
            const gradient =
              index % 2 === 0
                ? `linear-gradient(135deg, ${lowColor}22, ${highColor}${Math.round(
                    40 + intensity * 120,
                  ).toString(16)})`
                : `linear-gradient(135deg, ${highColor}22, ${lowColor}${Math.round(
                    40 + intensity * 120,
                  ).toString(16)})`;

            return (
              <div
                key={entry.label}
                className="rounded-3xl border border-[var(--border)] p-5"
                style={{ background: gradient }}
              >
                <p className="text-sm text-[var(--muted)]">{entry.label}</p>
                <p className="mt-2 text-3xl font-semibold text-white">{entry.value}</p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          {values.map((entry) => (
            <Badge key={entry.label} tone={entry.tone} className="px-4 py-2 text-sm tracking-[0.12em]">
              {entry.label} {entry.value}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
