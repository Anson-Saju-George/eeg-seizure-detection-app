import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ArtifactBundle } from "@/types/artifacts";

export function ResearchNotesPanel({ bundle }: { bundle: ArtifactBundle }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Research Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-[var(--muted-foreground)]">
        <p>Model type: PyTorch MLP.</p>
        <p>Task: binary seizure vs non-seizure classification.</p>
        <p>Tuned threshold: {bundle.config.best_threshold.toFixed(2)}.</p>
        <p>Playback and simulator views operate on saved prediction artifacts and deterministic mock feature vectors.</p>
        <p>Research/demo simulator only. Not for clinical use.</p>
      </CardContent>
    </Card>
  );
}
