import { Activity, Binary, ChartSpline, ShieldAlert } from "lucide-react";

import { KpiCard } from "@/components/dashboard/KpiCard";

export function ResearchMetricCards({
  rocAuc,
  prAuc,
  bestF1,
  threshold,
  bestF1Threshold,
}: {
  rocAuc: number;
  prAuc: number;
  bestF1: number;
  threshold: number;
  bestF1Threshold: number;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="ROC-AUC"
        value={rocAuc.toFixed(3)}
        hint="Derived from saved test predictions"
        icon={<ChartSpline className="h-5 w-5" />}
      />
      <KpiCard
        label="PR-AUC"
        value={prAuc.toFixed(3)}
        hint="Precision-recall area under curve"
        icon={<Activity className="h-5 w-5" />}
      />
      <KpiCard
        label="Best F1"
        value={bestF1.toFixed(3)}
        hint={`Max F1 at threshold ${bestF1Threshold.toFixed(2)}`}
        icon={<Binary className="h-5 w-5" />}
      />
      <KpiCard
        label="Tuned Threshold"
        value={threshold.toFixed(2)}
        hint="Configured operating point"
        icon={<ShieldAlert className="h-5 w-5" />}
      />
    </div>
  );
}
