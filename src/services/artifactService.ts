import Papa from "papaparse";

import { buildThresholdSweep } from "@/lib/metrics";
import { clamp, mulberry32 } from "@/lib/seeded";
import { apiClient } from "@/services/apiClient";
import { hasBackendConfigured } from "@/services/appConfig";
import type {
  ArtifactBundle,
  ArtifactRecord,
  HistoryRow,
  ModelConfig,
  PredictionRow,
  SimulatedFeatureRow,
  ThresholdRow,
} from "@/types/artifacts";

const DATA_ROOT = "/data";

const DATA_FILES = [
  "config.json",
  "history.csv",
  "test_predictions.csv",
  "threshold_table.csv",
  "class_distribution.png",
  "confusion_matrix.png",
  "loss_per_epoch.png",
  "smoothed_threshold_curve.png",
  "test_precision_recall.png",
  "test_roc.png",
  "train_vs_val.png",
  "train_vs_val_roc.png",
  "preprocessing.joblib",
  "seizure_mlp_state_dict.pt",
] as const;

const DEFAULT_CONFIG: ModelConfig = {
  input_dim: 178,
  hidden_dims: [256, 128, 64],
  dropout: 0.25,
  best_threshold: 0.63,
  seed: 42,
  csv_path: "Epileptic Seizure Recognition.csv",
};

async function fetchText(path: string) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Unable to load ${path}`);
  }
  return response.text();
}

async function fetchJson<T>(path: string) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Unable to load ${path}`);
  }
  return (await response.json()) as T;
}

async function loadOptionalJson<T>(path: string) {
  try {
    return await fetchJson<T>(path);
  } catch {
    return null;
  }
}

async function loadOptionalCsv<T>(
  path: string,
  transform: (row: Record<string, string>, index: number) => T,
) {
  try {
    const text = await fetchText(path);
    const parsed = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
    });
    return parsed.data.map(transform);
  } catch {
    return null;
  }
}

function parseNumber(value: string | number | undefined, fallback = 0) {
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function normalizeConfig(input: Partial<ModelConfig> | null): ModelConfig {
  if (!input) return DEFAULT_CONFIG;

  return {
    input_dim: parseNumber(input.input_dim, DEFAULT_CONFIG.input_dim),
    hidden_dims: Array.isArray(input.hidden_dims)
      ? input.hidden_dims.map((value) => parseNumber(value))
      : DEFAULT_CONFIG.hidden_dims,
    dropout: parseNumber(input.dropout, DEFAULT_CONFIG.dropout),
    best_threshold: parseNumber(
      input.best_threshold,
      DEFAULT_CONFIG.best_threshold,
    ),
    seed: parseNumber(input.seed, DEFAULT_CONFIG.seed ?? 42),
    csv_path: input.csv_path ?? DEFAULT_CONFIG.csv_path,
  };
}

function buildArtifactRecords() {
  return DATA_FILES.map<ArtifactRecord>((name) => {
    const extension = name.split(".").pop() ?? "";
    const kind =
      extension === "json"
        ? "json"
        : extension === "csv"
          ? "csv"
          : ["png", "jpg", "jpeg", "svg"].includes(extension)
            ? "image"
            : ["pt", "joblib"].includes(extension)
              ? "binary"
              : "unknown";

    return {
      name,
      path: `${DATA_ROOT}/${name}`,
      available: false,
      kind,
    };
  });
}

function generateMockFeatureVectors(
  predictions: PredictionRow[],
  config: ModelConfig,
): SimulatedFeatureRow[] {
  const seed = config.seed ?? 42;

  return predictions.map((row) => {
    const random = mulberry32(seed + row.sampleIndex * 17);
    const values = Array.from({ length: config.input_dim }, (_, featureIndex) => {
      const wave = Math.sin((row.sampleIndex + 1) * (featureIndex + 1) * 0.018);
      const bias = row.true_label === 1 ? 0.18 : -0.12;
      const noise = (random() - 0.5) * 0.22;
      const shaped =
        0.5 + wave * 0.26 + noise + row.pred_probability * 0.3 + bias;
      return Number(clamp(shaped, 0, 1).toFixed(6));
    });

    return {
      sampleIndex: row.sampleIndex,
      values,
    };
  });
}

async function loadLocalArtifactBundle(): Promise<ArtifactBundle> {
  const warnings: string[] = [];
  const artifacts = buildArtifactRecords();

  const config = normalizeConfig(
    await loadOptionalJson<Partial<ModelConfig>>(`${DATA_ROOT}/config.json`),
  );

  if (config === DEFAULT_CONFIG) {
    warnings.push("config.json was missing. Default config values are in use.");
  } else {
    artifacts.find((entry) => entry.name === "config.json")!.available = true;
  }

  const history =
    (await loadOptionalCsv<HistoryRow>(`${DATA_ROOT}/history.csv`, (row) => ({
      epoch: parseNumber(row.epoch),
      train_loss: parseNumber(row.train_loss),
      train_accuracy: parseNumber(row.train_accuracy),
      train_f1: parseNumber(row.train_f1),
      train_roc_auc: parseNumber(row.train_roc_auc),
      val_accuracy: parseNumber(row.val_accuracy),
      val_f1: parseNumber(row.val_f1),
      val_roc_auc: parseNumber(row.val_roc_auc),
      lr: parseNumber(row.lr),
    }))) ?? [];

  if (history.length > 0) {
    artifacts.find((entry) => entry.name === "history.csv")!.available = true;
  } else {
    warnings.push("history.csv was missing. Training history panels will use empty states.");
  }

  const predictions =
    (await loadOptionalCsv<PredictionRow>(
      `${DATA_ROOT}/test_predictions.csv`,
      (row, index) => ({
        sampleIndex: index,
        true_label: parseNumber(row.true_label),
        pred_probability: parseNumber(row.pred_probability),
        pred_label: parseNumber(row.pred_label),
      }),
    )) ?? [];

  if (predictions.length > 0) {
    artifacts.find((entry) => entry.name === "test_predictions.csv")!.available = true;
  } else {
    warnings.push(
      "test_predictions.csv was missing. Prediction-driven playback will use fallback empty states.",
    );
  }

  const thresholdRows =
    (await loadOptionalCsv<ThresholdRow>(
      `${DATA_ROOT}/threshold_table.csv`,
      (row) => ({
        threshold: parseNumber(row.threshold),
        tp: parseNumber(row.tp),
        tn: parseNumber(row.tn),
        fp: parseNumber(row.fp),
        fn: parseNumber(row.fn),
        precision: parseNumber(row.precision),
        recall: parseNumber(row.recall),
        f1: parseNumber(row.f1),
        balanced_accuracy: parseNumber(
          row.balanced_accuracy ?? row.balancedAccuracy,
        ),
      }),
    )) ?? buildThresholdSweep(predictions);

  if (thresholdRows.length > 0) {
    const thresholdFile = artifacts.find(
      (entry) => entry.name === "threshold_table.csv",
    );
    if (thresholdFile) {
      thresholdFile.available = true;
    }
  } else {
    warnings.push(
      "No threshold data was available. Threshold analytics will fall back to defaults.",
    );
  }

  const simulatedFeatures = generateMockFeatureVectors(predictions, config);
  const positiveCount = predictions.filter((row) => row.true_label === 1).length;
  const predictionCount = predictions.length;
  const averageProbability =
    predictionCount === 0
      ? 0
      : predictions.reduce((sum, row) => sum + row.pred_probability, 0) /
        predictionCount;

  for (const artifact of artifacts) {
    if (artifact.available) continue;
    if (
      ["config.json", "history.csv", "test_predictions.csv", "threshold_table.csv"].includes(
        artifact.name,
      )
    ) {
      continue;
    }

    try {
      const response = await fetch(artifact.path, { method: "HEAD" });
      artifact.available = response.ok;
    } catch {
      artifact.available = false;
    }
  }

  return {
    config,
    history,
    predictions,
    thresholds: thresholdRows,
    simulatedFeatures,
    artifacts,
    summary: {
      historyCount: history.length,
      predictionCount,
      positiveCount,
      negativeCount: predictionCount - positiveCount,
      averageProbability,
      threshold: config.best_threshold,
    },
    sourceMode: "local",
    warnings,
  };
}

async function loadBackendArtifactBundle(): Promise<ArtifactBundle> {
  const warnings: string[] = [];
  const artifacts = buildArtifactRecords();

  const [configResponse, historyResponse, predictionsResponse, thresholdResponse] =
    await Promise.all([
      apiClient.get<{
        available: boolean;
        data: Partial<ModelConfig> | null;
        source: string;
      }>("/artifacts/config"),
      apiClient.get<{
        available: boolean;
        count: number;
        data: HistoryRow[];
        source: string;
      }>("/artifacts/history"),
      apiClient.get<{
        available: boolean;
        count: number;
        data: Array<Omit<PredictionRow, "sampleIndex">>;
        source: string;
      }>("/artifacts/test-predictions"),
      apiClient.get<{
        available: boolean;
        count: number;
        data: ThresholdRow[];
        source: string;
      }>("/artifacts/threshold-table"),
    ]);

  const config = normalizeConfig(configResponse.data);
  const history = historyResponse.data ?? [];
  const predictions = (predictionsResponse.data ?? []).map((row, index) => ({
    sampleIndex: index,
    true_label: parseNumber(row.true_label),
    pred_probability: parseNumber(row.pred_probability),
    pred_label: parseNumber(row.pred_label),
  }));
  const thresholds =
    thresholdResponse.available && thresholdResponse.data.length > 0
      ? thresholdResponse.data
      : buildThresholdSweep(predictions);

  artifacts.find((entry) => entry.name === "config.json")!.available =
    configResponse.available;
  artifacts.find((entry) => entry.name === "history.csv")!.available =
    historyResponse.available;
  artifacts.find((entry) => entry.name === "test_predictions.csv")!.available =
    predictionsResponse.available;
  artifacts.find((entry) => entry.name === "threshold_table.csv")!.available =
    thresholdResponse.available;

  if (!thresholdResponse.available) {
    warnings.push("Backend threshold table was unavailable. Derived threshold sweep is in use.");
  }

  const simulatedFeatures = generateMockFeatureVectors(predictions, config);
  const positiveCount = predictions.filter((row) => row.true_label === 1).length;
  const predictionCount = predictions.length;
  const averageProbability =
    predictionCount === 0
      ? 0
      : predictions.reduce((sum, row) => sum + row.pred_probability, 0) /
        predictionCount;

  return {
    config,
    history,
    predictions,
    thresholds,
    simulatedFeatures,
    artifacts,
    summary: {
      historyCount: history.length,
      predictionCount,
      positiveCount,
      negativeCount: predictionCount - positiveCount,
      averageProbability,
      threshold: config.best_threshold,
    },
    sourceMode: "backend",
    warnings,
  };
}

export async function loadArtifactBundle(): Promise<ArtifactBundle> {
  if (!hasBackendConfigured()) {
    return loadLocalArtifactBundle();
  }

  try {
    return await loadBackendArtifactBundle();
  } catch {
    const localBundle = await loadLocalArtifactBundle();
    return {
      ...localBundle,
      sourceMode: "fallback",
      warnings: [
        "Backend artifact mode was unavailable. Falling back to local public/data files.",
        ...localBundle.warnings,
      ],
    };
  }
}
