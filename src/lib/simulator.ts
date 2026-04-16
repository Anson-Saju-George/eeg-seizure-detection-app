import { calculateThresholdMetrics } from "@/lib/metrics";
import { clamp, mulberry32 } from "@/lib/seeded";
import { runMockInference } from "@/services/inferenceService";
import type {
  ModelConfig,
  PredictionRow,
  SimulatedFeatureRow,
  ThresholdRow,
} from "@/types/artifacts";

export type OutcomeFilter = "ALL" | "TP" | "TN" | "FP" | "FN";

export function findNearestThresholdRow(
  rows: ThresholdRow[],
  threshold: number,
) {
  return rows.reduce((closest, current) => {
    return Math.abs(current.threshold - threshold) <
      Math.abs(closest.threshold - threshold)
      ? current
      : closest;
  }, rows[0] ?? calculateThresholdMetrics([], threshold));
}

export function filterPredictionsByOutcome(
  predictions: PredictionRow[],
  threshold: number,
  filter: OutcomeFilter,
) {
  return predictions.filter((row) => {
    const predictedPositive = row.pred_probability >= threshold;
    const actualPositive = row.true_label === 1;

    if (filter === "ALL") return true;
    if (filter === "TP") return predictedPositive && actualPositive;
    if (filter === "TN") return !predictedPositive && !actualPositive;
    if (filter === "FP") return predictedPositive && !actualPositive;
    return !predictedPositive && actualPositive;
  });
}

export function perturbFeatureValues(
  values: number[],
  selectedIndices: number[],
  mode: "plus5" | "minus5" | "plus10" | "minus10" | "noise" | "reset",
  baseline: number[],
  seed: number,
) {
  if (mode === "reset") {
    return [...baseline];
  }

  const random = mulberry32(seed);

  return values.map((value, index) => {
    if (!selectedIndices.includes(index)) return value;

    if (mode === "noise") {
      return clamp(value + (random() - 0.5) * 0.12);
    }

    const factor =
      mode === "plus5"
        ? 1.05
        : mode === "minus5"
          ? 0.95
          : mode === "plus10"
            ? 1.1
            : 0.9;

    return clamp(value * factor);
  });
}

export function evaluateSensitivity(
  featureRow: SimulatedFeatureRow,
  values: number[],
  baseline: number[],
  config: ModelConfig,
  threshold: number,
) {
  const baselineResult = runMockInference(baseline, config, threshold);
  const updatedResult = runMockInference(values, config, threshold);

  const topChanged = values
    .map((value, index) => ({
      featureIndex: index,
      before: baseline[index],
      after: value,
      delta: value - baseline[index],
    }))
    .sort((left, right) => Math.abs(right.delta) - Math.abs(left.delta))
    .slice(0, 8);

  return {
    sampleIndex: featureRow.sampleIndex,
    baselineResult,
    updatedResult,
    deltaProbability: updatedResult.probability - baselineResult.probability,
    topChanged,
  };
}

export function buildScenarioComparisons(
  features: SimulatedFeatureRow[],
  config: ModelConfig,
  range: [number, number],
  thresholds: number[],
) {
  const selected = features.filter(
    (row) => row.sampleIndex >= range[0] && row.sampleIndex <= range[1],
  );

  return thresholds.map((threshold) => {
    const flagged = selected.filter((row) => {
      const result = runMockInference(row.values, config, threshold);
      return result.label === 1;
    }).length;

    return {
      threshold,
      flagged,
      total: selected.length,
    };
  });
}
