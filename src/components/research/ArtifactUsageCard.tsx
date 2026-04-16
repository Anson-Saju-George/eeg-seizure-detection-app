import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const usageItems = [
  {
    title: "history.csv",
    body: "Powers training-history charts for loss, ROC-AUC, and F1 across epochs.",
  },
  {
    title: "test_predictions.csv",
    body: "Powers ROC, PR, confusion matrix, threshold sweep validation, and playback simulation.",
  },
  {
    title: "threshold_table.csv",
    body: "Used when present, but validated against derived metrics before display.",
  },
  {
    title: ".pt model artifact",
    body: "Reserved for backend inference. The browser does not execute the PyTorch model directly.",
  },
];

export function ArtifactUsageCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Artifact Usage</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {usageItems.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-[var(--border)] bg-black/20 p-4"
          >
            <p className="text-lg font-semibold text-white">{item.title}</p>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">{item.body}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
