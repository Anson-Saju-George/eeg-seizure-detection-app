import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaybackControls } from "@/components/dashboard/PlaybackControls";
import { RiskChart } from "@/components/dashboard/RiskChart";
import { PlaybackProgress } from "@/components/dashboard/PlaybackProgress";
import type { PlaybackSpeed } from "@/store/playbackStore";

export function PlaybackSimulatorPanel({
  isPlaying,
  speed,
  data,
  threshold,
  currentIndex,
  total,
  probability,
  onPlay,
  onPause,
  onReset,
  onStepBack,
  onStepForward,
  onSpeedChange,
}: {
  isPlaying: boolean;
  speed: PlaybackSpeed;
  data: Array<{ sampleIndex: number; probability: number; threshold: number; alert: number | null }>;
  threshold: number;
  currentIndex: number;
  total: number;
  probability: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Playback Simulator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PlaybackControls
          isPlaying={isPlaying}
          speed={speed}
          onPlay={onPlay}
          onPause={onPause}
          onReset={onReset}
          onStepBack={onStepBack}
          onStepForward={onStepForward}
          onSpeedChange={onSpeedChange}
        />
        <RiskChart data={data} threshold={threshold} />
        <PlaybackProgress currentIndex={currentIndex} total={total} probability={probability} />
      </CardContent>
    </Card>
  );
}
