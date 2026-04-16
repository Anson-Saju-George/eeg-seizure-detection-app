import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ArtifactBundle } from "@/types/artifacts";

export function ResearchNotesPanel({ bundle }: { bundle: ArtifactBundle }) {
  const hiddenDims =
    bundle.config.hidden_dims && bundle.config.hidden_dims.length > 0
      ? bundle.config.hidden_dims
      : [256, 128, 64];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-[var(--muted-foreground)]">
        <p>
          This project uses a PyTorch multi-layer perceptron (MLP) for binary seizure vs
          non-seizure classification.
        </p>
        <p>
          Architecture: input dimension {bundle.config.input_dim || 178}, hidden layers{" "}
          {hiddenDims.join(", ")}, ReLU activations, BatchNorm1d after each hidden layer,
          dropout {bundle.config.dropout.toFixed(2)}, and a single seizure-risk output logit.
        </p>
        <p>
          Training setup: BCEWithLogitsLoss, AdamW, ReduceLROnPlateau scheduling, early
          stopping on validation ROC-AUC, and positive-class weighting via pos_weight.
        </p>
        <p>
          Evaluation uses saved test predictions for ROC, PR, threshold sweeps, confusion
          matrix analysis, and playback simulation. Tuned operating threshold:{" "}
          {bundle.config.best_threshold.toFixed(2)}.
        </p>
        <p>
          Deployment note: the frontend does not execute the PyTorch model directly.
          Playback and simulator views use saved prediction artifacts and deterministic
          mock feature vectors, while backend inference can later use the saved state_dict
          and preprocessing bundle.
        </p>
        <p>Research/demo simulator only. Not for clinical use.</p>
      </CardContent>
    </Card>
  );
}
