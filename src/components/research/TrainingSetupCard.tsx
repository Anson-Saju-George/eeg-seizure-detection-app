import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const setupItems = [
  { label: "Loss", value: "BCEWithLogitsLoss" },
  { label: "Optimizer", value: "AdamW" },
  { label: "Scheduler", value: "ReduceLROnPlateau" },
  { label: "Class balancing", value: "pos_weight" },
  { label: "Early stopping", value: "Validation ROC-AUC" },
  { label: "Threshold tuning", value: "Validation predictions" },
];

export function TrainingSetupCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Training Setup</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {setupItems.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-[var(--border)] bg-black/20 p-4"
          >
            <p className="text-sm text-[var(--muted)]">{item.label}</p>
            <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
