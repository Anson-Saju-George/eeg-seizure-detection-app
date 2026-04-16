import { useEffect, useState } from "react";

import { PlaybackSimulatorPanel } from "@/components/simulator/PlaybackSimulatorPanel";
import { BatchScenarioSimulator } from "@/components/simulator/BatchScenarioSimulator";
import { ConfidenceSimulator } from "@/components/simulator/ConfidenceSimulator";
import { FeatureSensitivitySimulator } from "@/components/simulator/FeatureSensitivitySimulator";
import { OutcomeExplorer } from "@/components/simulator/OutcomeExplorer";
import { SingleSampleSimulator } from "@/components/simulator/SingleSampleSimulator";
import { ThresholdSimulator } from "@/components/simulator/ThresholdSimulator";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useArtifactBundle } from "@/hooks/useArtifactBundle";
import { usePlaybackEngine } from "@/hooks/usePlaybackEngine";
import {
  buildScenarioComparisons,
  evaluateSensitivity,
  filterPredictionsByOutcome,
  findNearestThresholdRow,
  perturbFeatureValues,
  type OutcomeFilter,
} from "@/lib/simulator";
import {
  applyRiskPreset as applyRiskPresetValues,
  predictBatch,
  predictSingle,
  runMockInference,
} from "@/services/inferenceService";

export function SimulatorPage() {
  const { data, error, isLoading } = useArtifactBundle();
  const predictions = data?.predictions ?? [];
  const defaultThreshold = data?.config.best_threshold ?? 0.63;
  const playback = usePlaybackEngine(predictions, defaultThreshold);
  const [selectedSample, setSelectedSample] = useState(0);
  const [featureValues, setFeatureValues] = useState<number[]>([]);
  const [outcomeFilter, setOutcomeFilter] = useState<OutcomeFilter>("ALL");
  const [query, setQuery] = useState("");
  const [predictedResult, setPredictedResult] = useState<Awaited<ReturnType<typeof predictSingle>> | null>(null);
  const [scenarioData, setScenarioData] = useState<Array<{ threshold: number; flagged: number; total: number }>>([]);
  const simulatorConfig = data?.config;
  const simulatedFeatures = data?.simulatedFeatures ?? [];

  const selectedFeatureRow = data?.simulatedFeatures.find(
    (row) => row.sampleIndex === selectedSample,
  );
  const selectedPrediction = data?.predictions.find(
    (row) => row.sampleIndex === selectedSample,
  );

  useEffect(() => {
    if (selectedFeatureRow) {
      setFeatureValues(selectedFeatureRow.values);
    }
  }, [selectedFeatureRow]);

  useEffect(() => {
    let cancelled = false;

    async function runPrediction() {
      if (!simulatorConfig) {
        setPredictedResult(null);
        return;
      }

      const values =
        featureValues.length > 0 ? featureValues : selectedFeatureRow?.values ?? [];
      const result = await predictSingle(values, simulatorConfig, playback.activeThreshold);
      if (!cancelled) {
        setPredictedResult(result);
      }
    }

    runPrediction();
    return () => {
      cancelled = true;
    };
  }, [featureValues, playback.activeThreshold, selectedFeatureRow, simulatorConfig]);

  useEffect(() => {
    let cancelled = false;

    async function runBatchSimulation() {
      if (!simulatorConfig || simulatedFeatures.length === 0) {
        setScenarioData([]);
        return;
      }

      const selectedRows = simulatedFeatures.filter(
        (row) =>
          row.sampleIndex >= selectedSample &&
          row.sampleIndex <= Math.min(selectedSample + 60, simulatedFeatures.length - 1),
      );
      const thresholds = [
        Math.max(0.05, playback.activeThreshold - 0.1),
        playback.activeThreshold,
        Math.min(0.95, playback.activeThreshold + 0.1),
      ];

      const comparisons = await Promise.all(
        thresholds.map(async (threshold) => {
          const results = await predictBatch(selectedRows, simulatorConfig, threshold);
          return {
            threshold,
            flagged: results.filter((item) => item.label === 1).length,
            total: selectedRows.length,
          };
        }),
      );

      if (!cancelled) {
        setScenarioData(comparisons);
      }
    }

    runBatchSimulation();
    return () => {
      cancelled = true;
    };
  }, [playback.activeThreshold, selectedSample, simulatedFeatures, simulatorConfig]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Badge tone="info" className="w-fit">
            Loading
          </Badge>
          <CardTitle>Preparing simulator modules</CardTitle>
          <CardDescription>Loading artifacts and deterministic mock feature rows.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-[rgba(255,107,122,0.24)]">
        <CardHeader>
          <Badge tone="danger" className="w-fit">
            Load Error
          </Badge>
          <CardTitle>Simulator unavailable</CardTitle>
          <CardDescription>{error ?? "Unable to load simulator data."}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-[var(--muted-foreground)]">
          The page stays safe and can be retried once artifact loading succeeds.
        </CardContent>
      </Card>
    );
  }

  const sampleOptions = Array.from(
    new Set(
      Array.from({ length: 20 }, (_, index) =>
        Math.min(
          Math.round((index / 19) * Math.max(data.predictions.length - 1, 0)),
          Math.max(data.predictions.length - 1, 0),
        ),
      ),
    ),
  );

  const nearestThresholdMetrics = findNearestThresholdRow(
    data.thresholds,
    playback.activeThreshold,
  );

  const mockResult =
    predictedResult ??
    ({
      ...runMockInference(
        featureValues.length > 0 ? featureValues : selectedFeatureRow?.values ?? [],
        data.config,
        playback.activeThreshold,
      ),
      mode: "local",
    } as Awaited<ReturnType<typeof predictSingle>>);

  const sensitivity = selectedFeatureRow
    ? evaluateSensitivity(
        selectedFeatureRow,
        featureValues,
        selectedFeatureRow.values,
        data.config,
        playback.activeThreshold,
      )
    : null;

  const effectiveScenarioData =
    scenarioData.length > 0
      ? scenarioData
      : buildScenarioComparisons(
          data.simulatedFeatures,
          data.config,
          [selectedSample, Math.min(selectedSample + 60, data.simulatedFeatures.length - 1)],
          [
            Math.max(0.05, playback.activeThreshold - 0.1),
            playback.activeThreshold,
            Math.min(0.95, playback.activeThreshold + 0.1),
          ],
        );

  const outcomeRows = filterPredictionsByOutcome(
    data.predictions,
    playback.activeThreshold,
    outcomeFilter,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <Badge tone="warning" className="w-fit">
            Interactive lab
          </Badge>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Simulator workspace
          </h2>
          <p className="max-w-3xl text-[var(--muted-foreground)]">
            Simulator prediction can use the backend when configured, with graceful
            fallback to deterministic local mock inference. This is a research/demo
            simulator only, not clinical inference.
          </p>
        </div>
        <Badge tone="info">
          {mockResult.mode === "backend"
            ? "Backend prediction mode"
            : mockResult.mode === "fallback"
              ? "Fallback prediction mode"
              : "Local prediction mode"}
        </Badge>
      </div>

      <AlertBanner
        status={
          mockResult.probability >= playback.activeThreshold
            ? "HIGH RISK"
            : mockResult.probability >= Math.max(0, playback.activeThreshold - 0.1)
              ? "WARNING"
              : "NORMAL"
        }
        probability={mockResult.probability}
        threshold={playback.activeThreshold}
      />

      <ThresholdSimulator
        metrics={nearestThresholdMetrics}
        threshold={playback.activeThreshold}
        onChange={playback.controls.setThreshold}
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SingleSampleSimulator
          sample={selectedFeatureRow}
          prediction={selectedPrediction}
          featureValues={featureValues}
          result={mockResult}
          selectedSample={selectedSample}
          sampleOptions={sampleOptions}
          onSampleChange={setSelectedSample}
          onFeatureChange={(index, value) =>
            setFeatureValues((current) =>
              current.map((item, itemIndex) => (itemIndex === index ? value : item)),
            )
          }
        />
        <ConfidenceSimulator
          probability={mockResult.probability}
          confidence={mockResult.confidenceBand}
          onSelectPreset={(preset) => {
            if (!selectedFeatureRow) return;
            setFeatureValues(
              applyRiskPresetValues(
                selectedFeatureRow.values,
                data.config,
                preset,
                playback.activeThreshold,
              ),
            );
          }}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <BatchScenarioSimulator data={effectiveScenarioData} />
        <FeatureSensitivitySimulator
          deltaProbability={sensitivity?.deltaProbability ?? 0}
          topChanged={sensitivity?.topChanged ?? []}
          onApply={(mode) => {
            if (!selectedFeatureRow) return;
            setFeatureValues((current) =>
              perturbFeatureValues(
                current,
                Array.from({ length: Math.min(10, current.length) }, (_, index) => index),
                mode,
                selectedFeatureRow.values,
                data.config.seed ?? 42,
              ),
            );
          }}
        />
      </div>

      <OutcomeExplorer
        rows={outcomeRows}
        filter={outcomeFilter}
        query={query}
        onFilterChange={setOutcomeFilter}
        onQueryChange={setQuery}
        onSelectRow={setSelectedSample}
      />

      <PlaybackSimulatorPanel
        isPlaying={playback.isPlaying}
        speed={playback.speed}
        data={playback.chartWindow}
        threshold={playback.activeThreshold}
        currentIndex={playback.currentIndex}
        total={data.predictions.length}
        probability={playback.currentSample?.pred_probability ?? 0}
        onPlay={playback.controls.play}
        onPause={playback.controls.pause}
        onReset={playback.controls.reset}
        onStepBack={playback.controls.stepBack}
        onStepForward={playback.controls.stepForward}
        onSpeedChange={playback.controls.setSpeed}
      />
    </div>
  );
}
