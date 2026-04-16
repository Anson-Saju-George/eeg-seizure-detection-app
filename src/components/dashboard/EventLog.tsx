import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PlaybackEvent } from "@/store/playbackStore";

export function EventLog({ events }: { events: PlaybackEvent[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Event Log</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-black/20 p-4 text-sm text-[var(--muted-foreground)]">
            No alert events recorded yet. Alerts are logged when probability crosses the
            active threshold during forward playback.
          </div>
        ) : (
          events.slice(0, 8).map((event) => (
            <div
              key={event.id}
              className="rounded-2xl border border-[var(--border)] bg-black/20 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-white">
                  Threshold crossing at sample {event.sampleIndex}
                </p>
                <p className="text-monitor text-xs uppercase tracking-[0.18em] text-[var(--danger)]">
                  {event.status}
                </p>
              </div>
              <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                {event.timestampLabel} · risk {event.probability.toFixed(3)} · threshold{" "}
                {event.threshold.toFixed(2)}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
