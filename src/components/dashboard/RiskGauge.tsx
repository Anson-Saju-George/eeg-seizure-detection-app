import { motion } from "framer-motion";

export function RiskGauge({ probability }: { probability: number }) {
  const clamped = Math.max(0, Math.min(1, probability));
  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - clamped);

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-[var(--border)] bg-black/20 p-4">
      <div className="relative h-40 w-40">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
          <circle
            cx="70"
            cy="70"
            r="54"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="12"
          />
          <motion.circle
            cx="70"
            cy="70"
            r="54"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.35 }}
          />
          <defs>
            <linearGradient id="gaugeGradient" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#16c79a" />
              <stop offset="60%" stopColor="#64c0ff" />
              <stop offset="100%" stopColor="#ff6b7a" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-monitor text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            Current Risk
          </p>
          <p className="mt-2 text-4xl font-semibold text-white">
            {(clamped * 100).toFixed(0)}%
          </p>
        </div>
      </div>
    </div>
  );
}
