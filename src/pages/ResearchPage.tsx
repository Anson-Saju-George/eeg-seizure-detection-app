import { useState } from "react";

import { ArtifactBrowser } from "@/components/research/ArtifactBrowser";
import { ConfusionMatrixCard, type MatrixColorMap } from "@/components/research/ConfusionMatrixCard";
import { DerivedCharts } from "@/components/research/DerivedCharts";
import { ResearchMetricCards } from "@/components/research/ResearchMetricCards";
import { ResearchNotesPanel } from "@/components/research/ResearchNotesPanel";
import { TrainingCharts } from "@/components/research/TrainingCharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useArtifactBundle } from "@/hooks/useArtifactBundle";
import { deriveResearchMetrics } from "@/lib/research";

export function ResearchPage() {
  const { data, error, isLoading } = useArtifactBundle();
  const [colorMap, setColorMap] = useState<MatrixColorMap>(() => {
    const stored = window.localStorage.getItem("research-colormap");
    return (stored as MatrixColorMap) || "coolwarm";
  });

  function handleColorMapChange(value: MatrixColorMap) {
    setColorMap(value);
    window.localStorage.setItem("research-colormap", value);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-36" />
          ))}
        </div>
        <Skeleton className="h-80" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-[rgba(255,107,122,0.24)]">
        <CardHeader>
          <Badge tone="danger" className="w-fit">
            Load Error
          </Badge>
          <CardTitle>Research page unavailable</CardTitle>
          <CardDescription>{error ?? "Unable to load research artifacts."}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-[var(--muted-foreground)]">
          This page requires the artifact bundle to compute evaluation metrics and charts.
        </CardContent>
      </Card>
    );
  }

  const research = deriveResearchMetrics(data);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <Badge tone="info" className="w-fit">
            Research workspace
          </Badge>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Model analysis and artifact review
          </h2>
          <p className="max-w-3xl text-[var(--muted-foreground)]">
            Training history, ROC and precision-recall analysis, threshold sweeps, confusion matrix views,
            histogram analysis, and artifact downloads are all derived from local exports.
          </p>
        </div>
        <Badge tone="warning">Research/demo simulator only</Badge>
      </div>

      <ResearchMetricCards
        rocAuc={research.rocAuc}
        prAuc={research.prAuc}
        bestF1={research.bestF1}
        threshold={data.config.best_threshold}
      />

      <TrainingCharts history={data.history} />

      <DerivedCharts
        rocCurve={research.rocCurve}
        prCurve={research.prCurve}
        thresholds={data.thresholds}
        histogram={research.histogram}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <ConfusionMatrixCard
          metrics={research.confusion}
          colorMap={colorMap}
          onColorMapChange={handleColorMapChange}
        />
        <ResearchNotesPanel bundle={data} />
      </div>

      <ArtifactBrowser artifacts={data.artifacts} />
    </div>
  );
}
