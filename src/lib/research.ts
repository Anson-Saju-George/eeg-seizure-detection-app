import { buildThresholdSweep, calculateThresholdMetrics } from "@/lib/metrics";
import type { ArtifactBundle, PredictionRow, ThresholdRow } from "@/types/artifacts";

function safeDivide(numerator: number, denominator: number) {
  return denominator === 0 ? 0 : numerator / denominator;
}

function buildCurvePoints(predictions: PredictionRow[]) {
  const thresholds = Array.from({ length: 101 }, (_, index) => index / 100).reverse();

  const roc = thresholds.map((threshold) => {
    const metrics = calculateThresholdMetrics(predictions, threshold);
    const tpr = metrics.recall;
    const fpr = safeDivide(metrics.fp, metrics.fp + metrics.tn);

    return {
      threshold,
      tpr,
      fpr,
    };
  });

  const pr = thresholds.map((threshold) => {
    const metrics = calculateThresholdMetrics(predictions, threshold);
    return {
      threshold,
      precision: metrics.precision,
      recall: metrics.recall,
    };
  });

  return { roc, pr };
}

function trapezoidArea(points: Array<{ x: number; y: number }>) {
  if (points.length < 2) return 0;

  let area = 0;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    area += (current.x - previous.x) * ((current.y + previous.y) / 2);
  }
  return Math.abs(area);
}

function buildHistogram(predictions: PredictionRow[]) {
  const buckets = Array.from({ length: 10 }, (_, index) => ({
    bucket: `${(index / 10).toFixed(1)}-${((index + 1) / 10).toFixed(1)}`,
    nonSeizure: 0,
    seizure: 0,
  }));

  for (const row of predictions) {
    const bucketIndex = Math.min(9, Math.floor(row.pred_probability * 10));
    if (row.true_label === 1) buckets[bucketIndex].seizure += 1;
    else buckets[bucketIndex].nonSeizure += 1;
  }

  return buckets;
}

function isFiniteThresholdRow(row: ThresholdRow) {
  return [
    row.threshold,
    row.tp,
    row.tn,
    row.fp,
    row.fn,
    row.precision,
    row.recall,
    row.f1,
    row.balanced_accuracy,
  ].every((value) => Number.isFinite(value));
}

function validateThresholdSweep(
  predictions: PredictionRow[],
  thresholdRows: ThresholdRow[],
) {
  const derived = buildThresholdSweep(predictions);

  if (thresholdRows.length === 0) {
    return {
      sweep: derived,
      source: "derived" as const,
      warning: "Threshold table was empty. Using derived threshold sweep from test predictions.",
    };
  }

  const sanitized = thresholdRows
    .filter(isFiniteThresholdRow)
    .sort((left, right) => left.threshold - right.threshold);

  if (sanitized.length === 0) {
    return {
      sweep: derived,
      source: "derived" as const,
      warning: "Threshold table contained invalid values. Using derived threshold sweep instead.",
    };
  }

  const bestProvided = sanitized.reduce((best, current) =>
    current.f1 > best.f1 ? current : best,
  );
  const bestDerived = derived.reduce((best, current) =>
    current.f1 > best.f1 ? current : best,
  );

  if (Math.abs(bestProvided.f1 - bestDerived.f1) > 0.05) {
    return {
      sweep: derived,
      source: "derived" as const,
      warning: "Threshold table disagreed with derived metrics. Using derived threshold sweep from predictions.",
    };
  }

  return {
    sweep: sanitized,
    source: "artifact" as const,
    warning: null,
  };
}

export function deriveResearchMetrics(bundle: ArtifactBundle) {
  const bestThreshold = bundle.config.best_threshold;
  const confusion = calculateThresholdMetrics(bundle.predictions, bestThreshold);
  const curves = buildCurvePoints(bundle.predictions);
  const validatedSweep = validateThresholdSweep(bundle.predictions, bundle.thresholds);

  const rocAuc = trapezoidArea(
    curves.roc
      .map((point) => ({ x: point.fpr, y: point.tpr }))
      .sort((left, right) => left.x - right.x),
  );

  const prAuc = trapezoidArea(
    curves.pr
      .map((point) => ({ x: point.recall, y: point.precision }))
      .sort((left, right) => left.x - right.x),
  );

  const thresholdBest =
    validatedSweep.sweep.reduce(
      (best, current) => (current.f1 > best.f1 ? current : best),
      validatedSweep.sweep[0] ?? confusion,
    );

  return {
    confusion,
    rocCurve: curves.roc,
    prCurve: curves.pr,
    histogram: buildHistogram(bundle.predictions),
    thresholdSweep: validatedSweep.sweep,
    thresholdSweepSource: validatedSweep.source,
    thresholdWarning: validatedSweep.warning,
    rocAuc,
    prAuc,
    bestF1Threshold: thresholdBest.threshold,
    bestF1: thresholdBest.f1,
  };
}
