export interface ModelConfig {
  input_dim: number;
  hidden_dims: number[];
  dropout: number;
  best_threshold: number;
  seed?: number;
  csv_path?: string;
}

export interface HistoryRow {
  epoch: number;
  train_loss: number;
  train_accuracy: number;
  train_f1: number;
  train_roc_auc: number;
  val_accuracy: number;
  val_f1: number;
  val_roc_auc: number;
  lr: number;
}

export interface PredictionRow {
  sampleIndex: number;
  true_label: number;
  pred_probability: number;
  pred_label: number;
}

export interface ThresholdRow {
  threshold: number;
  tp: number;
  tn: number;
  fp: number;
  fn: number;
  precision: number;
  recall: number;
  f1: number;
  balanced_accuracy: number;
}

export interface SimulatedFeatureRow {
  sampleIndex: number;
  values: number[];
}

export interface ArtifactRecord {
  name: string;
  path: string;
  available: boolean;
  kind: "json" | "csv" | "image" | "binary" | "unknown";
}

export interface ArtifactBundle {
  config: ModelConfig;
  history: HistoryRow[];
  predictions: PredictionRow[];
  thresholds: ThresholdRow[];
  simulatedFeatures: SimulatedFeatureRow[];
  artifacts: ArtifactRecord[];
  summary: {
    historyCount: number;
    predictionCount: number;
    positiveCount: number;
    negativeCount: number;
    averageProbability: number;
    threshold: number;
  };
  sourceMode: "local" | "backend" | "fallback";
  warnings: string[];
}
