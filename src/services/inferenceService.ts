import { clamp, mulberry32 } from "@/lib/seeded";
import { apiClient } from "@/services/apiClient";
import { hasBackendConfigured } from "@/services/appConfig";
import type { ModelConfig, SimulatedFeatureRow } from "@/types/artifacts";

export interface InferenceResult {
  probability: number;
  label: number;
  confidenceBand: "Low" | "Medium" | "High";
  mode?: "local" | "backend" | "fallback";
  detail?: string;
}

function getConfidenceBand(probability: number) {
  if (probability >= 0.75) return "High" as const;
  if (probability >= 0.4) return "Medium" as const;
  return "Low" as const;
}

function buildWeights(inputDim: number, seed: number) {
  const random = mulberry32(seed);
  return Array.from({ length: inputDim }, (_, index) => {
    const base = (random() - 0.5) * 0.9;
    const shaped = Math.sin((index + 1) * 0.19) * 0.3 + base;
    return shaped;
  });
}

function sigmoid(value: number) {
  return 1 / (1 + Math.exp(-value));
}

export function runMockInference(
  values: number[],
  config: ModelConfig,
  threshold = config.best_threshold,
): InferenceResult {
  const weights = buildWeights(config.input_dim, config.seed ?? 42);
  const effectiveValues =
    values.length >= config.input_dim
      ? values.slice(0, config.input_dim)
      : [...values, ...Array.from({ length: config.input_dim - values.length }, () => 0.5)];

  const centered = effectiveValues.map((value) => value - 0.5);
  const weighted = centered.reduce(
    (sum, value, index) => sum + value * weights[index],
    0,
  );
  const energy =
    centered.reduce((sum, value) => sum + Math.abs(value), 0) / config.input_dim;
  const signal = weighted / Math.sqrt(config.input_dim) + energy * 1.8 - 0.15;
  const probability = clamp(sigmoid(signal));

  return {
    probability,
    label: probability >= threshold ? 1 : 0,
    confidenceBand: getConfidenceBand(probability),
  };
}

export function runMockBatchInference(
  rows: SimulatedFeatureRow[],
  config: ModelConfig,
  threshold = config.best_threshold,
) {
  return rows.map((row) => ({
    sampleIndex: row.sampleIndex,
    ...runMockInference(row.values, config, threshold),
  }));
}

export async function predictSingle(
  values: number[],
  config: ModelConfig,
  threshold = config.best_threshold,
): Promise<InferenceResult> {
  if (!hasBackendConfigured()) {
    return {
      ...runMockInference(values, config, threshold),
      mode: "local",
      detail: "Local deterministic mock inference",
    };
  }

  try {
    const response = await apiClient.post<{
      probability: number;
      label: number;
      threshold: number;
      confidence_band: "Low" | "Medium" | "High";
      mode: string;
      detail?: string;
    }>("/predict", {
      features: values,
      threshold,
    });

    return {
      probability: response.probability,
      label: response.label,
      confidenceBand: response.confidence_band,
      mode: "backend",
      detail: response.detail,
    };
  } catch {
    return {
      ...runMockInference(values, config, threshold),
      mode: "fallback",
      detail: "Backend inference unavailable. Falling back to local deterministic mock inference.",
    };
  }
}

export async function predictBatch(
  rows: SimulatedFeatureRow[],
  config: ModelConfig,
  threshold = config.best_threshold,
) {
  if (!hasBackendConfigured()) {
    return runMockBatchInference(rows, config, threshold).map((item) => ({
      ...item,
      mode: "local" as const,
    }));
  }

  try {
    const response = await apiClient.post<{
      items: Array<{
        probability: number;
        label: number;
        threshold: number;
        confidence_band: "Low" | "Medium" | "High";
        detail?: string;
      }>;
    }>("/predict-batch", {
      items: rows.map((row) => ({
        features: row.values,
        threshold,
      })),
    });

    return response.items.map((item, index) => ({
      sampleIndex: rows[index]?.sampleIndex ?? index,
      probability: item.probability,
      label: item.label,
      confidenceBand: item.confidence_band,
      mode: "backend" as const,
      detail: item.detail,
    }));
  } catch {
    return runMockBatchInference(rows, config, threshold).map((item) => ({
      ...item,
      mode: "fallback" as const,
      detail: "Backend batch inference unavailable. Using local deterministic mock inference.",
    }));
  }
}

export function applyRiskPreset(
  values: number[],
  config: ModelConfig,
  preset: "Low" | "Medium" | "High",
  threshold = config.best_threshold,
) {
  const weights = buildWeights(config.input_dim, config.seed ?? 42);
  const target =
    preset === "Low" ? 0.2 : preset === "Medium" ? Math.min(0.55, threshold - 0.02) : 0.82;
  const next = [...values];

  for (let iteration = 0; iteration < 22; iteration += 1) {
    const current = runMockInference(next, config, threshold).probability;
    const error = target - current;
    if (Math.abs(error) < 0.035) break;

    for (let index = 0; index < next.length; index += 1) {
      const direction = weights[index] >= 0 ? 1 : -1;
      next[index] = clamp(next[index] + direction * error * 0.09);
    }
  }

  return next;
}
