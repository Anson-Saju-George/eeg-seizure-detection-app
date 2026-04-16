import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PlaybackSpeed } from "@/store/playbackStore";

const SPEEDS: PlaybackSpeed[] = [0.5, 1, 2, 4];

export function PlaybackControls({
  isPlaying,
  speed,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBack,
  onSpeedChange,
}: {
  isPlaying: boolean;
  speed: PlaybackSpeed;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-[var(--border)] bg-black/20 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={isPlaying ? onPause : onPlay}>
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button variant="outline" onClick={onStepBack}>
          <SkipBack className="h-4 w-4" />
          Step Back
        </Button>
        <Button variant="outline" onClick={onStepForward}>
          <SkipForward className="h-4 w-4" />
          Step Forward
        </Button>
        <Button variant="ghost" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {SPEEDS.map((candidate) => (
          <button
            key={candidate}
            type="button"
            onClick={() => onSpeedChange(candidate)}
            className={`rounded-xl border px-3 py-2 text-sm transition-colors ${
              speed === candidate
                ? "border-transparent bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "border-[var(--border)] bg-white/5 text-[var(--muted)] hover:text-white"
            }`}
          >
            {candidate}x
          </button>
        ))}
      </div>
    </div>
  );
}
