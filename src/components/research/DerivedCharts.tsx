import type { ReactNode } from "react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ThresholdRow } from "@/types/artifacts";

function Shell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">{children}</div>
      </CardContent>
    </Card>
  );
}

const tooltipStyle = {
  borderRadius: 16,
  border: "1px solid rgba(128, 164, 206, 0.18)",
  background: "rgba(3, 10, 18, 0.94)",
};

export function DerivedCharts({
  rocCurve,
  prCurve,
  thresholds,
  histogram,
}: {
  rocCurve: Array<{ threshold: number; tpr: number; fpr: number }>;
  prCurve: Array<{ threshold: number; precision: number; recall: number }>;
  thresholds: ThresholdRow[];
  histogram: Array<{ bucket: string; nonSeizure: number; seizure: number }>;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Shell title="ROC Curve">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rocCurve}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="fpr" stroke="#8ca1ba" type="number" domain={[0, 1]} />
            <YAxis dataKey="tpr" stroke="#8ca1ba" type="number" domain={[0, 1]} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="tpr" stroke="#64c0ff" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Shell>

      <Shell title="Precision-Recall Curve">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={prCurve}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="recall" stroke="#8ca1ba" type="number" domain={[0, 1]} />
            <YAxis dataKey="precision" stroke="#8ca1ba" type="number" domain={[0, 1]} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="precision" stroke="#16c79a" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Shell>

      <Shell title="Threshold vs F1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={thresholds}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="threshold" stroke="#8ca1ba" />
            <YAxis stroke="#8ca1ba" domain={[0, 1]} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="f1" stroke="#ffd166" fill="rgba(255,209,102,0.24)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </Shell>

      <Shell title="Probability Histogram">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={histogram}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="bucket" stroke="#8ca1ba" />
            <YAxis stroke="#8ca1ba" />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="nonSeizure" stackId="a" fill="#64c0ff" radius={[6, 6, 0, 0]} />
            <Bar dataKey="seizure" stackId="a" fill="#ff6b7a" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Shell>
    </div>
  );
}
