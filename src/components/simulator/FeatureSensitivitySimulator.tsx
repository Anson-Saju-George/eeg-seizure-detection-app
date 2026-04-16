import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FeatureSensitivitySimulator({
  deltaProbability,
  topChanged,
  onApply,
}: {
  deltaProbability: number;
  topChanged: Array<{ featureIndex: number; before: number; after: number; delta: number }>;
  onApply: (mode: "plus5" | "minus5" | "plus10" | "minus10" | "noise" | "reset") => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Sensitivity Simulator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => onApply("plus5")}>+5%</Button>
          <Button variant="outline" size="sm" onClick={() => onApply("minus5")}>-5%</Button>
          <Button variant="outline" size="sm" onClick={() => onApply("plus10")}>+10%</Button>
          <Button variant="outline" size="sm" onClick={() => onApply("minus10")}>-10%</Button>
          <Button variant="outline" size="sm" onClick={() => onApply("noise")}>Add Noise</Button>
          <Button variant="ghost" size="sm" onClick={() => onApply("reset")}>Reset</Button>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-black/20 p-4">
          <p className="text-sm text-[var(--muted)]">Probability Delta</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {(deltaProbability * 100).toFixed(2)}%
          </p>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topChanged}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="featureIndex" stroke="#8ca1ba" />
              <YAxis stroke="#8ca1ba" />
              <Tooltip
                contentStyle={{
                  borderRadius: 16,
                  border: "1px solid rgba(128, 164, 206, 0.18)",
                  background: "rgba(3, 10, 18, 0.94)",
                }}
              />
              <Bar dataKey="delta" fill="#16c79a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
