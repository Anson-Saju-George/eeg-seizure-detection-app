import { useEffect, useEffectEvent, useMemo } from "react";

import { getPlaybackStatus, usePlaybackStore } from "@/store/playbackStore";
import type { PredictionRow } from "@/types/artifacts";

export function usePlaybackEngine(
  predictions: PredictionRow[],
  defaultThreshold: number,
) {
  const {
    currentIndex,
    isPlaying,
    speed,
    activeThreshold,
    eventLog,
    initialize,
    play,
    pause,
    reset,
    stepForward,
    stepBack,
    tick,
    setSpeed,
    setThreshold,
  } = usePlaybackStore();

  useEffect(() => {
    initialize(Math.max(predictions.length - 1, 0), defaultThreshold);
  }, [defaultThreshold, initialize, predictions.length]);

  const onTick = useEffectEvent(() => {
    const nextRow = predictions[Math.min(currentIndex + 1, predictions.length - 1)];
    const previousRow = predictions[currentIndex];
    if (!nextRow || !previousRow) return;
    tick(nextRow.pred_probability, previousRow.pred_probability);
  });

  useEffect(() => {
    if (!isPlaying || predictions.length === 0) return;

    const interval = window.setInterval(() => {
      onTick();
    }, Math.max(120, 900 / speed));

    return () => window.clearInterval(interval);
  }, [isPlaying, onTick, predictions.length, speed]);

  const currentSample = predictions[currentIndex] ?? null;
  const chartWindow = useMemo(() => {
    const start = Math.max(0, currentIndex - 44);
    return predictions.slice(start, currentIndex + 1).map((row) => ({
      sampleIndex: row.sampleIndex,
      probability: row.pred_probability,
      threshold: activeThreshold,
      alert: row.pred_probability >= activeThreshold ? row.pred_probability : null,
    }));
  }, [activeThreshold, currentIndex, predictions]);

  const waveform = useMemo(() => {
    return Array.from({ length: 60 }, (_, index) => {
      const anchor = currentIndex + index;
      const amplitude =
        0.45 +
        Math.sin(anchor * 0.22) * 0.24 +
        Math.cos(anchor * 0.08) * 0.17 +
        (currentSample?.pred_probability ?? 0.2) * 0.35;

      return {
        position: index,
        amplitude,
      };
    });
  }, [currentIndex, currentSample?.pred_probability]);

  const status = currentSample
    ? getPlaybackStatus(currentSample.pred_probability, activeThreshold)
    : "NORMAL";

  return {
    chartWindow,
    currentIndex,
    currentSample,
    eventLog,
    isPlaying,
    speed,
    activeThreshold,
    waveform,
    status,
    controls: {
      play,
      pause,
      reset,
      stepBack,
      stepForward: () => {
        const nextRow = predictions[Math.min(currentIndex + 1, predictions.length - 1)];
        const previousRow = predictions[currentIndex];
        if (!nextRow || !previousRow) return;
        stepForward(nextRow.pred_probability, previousRow.pred_probability);
      },
      setSpeed,
      setThreshold,
    },
  };
}
