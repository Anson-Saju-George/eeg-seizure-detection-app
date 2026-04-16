import { useMemo } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OutcomeFilter } from "@/lib/simulator";
import type { PredictionRow } from "@/types/artifacts";

export function OutcomeExplorer({
  rows,
  filter,
  query,
  onFilterChange,
  onQueryChange,
  onSelectRow,
}: {
  rows: PredictionRow[];
  filter: OutcomeFilter;
  query: string;
  onFilterChange: (value: OutcomeFilter) => void;
  onQueryChange: (value: string) => void;
  onSelectRow: (sampleIndex: number) => void;
}) {
  const visibleRows = useMemo(() => {
    return rows
      .filter((row) =>
        query.trim().length === 0
          ? true
          : String(row.sampleIndex).includes(query.trim()) ||
            row.pred_probability.toFixed(3).includes(query.trim()),
      )
      .slice(0, 12);
  }, [query, rows]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>False Positive / False Negative Explorer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(["ALL", "TP", "TN", "FP", "FN"] as OutcomeFilter[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onFilterChange(item)}
              className={`rounded-xl border px-3 py-2 text-sm ${
                filter === item
                  ? "border-transparent bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "border-[var(--border)] bg-white/5 text-[var(--muted)]"
              }`}
            >
              {item}
            </button>
          ))}
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search sample"
            className="min-w-[180px] rounded-xl border border-[var(--border)] bg-black/20 px-3 py-2 text-sm text-white"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
          <table className="min-w-full divide-y divide-[var(--border)] text-sm">
            <thead className="bg-black/20 text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 text-left">Sample</th>
                <th className="px-4 py-3 text-left">Probability</th>
                <th className="px-4 py-3 text-left">True</th>
                <th className="px-4 py-3 text-left">Pred</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] bg-[rgba(4,10,17,0.58)]">
              {visibleRows.map((row) => (
                <tr
                  key={row.sampleIndex}
                  className="cursor-pointer hover:bg-white/5"
                  onClick={() => onSelectRow(row.sampleIndex)}
                >
                  <td className="px-4 py-3 text-white">{row.sampleIndex}</td>
                  <td className="px-4 py-3 text-white">{row.pred_probability.toFixed(4)}</td>
                  <td className="px-4 py-3 text-white">{row.true_label}</td>
                  <td className="px-4 py-3 text-white">{row.pred_label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
