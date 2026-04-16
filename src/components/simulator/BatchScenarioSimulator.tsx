import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BatchScenarioSimulator({
  data,
}: {
  data: Array<{ threshold: number; flagged: number; total: number }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Batch Scenario Simulator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          {data.map((item) => (
            <div key={item.threshold} className="rounded-2xl border border-[var(--border)] bg-black/20 p-4">
              <p className="text-sm text-[var(--muted)]">Threshold {item.threshold.toFixed(2)}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{item.flagged}</p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                flagged positives of {item.total}
              </p>
            </div>
          ))}
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="threshold" stroke="#8ca1ba" />
              <YAxis stroke="#8ca1ba" />
              <Tooltip
                contentStyle={{
                  borderRadius: 16,
                  border: "1px solid rgba(128, 164, 206, 0.18)",
                  background: "rgba(3, 10, 18, 0.94)",
                }}
              />
              <Bar dataKey="flagged" fill="#64c0ff" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
