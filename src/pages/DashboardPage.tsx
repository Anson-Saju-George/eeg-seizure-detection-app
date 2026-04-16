import {
  Activity,
  Gauge,
  Siren,
  TimerReset,
} from "lucide-react";

import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { ArtifactOverview } from "@/components/dashboard/ArtifactOverview";
import { EventLog } from "@/components/dashboard/EventLog";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PlaybackControls } from "@/components/dashboard/PlaybackControls";
import { PlaybackProgress } from "@/components/dashboard/PlaybackProgress";
import { RiskChart } from "@/components/dashboard/RiskChart";
import { RiskGauge } from "@/components/dashboard/RiskGauge";
import { SamplePanel } from "@/components/dashboard/SamplePanel";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ThresholdControl } from "@/components/dashboard/ThresholdControl";
import { WaveformStrip } from "@/components/dashboard/WaveformStrip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useArtifactBundle } from "@/hooks/useArtifactBundle";
import { usePlaybackEngine } from "@/hooks/usePlaybackEngine";

export function DashboardPage() {
  const { data, error, isLoading } = useArtifactBundle();
  const predictions = data?.predictions ?? [];
  const defaultThreshold = data?.config.best_threshold ?? 0.63;
  const playback = usePlaybackEngine(predictions, defaultThreshold);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Badge tone="info" className="w-fit">
            Loading
          </Badge>
          <CardTitle>Initializing artifact layer</CardTitle>
          <CardDescription>
            Reading saved model exports from `public/data`.
          </CardDescription>
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
          <CardTitle>Artifact ingestion failed</CardTitle>
          <CardDescription>
            {error ?? "The artifact bundle could not be loaded."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--muted-foreground)]">
            The app stays available and later phases can still fall back to deterministic
            mock data if needed.
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentProbability = playback.currentSample?.pred_probability ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <Badge tone="danger" className="w-fit">
            Research/demo simulator only
          </Badge>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Live monitoring dashboard
          </h2>
          <p className="max-w-3xl text-[var(--muted-foreground)]">
            Saved test predictions are being replayed as a streaming risk monitor.
            The waveform strip is synthetic and purely aesthetic.
          </p>
        </div>
        <StatusBadge status={playback.status} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Current Risk"
          value={`${(currentProbability * 100).toFixed(1)}%`}
          hint="Latest prediction probability"
          icon={<Gauge className="h-5 w-5" />}
        />
        <KpiCard
          label="Active Threshold"
          value={playback.activeThreshold.toFixed(2)}
          hint="Alert line in playback mode"
          icon={<Siren className="h-5 w-5" />}
        />
        <KpiCard
          label="Playback Speed"
          value={`${playback.speed}x`}
          hint="Deterministic simulated timing"
          icon={<Activity className="h-5 w-5" />}
        />
        <KpiCard
          label="Current Status"
          value={playback.status}
          hint={`Sample ${playback.currentIndex + 1} of ${data.predictions.length}`}
          icon={<TimerReset className="h-5 w-5" />}
        />
      </div>

      <WaveformStrip data={playback.waveform} />
      <AlertBanner
        status={playback.status}
        probability={currentProbability}
        threshold={playback.activeThreshold}
      />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.95fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Playback control center</CardTitle>
              <CardDescription>
                Pause must freeze the stream exactly in place. Reset clears playback state
                and alert history.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PlaybackControls
                isPlaying={playback.isPlaying}
                speed={playback.speed}
                onPlay={playback.controls.play}
                onPause={playback.controls.pause}
                onReset={playback.controls.reset}
                onStepBack={playback.controls.stepBack}
                onStepForward={playback.controls.stepForward}
                onSpeedChange={playback.controls.setSpeed}
              />
              <RiskChart
                data={playback.chartWindow}
                threshold={playback.activeThreshold}
              />
            </CardContent>
          </Card>
          <PlaybackProgress
            currentIndex={playback.currentIndex}
            total={data.predictions.length}
            probability={currentProbability}
          />
        </div>

        <div className="space-y-6">
          <RiskGauge probability={currentProbability} />
          <ThresholdControl
            value={playback.activeThreshold}
            warningFloor={Math.max(0, playback.activeThreshold - 0.1)}
            onChange={playback.controls.setThreshold}
          />
          <SamplePanel sample={playback.currentSample} status={playback.status} />
          <EventLog events={playback.eventLog} />
        </div>
      </div>

      <ArtifactOverview data={data} />
    </div>
  );
}
