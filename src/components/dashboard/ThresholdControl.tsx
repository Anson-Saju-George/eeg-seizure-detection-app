import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ThresholdControl({
  value,
  warningFloor,
  onChange,
}: {
  value: number;
  warningFloor: number;
  onChange: (value: number) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert Threshold</CardTitle>
        <CardDescription>
          Adjust the alert line used for playback monitoring. Event logs are recalculated
          from this point forward.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-[var(--border)] bg-black/20 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-[var(--muted)]">Threshold</span>
            <span className="text-monitor text-lg text-white">{value.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.05}
            max={0.95}
            step={0.01}
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
            className="w-full accent-[var(--primary)]"
          />
          <div className="mt-3 flex items-center justify-between text-xs text-[var(--muted-foreground)]">
            <span>Warning floor {warningFloor.toFixed(2)}</span>
            <span>High-risk line {value.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
