import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function RiskChart({
  data,
  threshold,
}: {
  data: Array<{
    sampleIndex: number;
    probability: number;
    threshold: number;
    alert: number | null;
  }>;
  threshold: number;
}) {
  return (
    <div className="h-[360px] rounded-3xl border border-[var(--border)] bg-[rgba(4,10,17,0.8)] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-monitor text-xs uppercase tracking-[0.22em] text-[var(--primary)]">
            Streaming risk trace
          </p>
          <p className="text-sm text-[var(--muted-foreground)]">
            Recent playback window with threshold line and alert markers.
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="sampleIndex"
            stroke="#8ca1ba"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 1]}
            stroke="#8ca1ba"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 16,
              border: "1px solid rgba(128, 164, 206, 0.18)",
              background: "rgba(3, 10, 18, 0.94)",
            }}
          />
          <ReferenceLine
            y={threshold}
            stroke="#ffd166"
            strokeDasharray="6 6"
            ifOverflow="extendDomain"
          />
          <Line
            type="monotone"
            dataKey="probability"
            stroke="#64c0ff"
            strokeWidth={3}
            dot={false}
            isAnimationActive
          />
          <Scatter data={data.filter((entry) => entry.alert !== null)} dataKey="alert" fill="#ff6b7a" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
