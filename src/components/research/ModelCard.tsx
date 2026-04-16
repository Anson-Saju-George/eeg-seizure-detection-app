import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ArtifactBundle } from "@/types/artifacts";

function fallbackArray(values: number[] | undefined, fallback: number[]) {
  return values && values.length > 0 ? values : fallback;
}

export function ModelCard({ bundle }: { bundle: ArtifactBundle }) {
  const hiddenDims = fallbackArray(bundle.config.hidden_dims, [256, 128, 64]);
  const inputDim = bundle.config.input_dim || 178;
  const dropout = Number.isFinite(bundle.config.dropout) ? bundle.config.dropout : 0.25;
  const threshold = Number.isFinite(bundle.config.best_threshold)
    ? bundle.config.best_threshold
    : 0.63;

  const summaryItems = [
    { label: "Name", value: "SeizureMLP" },
    { label: "Framework", value: "PyTorch" },
    { label: "Task", value: "Binary classification" },
    { label: "Input dimension", value: String(inputDim) },
    { label: "Hidden dimensions", value: hiddenDims.join(" / ") },
    { label: "Dropout", value: dropout.toFixed(2) },
    { label: "Threshold", value: threshold.toFixed(2) },
    { label: "Output", value: "Seizure probability" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="info">Model Card</Badge>
          <Badge tone="warning">Research/demo only</Badge>
        </div>
        <CardTitle>SeizureMLP architecture and operating point</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {summaryItems.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[var(--border)] bg-black/20 p-4"
            >
              <p className="text-sm text-[var(--muted)]">{item.label}</p>
              <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-[var(--border)] bg-black/20 p-5">
            <p className="text-monitor text-xs uppercase tracking-[0.22em] text-[var(--primary)]">
              Architecture
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-white">
              {[inputDim, ...hiddenDims, 1].map((value, index, list) => (
                <div key={`${value}-${index}`} className="flex items-center gap-3">
                  <div className="rounded-2xl border border-[var(--border)] bg-white/6 px-4 py-3 text-lg font-semibold">
                    {value}
                  </div>
                  {index < list.length - 1 ? <span className="text-[var(--muted)]">→</span> : null}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">
              Input layer with {inputDim} numeric EEG-derived/tabular features, then dense hidden
              layers with ReLU, BatchNorm1d, and dropout before a single seizure-risk output logit.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-[var(--border)] bg-black/20 p-5 text-sm text-[var(--muted-foreground)]">
              <p className="text-monitor text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
                What is an MLP?
              </p>
              <p className="mt-4">
                An <span className="font-semibold text-white">MLP</span>, or{" "}
                <span className="font-semibold text-white">Multi-Layer Perceptron</span>, is a
                feedforward neural network built from fully connected (dense) layers.
              </p>
              <p className="mt-3">
                Each layer transforms numeric input features and passes them forward to the next
                layer. In this project, the MLP takes {inputDim} EEG-derived/tabular numeric
                features and produces one seizure-risk probability.
              </p>
            </div>

            <div className="rounded-3xl border border-[var(--border)] bg-black/20 p-5 text-sm text-[var(--muted-foreground)]">
              <p className="text-monitor text-xs uppercase tracking-[0.22em] text-[var(--warning)]">
                Plain English
              </p>
              <p className="mt-4">
                The model reads {inputDim} numeric feature values, compresses them through three
                dense hidden layers ({hiddenDims.join(", ")}), applies batch normalization, ReLU,
                and dropout={dropout.toFixed(2)} at each stage, and outputs one final seizure
                probability between 0 and 1.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
