import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskGauge } from "@/components/dashboard/RiskGauge";
import { Button } from "@/components/ui/button";

export function ConfidenceSimulator({
  probability,
  confidence,
  onSelectPreset,
}: {
  probability: number;
  confidence: "Low" | "Medium" | "High";
  onSelectPreset: (value: "Low" | "Medium" | "High") => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Confidence Simulator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RiskGauge probability={probability} />
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Low", active: confidence === "Low" },
            { label: "Medium", active: confidence === "Medium" },
            { label: "High", active: confidence === "High" },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onSelectPreset(item.label as "Low" | "Medium" | "High")}
              className={`rounded-2xl border p-4 text-center ${
                item.active
                  ? "border-transparent bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "border-[var(--border)] bg-black/20 text-[var(--muted)] hover:text-white"
              }`}
            >
              <div className="font-medium">{item.label}</div>
              <div className="mt-1 text-xs opacity-80">
                Simulate {item.label.toLowerCase()} risk
              </div>
            </button>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={() => onSelectPreset("Medium")}>
          Re-center sample
        </Button>
      </CardContent>
    </Card>
  );
}
