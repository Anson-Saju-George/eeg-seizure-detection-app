import type { PredictionRow, ThresholdRow } from "@/types/artifacts";

function safeDivide(numerator: number, denominator: number) {
  return denominator === 0 ? 0 : numerator / denominator;
}

export function calculateThresholdMetrics(
  predictions: PredictionRow[],
  threshold: number,
): ThresholdRow {
  let tp = 0;
  let tn = 0;
  let fp = 0;
  let fn = 0;

  for (const row of predictions) {
    const predictedPositive = row.pred_probability >= threshold;
    const actualPositive = row.true_label === 1;

    if (predictedPositive && actualPositive) tp += 1;
    else if (!predictedPositive && !actualPositive) tn += 1;
    else if (predictedPositive) fp += 1;
    else fn += 1;
  }

  const precision = safeDivide(tp, tp + fp);
  const recall = safeDivide(tp, tp + fn);
  const f1 = safeDivide(2 * precision * recall, precision + recall);
  const specificity = safeDivide(tn, tn + fp);

  return {
    threshold,
    tp,
    tn,
    fp,
    fn,
    precision,
    recall,
    f1,
    balanced_accuracy: (recall + specificity) / 2,
  };
}

export function buildThresholdSweep(predictions: PredictionRow[]) {
  const thresholds = Array.from({ length: 101 }, (_, index) => index / 100);
  return thresholds.map((threshold) =>
    calculateThresholdMetrics(predictions, threshold),
  );
}
