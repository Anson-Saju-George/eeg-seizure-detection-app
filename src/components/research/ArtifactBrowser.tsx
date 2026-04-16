import { Download, FileImage, FileJson, FileSpreadsheet, FileType2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveAppPath } from "@/services/appConfig";
import type { ArtifactRecord } from "@/types/artifacts";

function getIcon(kind: ArtifactRecord["kind"]) {
  if (kind === "json") return FileJson;
  if (kind === "csv") return FileSpreadsheet;
  if (kind === "image") return FileImage;
  return FileType2;
}

export function ArtifactBrowser({ artifacts }: { artifacts: ArtifactRecord[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Artifact Listing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {artifacts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-black/20 p-4 text-sm text-[var(--muted-foreground)]">
            No artifacts were detected in `public/data`.
          </div>
        ) : (
          artifacts.map((artifact) => {
            const Icon = getIcon(artifact.kind);
            return (
              <div
                key={artifact.name}
                className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/6 p-2">
                    <Icon className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{artifact.name}</p>
                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                      {artifact.kind}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={artifact.available ? "success" : "warning"}>
                    {artifact.available ? "available" : "missing"}
                  </Badge>
                  {artifact.available ? (
                    <a
                      href={artifact.path.startsWith("/data/") ? resolveAppPath(artifact.path.slice(1)) : artifact.path}
                      download
                      className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white/5 px-3 py-2 text-sm text-white"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
