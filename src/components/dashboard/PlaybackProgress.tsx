import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PlaybackProgress({
  currentIndex,
  total,
  probability,
}: {
  currentIndex: number;
  total: number;
  probability: number;
}) {
  const progress = total <= 1 ? 0 : (currentIndex / (total - 1)) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Playback Position</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-3 overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] via-[var(--primary)] to-[var(--danger)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--muted)]">
            Sample {Math.min(currentIndex + 1, total)} / {total}
          </span>
          <span className="text-monitor text-white">{(probability * 100).toFixed(1)}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
