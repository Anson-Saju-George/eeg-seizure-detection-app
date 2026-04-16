import { Area, AreaChart, ResponsiveContainer } from "recharts";

import type { ReturnTypeWaveform } from "@/types/dashboard";

export function WaveformStrip({ data }: { data: ReturnTypeWaveform }) {
  return (
    <div className="h-28 rounded-3xl border border-[var(--border)] bg-[rgba(4,10,17,0.78)] p-3">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-monitor text-xs uppercase tracking-[0.22em] text-[var(--primary)]">
          Synthetic waveform strip
        </p>
        <p className="text-xs text-[var(--muted-foreground)]">
          Aesthetic only. Not raw EEG.
        </p>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="waveGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#16c79a" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#16c79a" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <Area
            isAnimationActive={false}
            type="monotone"
            dataKey="amplitude"
            stroke="#16c79a"
            strokeWidth={1.6}
            fill="url(#waveGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
