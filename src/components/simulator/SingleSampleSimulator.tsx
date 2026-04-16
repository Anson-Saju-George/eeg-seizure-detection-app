import { useMemo } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InferenceResult } from "@/services/inferenceService";
import type { PredictionRow, SimulatedFeatureRow } from "@/types/artifacts";

const FEATURE_LABELS = [
  "Band power proxy",
  "Spike density proxy",
  "Temporal variance",
  "Rhythmicity score",
  "Burst contrast",
  "Signal energy",
  "Peak spread",
  "Envelope drift",
  "Asymmetry index",
  "Frequency skew",
  "Transient activity",
  "Window entropy",
];

export function SingleSampleSimulator({
  sample,
  prediction,
  featureValues,
  result,
  selectedSample,
  sampleOptions,
  onSampleChange,
  onFeatureChange,
}: {
  sample: SimulatedFeatureRow | undefined;
  prediction: PredictionRow | undefined;
  featureValues: number[];
  result: InferenceResult;
  selectedSample: number;
  sampleOptions: number[];
  onSampleChange: (value: number) => void;
  onFeatureChange: (index: number, value: number) => void;
}) {
  const visibleFeatures = useMemo(() => featureValues.slice(0, 12), [featureValues]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Single-Sample Prediction Simulator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-[180px_1fr]">
          <label className="space-y-2 text-sm">
            <span className="text-[var(--muted)]">Sample</span>
            <select
              value={selectedSample}
              onChange={(event) => onSampleChange(Number(event.target.value))}
              className="w-full rounded-2xl border border-[var(--border)] bg-black/20 px-3 py-3 text-white"
            >
              {sampleOptions.map((value) => {
                return (
                  <option key={value} value={value}>
                    Sample {value}
                  </option>
                );
              })}
            </select>
          </label>

          <div className="grid gap-3 sm:grid-cols-3">
            <Metric label="Mock Risk" value={`${(result.probability * 100).toFixed(1)}%`} />
            <Metric label="Predicted Label" value={result.label === 1 ? "Seizure" : "Non-seizure"} />
            <Metric label="Confidence" value={result.confidenceBand} />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-black/20 p-4 text-sm text-[var(--muted-foreground)]">
          These are synthetic feature controls, not raw EEG channels. The simulator exposes 12
          representative features from a larger engineered vector for interactive demo use.
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visibleFeatures.map((value, index) => (
            <label key={index} className="space-y-2 rounded-2xl border border-[var(--border)] bg-black/20 p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">
                  {FEATURE_LABELS[index] ?? `Synthetic feature ${index + 1}`}
                </span>
                <span className="text-monitor text-white">{value.toFixed(3)}</span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">Feature {index + 1}</p>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={value}
                onChange={(event) => onFeatureChange(index, Number(event.target.value))}
                className="w-full accent-[var(--primary)]"
              />
            </label>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Metric
            label="Saved Probability"
            value={prediction ? prediction.pred_probability.toFixed(4) : "--"}
          />
          <Metric label="Source Row" value={sample ? String(sample.sampleIndex) : "--"} />
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-black/20 p-4">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}
