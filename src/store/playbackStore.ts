import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PlaybackSpeed = 0.5 | 1 | 2 | 4;

export interface PlaybackEvent {
  id: string;
  sampleIndex: number;
  probability: number;
  threshold: number;
  status: "NORMAL" | "WARNING" | "HIGH RISK";
  timestampLabel: string;
}

interface PlaybackState {
  currentIndex: number;
  isPlaying: boolean;
  speed: PlaybackSpeed;
  activeThreshold: number;
  maxIndex: number;
  eventLog: PlaybackEvent[];
  lastAlertIndex: number | null;
  initialize: (maxIndex: number, threshold: number) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  stepForward: (nextProbability: number, previousProbability: number) => void;
  stepBack: () => void;
  tick: (nextProbability: number, previousProbability: number) => void;
  setSpeed: (speed: PlaybackSpeed) => void;
  setThreshold: (threshold: number) => void;
}

function toStatus(probability: number, threshold: number) {
  if (probability >= threshold) return "HIGH RISK" as const;
  if (probability >= Math.max(0, threshold - 0.1)) return "WARNING" as const;
  return "NORMAL" as const;
}

function createEvent(sampleIndex: number, probability: number, threshold: number): PlaybackEvent {
  const seconds = sampleIndex * 2;
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");

  return {
    id: `${sampleIndex}-${probability.toFixed(6)}-${threshold.toFixed(3)}`,
    sampleIndex,
    probability,
    threshold,
    status: toStatus(probability, threshold),
    timestampLabel: `T+${minutes}:${remainder}`,
  };
}

export const usePlaybackStore = create<PlaybackState>()(
  persist(
    (set, get) => ({
      currentIndex: 0,
      isPlaying: false,
      speed: 1,
      activeThreshold: 0.63,
      maxIndex: 0,
      eventLog: [],
      lastAlertIndex: null,
      initialize: (maxIndex, threshold) =>
        set((state) => ({
          maxIndex,
          activeThreshold: state.activeThreshold || threshold,
          currentIndex: state.currentIndex > maxIndex ? 0 : state.currentIndex,
        })),
      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      reset: () =>
        set((state) => ({
          currentIndex: 0,
          isPlaying: false,
          speed: state.speed,
          activeThreshold: state.activeThreshold,
          maxIndex: state.maxIndex,
          eventLog: [],
          lastAlertIndex: null,
        })),
      stepForward: (nextProbability, previousProbability) => {
        const state = get();
        const nextIndex = Math.min(state.currentIndex + 1, state.maxIndex);
        const shouldLog =
          previousProbability < state.activeThreshold &&
          nextProbability >= state.activeThreshold &&
          state.lastAlertIndex !== nextIndex;

        set({
          currentIndex: nextIndex,
          eventLog: shouldLog
            ? [
                createEvent(nextIndex, nextProbability, state.activeThreshold),
                ...state.eventLog,
              ]
            : state.eventLog,
          lastAlertIndex: shouldLog ? nextIndex : state.lastAlertIndex,
        });
      },
      stepBack: () =>
        set((state) => ({
          currentIndex: Math.max(state.currentIndex - 1, 0),
          isPlaying: false,
        })),
      tick: (nextProbability, previousProbability) => {
        const state = get();
        if (!state.isPlaying) return;

        const nextIndex = Math.min(state.currentIndex + 1, state.maxIndex);
        const shouldLog =
          previousProbability < state.activeThreshold &&
          nextProbability >= state.activeThreshold &&
          state.lastAlertIndex !== nextIndex;

        set({
          currentIndex: nextIndex,
          isPlaying: nextIndex < state.maxIndex,
          eventLog: shouldLog
            ? [
                createEvent(nextIndex, nextProbability, state.activeThreshold),
                ...state.eventLog,
              ]
            : state.eventLog,
          lastAlertIndex: shouldLog ? nextIndex : state.lastAlertIndex,
        });
      },
      setSpeed: (speed) => set({ speed }),
      setThreshold: (threshold) =>
        set({
          activeThreshold: threshold,
          eventLog: [],
          lastAlertIndex: null,
        }),
    }),
    {
      name: "seizure-monitor-playback",
      partialize: (state) => ({
        speed: state.speed,
        activeThreshold: state.activeThreshold,
      }),
    },
  ),
);

export function getPlaybackStatus(probability: number, threshold: number) {
  return toStatus(probability, threshold);
}
