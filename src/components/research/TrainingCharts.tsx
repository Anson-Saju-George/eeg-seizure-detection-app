import type { ReactNode } from "react";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HistoryRow } from "@/types/artifacts";

function ChartShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
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

export function TrainingCharts({ history }: { history: HistoryRow[] }) {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <ChartShell title="Training Loss">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="epoch" stroke="#8ca1ba" />
            <YAxis stroke="#8ca1ba" />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="train_loss" stroke="#64c0ff" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell title="Train vs Validation ROC-AUC">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="epoch" stroke="#8ca1ba" />
            <YAxis domain={[0.8, 1]} stroke="#8ca1ba" />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Line type="monotone" dataKey="train_roc_auc" stroke="#16c79a" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="val_roc_auc" stroke="#ffd166" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell title="Train vs Validation F1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="epoch" stroke="#8ca1ba" />
            <YAxis domain={[0.7, 1]} stroke="#8ca1ba" />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Line type="monotone" dataKey="train_f1" stroke="#64c0ff" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="val_f1" stroke="#ff6b7a" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartShell>
    </div>
  );
}

const tooltipStyle = {
  borderRadius: 16,
  border: "1px solid rgba(128, 164, 206, 0.18)",
  background: "rgba(3, 10, 18, 0.94)",
};
